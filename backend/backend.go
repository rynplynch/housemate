package main

import (
	"log"
	"net/http"
	"os"
	"sort"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

type Backend struct {
	database Database
}
type ApiError struct {
	Code    int
	Message string
}

var InputError = ApiError{
	http.StatusBadRequest, "Invalid input",
}
var AuthError = ApiError{
	http.StatusUnauthorized, "Not authorized",
}
var RegisterError = ApiError{
	http.StatusUnauthorized, "Failed to register",
}
var LoginError = ApiError{
	http.StatusUnauthorized, "Failed to authenticate",
}
var DatabaseError = ApiError{
	http.StatusInternalServerError, "Database error",
}
var UnknownError = ApiError{
	http.StatusInternalServerError, "Unknown",
}

const RoommateKey = "RoommateID"

func setupRouter() (*gin.Engine, error) {
	var secret, host string
	var err error
	var x Backend

	if secret = os.Getenv("COOKIE_SECRET"); secret == "" {
		secret = "SECRET"
	}
	if host = os.Getenv("POSTGRES_HOST"); host == "" {
		host = "localhost"
	}
	if x.database, err = databaseConnect(host); err != nil {
		return nil, err
	}

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(sessions.Sessions("roommate", cookie.NewStore([]byte(secret))))
	auth := r.Group("/")
	auth.Use(authorize)

	// ENDPOINTS
	r.POST("/register", x.Register)
	auth.DELETE("/register", x.Unregister)

	r.POST("/login", x.Login)
	auth.DELETE("/login", x.Logout)

	auth.POST("/household", x.CreateHousehold)
	auth.POST("/household/invite", x.InviteToHousehold)
	auth.GET("/household/roommates", x.HouseholdRoommates)
	auth.DELETE("/household", x.LeaveHousehold)

	auth.POST("/bills", x.CreateBill)
	auth.GET("/bills/created", x.CreatedBills)
	auth.GET("/bills/assigned", x.AssignedBills)
	auth.DELETE("/bills/:bill", x.DeleteBill)

	auth.POST("/payments", x.CreatePayment)
	auth.POST("/payments/validate", x.ValidatePayment)
	auth.GET("/payments/:bill", x.Payments)
	auth.DELETE("/payments/:bill/:payment", x.DeletePayment)
	return r, nil
}

func authorize(c *gin.Context) {
	session := sessions.Default(c)
	value := session.Get(RoommateKey)

	if id, ok := value.(string); ok {
		c.Set(RoommateKey, id)
		c.Next()
		return
	}
	apiFatal(c, nil, AuthError)
	c.Abort()
}
func authenticate(c *gin.Context, id string) error {
	session := sessions.Default(c)
	session.Set(RoommateKey, id)
	return session.Save()
}
func unAuthenticate(c *gin.Context) error {
	session := sessions.Default(c)
	session.Clear()
	return session.Save()
}
func apiFatal(c *gin.Context, err error, a ApiError) {
	if err != nil {
		log.Println(err)
	}
	c.JSON(a.Code, gin.H{"error": a.Message})
}

// POST JSON
// - name: Roommate's name
// - email: Email address
// - password: Password
//
// Fails if email is already in use
func (x Backend) Register(c *gin.Context) {
	data := struct {
		Name     string `binding:"required" json:"name"`
		Email    string `binding:"required" json:"email"`
		Password string `binding:"required" json:"password"`
	}{}
	if err := c.ShouldBindJSON(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}
	r := Roommate{
		Name:     data.Name,
		Email:    data.Email,
		Password: data.Password,
	}
	if err := x.database.InsertRoommate(&r); err != nil {
		apiFatal(c, err, RegisterError)
		return
	}
	if err := authenticate(c, r.Id); err != nil {
		apiFatal(c, err, UnknownError)
		return
	}
}

// AUTH DELETE
//
// Fails if database cannot delete current roommate
func (x Backend) Unregister(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)

	if err := x.database.DeleteRoommate(id); err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
	if err := unAuthenticate(c); err != nil {
		apiFatal(c, err, UnknownError)
		return
	}
}

// POST JSON
// - email: Email address
// - password: Password
//
// Fails if there is no registered roommate by the input email address
// Fails if the password is incorrect
func (x Backend) Login(c *gin.Context) {
	data := struct {
		Email    string `binding:"required" json:"email"`
		Password string `binding:"required" json:"password"`
	}{}
	if err := c.ShouldBindJSON(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}
	r := Roommate{
		Email:    data.Email,
		Password: data.Password,
	}
	if err := x.database.RoommateAuthenticate(&r); err != nil {
		apiFatal(c, err, LoginError)
		return
	}
	if err := authenticate(c, r.Id); err != nil {
		apiFatal(c, err, UnknownError)
		return
	}
}

// AUTH DELETE
func (x Backend) Logout(c *gin.Context) {
	if err := unAuthenticate(c); err != nil {
		apiFatal(c, err, UnknownError)
		return
	}
}

// AUTH POST JSON
// - name: New household name
//
// Fails if database cannot create a new household
func (x Backend) CreateHousehold(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)
	data := struct {
		Name string `binding:"required" json:"name"`
	}{}
	if err := c.ShouldBindJSON(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}
	if err := x.database.InsertHousehold(id, data.Name); err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
}

