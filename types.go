package main

import "time"

type Household struct {
	ID   int64
	Name string
}

type Roommate struct {
	ID        int64
	Household int64
	Name      string
	Email     string
	Password  string
}

type Bill struct {
	ID          int64     `form:"ID"`
	Creditor    int64     `form:"Creditor"`
	Debtor      int64     `form:"Debtor"`
	Amount      string    `form:"Amount"`
	Paid        string    `form:"Paid"`
	Description string    `form:"Description"`
	Due         time.Time `form:"Due"`
}
