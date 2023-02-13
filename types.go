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
	ID          int64
	Creditor    int64
	Debtor      int64
	Amount      string
	Paid        string
	Description string
	Due         time.Time
}
