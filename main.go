package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
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

	c.HTML(http.StatusOK, "bills.tmpl", gin.H{"data": bills})
}

func (backend Backend) OnPay(c *gin.Context) {
	log.Println("POST to /pay successful")
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
	router.LoadHTMLGlob("templates/*")
	router.GET("/bills", backend.BillPage)
	router.POST("/pay", backend.OnPay)
	router.Run(":8080")
}
