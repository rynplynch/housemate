package main

import (
	"log"
	"net/http"
	"sort"

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
	router.POST("/bills", backend.OnPay)
	router.Run(":8080")
}
