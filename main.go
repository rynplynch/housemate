package main

import (
	"html/template"
	"log"
	"net/http"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
	//needed for communication with frontend
	"github.com/gin-contrib/cors"
)

type Backend struct {
	db       Database
	roommate int64
}

func (backend Backend) BillPage(c *gin.Context) {
	bills, err := backend.db.BillsByDebtor(backend.roommate)
	if err != nil {
		log.Println(err)
		return
	}

	sort.Slice(bills, func(i, j int) bool {
		return bills[i].Due.Before(bills[j].Due)
	})
	c.HTML(http.StatusOK, "bills.tmpl", gin.H{"data": bills})
}

func (backend Backend) OnPay(c *gin.Context) {
	var bill Bill

	if err := c.ShouldBind(&bill); err != nil {
		log.Println(err)
		return
	}
	if err := backend.db.PayBill(bill.ID, bill.Paid); err != nil {
		log.Println(err)
	}
	backend.BillPage(c)
}

func formatAsDuedate(t time.Time) string {
	return t.Local().Format("Monday, January 2 | 3:04 PM")
}

func main() {
	var backend Backend
	var err error

	backend.roommate = 1
	backend.db, err = DatabaseConnect()
	if err != nil {
		log.Fatal(err)
	}

	router := gin.Default()
	//using default config for cors
	config := cors.DefaultConfig()
	//modify default config with our origin
	config.AllowOrigins = []string{"http://localhost:3000"}
	//setting router to use cors with new config
	// To be able to send tokens to the server.
	config.AllowCredentials = true
	// OPTIONS method for ReactJS
	config.AddAllowMethods("OPTIONS")
	router.Use(cors.New(config))
	router.SetFuncMap(template.FuncMap{
		"formatAsDuedate": formatAsDuedate,
	})
	router.LoadHTMLGlob("templates/*")
	router.GET("/bills", backend.BillPage)
	router.POST("/bills", backend.OnPay)
	router.Run(":8080")
}