// AUTH POST JSON
// - email: invitee's email address
//
// Fails if invitee is already in a household
func (x Backend) InviteToHousehold(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)
	data := struct {
		Email string `binding:"required" json:"email"`
	}{}
	if err := c.ShouldBindJSON(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}
	if err := x.database.InviteRoommate(id, data.Email); err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
}

// AUTH GET JSON
// - returns: array of roommates within the current household
//
// Fails if database cannot retrieve results
func (x Backend) HouseholdRoommates(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)
	roommates, err := x.database.Housemates(id)

	if err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
	c.JSON(http.StatusOK, gin.H{"roommates": roommates})
}

// AUTH DELETE
//
// Fails if database cannot update current roommate's household
func (x Backend) LeaveHousehold(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)

	if err := x.database.LeaveHousehold(id); err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
}

// AUTH POST JSON
// - debtor: roommate that owes money
// - amount: money owed
// - description: bill description
// - due: date the bill is due
//
// Fails if input values are invalid
func (x Backend) CreateBill(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)
	data := struct {
		Debtor      string    `binding:"required,uuid4" json:"debtor"`
		Amount      string    `binding:"required"       json:"amount"`
		Description string    `binding:"required"       json:"description"`
		Due         time.Time `binding:"required"       json:"due"`
	}{}
	if err := c.ShouldBindJSON(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}
	bill := Bill{
		Creditor:    id,
		Debtor:      data.Debtor,
		Amount:      data.Amount,
		Description: data.Description,
		Due:         data.Due,
	}
	if err := x.database.InsertBill(&bill); err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
}

// AUTH GET JSON
// - returns: array of bills where current roommate is creditor; sorted by time
//
// Fails if database cannot retrieve results
func (x Backend) CreatedBills(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)
	bills, err := x.database.BillsByCreditor(id)

	if err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
	sort.Slice(bills, func(i, j int) bool {
		return bills[i].Due.Before(bills[j].Due)
	})
	c.JSON(http.StatusOK, gin.H{"bills": bills})
}

// AUTH GET JSON
// - returns: array of bills where current roommate is debtor; sorted by time
//
// Fails if database cannot retrieve results
func (x Backend) AssignedBills(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)
	bills, err := x.database.BillsByDebtor(id)

	if err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
	sort.Slice(bills, func(i, j int) bool {
		return bills[i].Due.Before(bills[j].Due)
	})
	c.JSON(http.StatusOK, gin.H{"bills": bills})
}

// AUTH DELETE URI
// - bill: unique bill identifier
//
// Fails if the authenticated roommate is not the creditor
func (x Backend) DeleteBill(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)
	data := struct {
		Bill string `binding:"required,uuid4" uri:"bill"`
	}{}
	if err := c.ShouldBindUri(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}
	if err := x.database.DeleteBill(id, data.Bill); err != nil {
		apiFatal(c, err, AuthError)
		return
	}
}

// AUTH POST JSON
// - bill: uuid of the bill
// - amount: the amount being paid
//
// Fails if input is invalid
func (x Backend) CreatePayment(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)
	data := struct {
		Bill   string `binding:"required,uuid4" json:"bill"`
		Amount string `binding:"required"       json:"amount"`
	}{}
	if err := c.ShouldBindJSON(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}
	p := Payment{
		Bill:   data.Bill,
		Amount: data.Amount,
	}
	if err := x.database.InsertPayment(&p, id); err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
}

// AUTH POST JSON
// - id: time that the payment in question was posted
// - bill: uuid of the bill
// - valid: boolean indicating creditor's decision
//
// Fails if the current roommate is not authorized
func (x Backend) ValidatePayment(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)
	data := struct {
		Id    time.Time `binding:"required"       json:"id" time_format:"2006-01-02T15:04:05Z"`
		Bill  string    `binding:"required,uuid4" json:"bill"`
		Valid bool      `json:"valid"`
	}{}
	if err := c.ShouldBindJSON(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}
	if err := x.database.ValidatePayment(data.Id, data.Bill, data.Valid, id); err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
}

// AUTH GET JSON/URI
// - returns: array of payments for specified bill
//
// Fails if the current roommate is not authorized
// Fails if bill is invalid
func (x Backend) Payments(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)
	data := struct {
		Bill string `binding:"required,uuid4" uri:"bill"`
	}{}
	if err := c.ShouldBindUri(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}

	payments, err := x.database.PaymentsByBill(data.Bill, id)
	if err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
	sort.Slice(payments, func(i, j int) bool {
		return payments[i].Date.Before(payments[j].Date)
	})
	c.JSON(http.StatusOK, gin.H{"payments": payments})
}

// AUTH DELETE URI
// - bill: unique bill identifier
// - payment: time that the payment in question was posted
//
// Fails if database cannot delete payment
func (x Backend) DeletePayment(c *gin.Context) {
	id := c.MustGet(RoommateKey).(string)
	data := struct {
		Bill    string    `binding:"required,uuid4" uri:"bill"`
		Payment time.Time `binding:"required"       uri:"payment" time_format:"2006-01-02T15:04:05Z"`
	}{}
	if err := c.ShouldBindUri(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}
	if err := x.database.DeletePayment(data.Payment, data.Bill, id); err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
}
