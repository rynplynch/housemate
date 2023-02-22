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
	"golang.org/x/crypto/bcrypt"
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
var EmailError = ApiError{
	http.StatusBadRequest, "Email already in use",
}
var PasswordError = ApiError{
	http.StatusBadRequest, "Invalid Password",
}
var AuthError = ApiError{
	http.StatusUnauthorized, "Not authorized",
}
var LoginError = ApiError{
	http.StatusUnauthorized, "Failed to authenticate",
}
var UnknownError = ApiError{
	http.StatusInternalServerError, "Unknown",
}
var DatabaseError = ApiError{
	http.StatusInternalServerError, "Database error",
}

const RoommateKey = "RoommateID"

func setupRouter() (*gin.Engine, error) {
	var secret string
	var err error
	var b Backend

	if b.database, err = databaseConnect(); err != nil {
		return nil, err
	}
	if secret = os.Getenv("COOKIE_SECRET"); secret == "" {
		secret = "TODO"
	}

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(sessions.Sessions("roommate", cookie.NewStore([]byte(secret))))

	auth := r.Group("/")
	auth.Use(verifyAuth)

	r.POST("/register", b.Register)
	r.POST("/login", b.Login)
	auth.GET("/housemates", b.Housemates)
	auth.GET("/created", b.CreatedBills)
	auth.GET("/assigned", b.AssignedBills)
	auth.POST("/bill", b.CreateBill)
	auth.DELETE("/bill/:id", b.DeleteBill)
	return r, nil
}

func verifyAuth(c *gin.Context) {
	session := sessions.Default(c)
	value := session.Get(RoommateKey)

	if id, ok := value.(int64); ok {
		c.Set(RoommateKey, id)
		c.Next()
		return
	}
	apiFatal(c, nil, AuthError)
	c.Abort()
}

func authRoommate(c *gin.Context, id int64) error {
	session := sessions.Default(c)
	session.Set(RoommateKey, id)
	return session.Save()
}

// Returns JSON error with code
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
func (b Backend) Register(c *gin.Context) {
	data := struct {
		Name     string `binding:"required" json:"name"`
		Email    string `binding:"required" json:"email"`
		Password string `binding:"required" json:"password"`
	}{}

	if err := c.ShouldBindJSON(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}

	hash := []byte(data.Password)
	hash, err := bcrypt.GenerateFromPassword(hash, bcrypt.DefaultCost)
	if err != nil {
		apiFatal(c, err, PasswordError)
		return
	}

	r := Roommate{
		Name:     data.Name,
		Email:    data.Email,
		Password: string(hash),
	}
	if err := b.database.InsertRoommate(&r); err != nil {
		apiFatal(c, err, EmailError)
		return
	}
	if err := authRoommate(c, r.ID); err != nil {
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
func (b Backend) Login(c *gin.Context) {
	data := struct {
		Email    string `binding:"required" json:"email"`
		Password string `binding:"required" json:"password"`
	}{}

	if err := c.ShouldBindJSON(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}

	r, err := b.database.RoommateByEmail(data.Email)
	if err != nil {
		apiFatal(c, err, LoginError)
		return
	}

	pass := []byte(data.Password)
	hash := []byte(r.Password)
	if err := bcrypt.CompareHashAndPassword(hash, pass); err != nil {
		apiFatal(c, err, LoginError)
		return
	}
	if err := authRoommate(c, r.ID); err != nil {
		apiFatal(c, err, UnknownError)
		return
	}
}

// AUTH GET JSON
// - returns: array of roommates within the current household
//
// Fails if database cannot retrieve results
func (b Backend) Housemates(c *gin.Context) {
	id := c.MustGet(RoommateKey).(int64)
	roommates, err := b.database.Housemates(id)

	if err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
	c.JSON(http.StatusOK, gin.H{"roommates": roommates})
}

// AUTH GET JSON
// - returns: array of bills where current roommate is creditor; sorted by time
//
// Fails if database cannot retrieve results
func (b Backend) CreatedBills(c *gin.Context) {
	id := c.MustGet(RoommateKey).(int64)
	bills, err := b.database.BillsByCreditor(id)

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
func (b Backend) AssignedBills(c *gin.Context) {
	id := c.MustGet(RoommateKey).(int64)
	bills, err := b.database.BillsByDebtor(id)

	if err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
	sort.Slice(bills, func(i, j int) bool {
		return bills[i].Due.Before(bills[j].Due)
	})
	c.JSON(http.StatusOK, gin.H{"bills": bills})
}

// AUTH POST JSON
// - debtor: roommate that owes money
// - amount: money owed
// - description: bill description
// - due: date the bill is due
//
// Fails if input values are invalid
func (b Backend) CreateBill(c *gin.Context) {
	id := c.MustGet(RoommateKey).(int64)
	data := struct {
		Debtor      int64     `binding:"required" json:"debtor"`
		Amount      string    `binding:"required" json:"amount"`
		Description string    `binding:"required" json:"description"`
		Due         time.Time `binding:"required" json:"due"`
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
	if err := b.database.InsertBill(&bill); err != nil {
		apiFatal(c, err, DatabaseError)
		return
	}
}

// AUTH DELETE URI
// - id: unique bill identifier
//
// Fails if the authenticated roommate is not the creditor
func (b Backend) DeleteBill(c *gin.Context) {
	id := c.MustGet(RoommateKey).(int64)
	data := struct {
		ID int64 `uri:"id" binding:"required"`
	}{}

	if err := c.ShouldBindUri(&data); err != nil {
		apiFatal(c, err, InputError)
		return
	}
	if err := b.database.DeleteBill(data.ID, id); err != nil {
		apiFatal(c, err, AuthError)
		return
	}
}
