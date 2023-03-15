package main

import (
	"testing"
	"time"
)

type DatabaseTest struct {
	database Database
	r1, r2   Roommate
	bill     string
	payment  time.Time
}

func (x *DatabaseTest) TestInsertRoommate(t *testing.T) {
	x.r1 = Roommate{
		Name:     "Test Name 1",
		Email:    "test1@email.com",
		Password: "TestPass1",
	}
	x.r2 = Roommate{
		Name:     "Test Name 2",
		Email:    "test2@email.com",
		Password: "TestPass2",
	}
	if err := x.database.InsertRoommate(&x.r1); err != nil {
		t.Fatal(err)
	}
	if err := x.database.InsertRoommate(&x.r2); err != nil {
		t.Fatal(err)
	}
	if x.r1.Id == "" || x.r2.Id == "" {
		t.Fatal("New roommates ID(s) unset")
	}
	t.Logf("Created roommate 1 with ID: %v", x.r1.Id)
	t.Logf("Created roommate 2 with ID: %v", x.r2.Id)
}

func (x *DatabaseTest) TestInsertHousehold(t *testing.T) {
	if err := x.database.InsertHousehold(x.r1.Id, "Test"); err != nil {
		t.Fatal(err)
	}
	t.Log("Created new household 'Test' and added roommate 1 to it")
}

func (x *DatabaseTest) TestInviteRoommate(t *testing.T) {
	if err := x.database.InviteRoommate(x.r1.Id, x.r2.Email); err != nil {
		t.Fatal(err)
	}
	t.Log("Invited roommate 2 to roommate 1's new household")
}

func (x *DatabaseTest) TestHousemates(t *testing.T) {
	roommates, err := x.database.Housemates(x.r1.Id)
	if err != nil {
		t.Fatal(err)
	}
	if len(roommates) != 1 {
		t.Fatal("Expected a single housemate")
	}
	if roommates[0].Id != x.r2.Id {
		t.Fatalf("Expected a single housemate with ID %v", x.r2.Id)
	}
	t.Logf("List of housemates: %v", roommates)
}

func (x *DatabaseTest) TestInsertBill(t *testing.T) {
	bill := Bill{
		Creditor:    x.r1.Id,
		Debtor:      x.r2.Id,
		Amount:      "123.45",
		Description: "Test Bill 1",
		Due:         time.Now(),
	}
	if err := x.database.InsertBill(&bill); err != nil {
		t.Fatal(err)
	}

	x.bill = bill.Id
	t.Logf("Created new bill with ID: %v", x.bill)
}

func (x *DatabaseTest) TestBillsByCreditor(t *testing.T) {
	bills, err := x.database.BillsByCreditor(x.r1.Id)
	if err != nil {
		t.Fatal(err)
	}
	if len(bills) != 1 {
		t.Fatal("Expected a single bill")
	}
	if bills[0].Debtor != x.r2.Id {
		t.Fatalf("Expected a single bill with debtor ID %v", x.r2.Id)
	}
	t.Logf("List of bills: %v", bills)
}

func (x *DatabaseTest) TestInsertPayment(t *testing.T) {
	payment := Payment{
		Bill:   x.bill,
		Amount: "23.45",
	}
	if err := x.database.InsertPayment(&payment, x.r2.Id); err != nil {
		t.Fatal(err)
	}

	x.payment = payment.Date
	t.Logf("Created new payment with date: %v", x.payment)
}

func (x *DatabaseTest) TestPaymentsByBill(t *testing.T) {
	payments, err := x.database.PaymentsByBill(x.bill, x.r1.Id)
	if err != nil {
		t.Fatal(err)
	}
	if len(payments) != 1 {
		t.Fatal("Expected a single payment")
	}
	if payments[0].Amount != "23.45" {
		t.Fatal("Expected a single payment with amount 23.45")
	}
	t.Logf("List of payments: %v", payments)
}

func (x *DatabaseTest) TestValidatePayment(t *testing.T) {
	err := x.database.ValidatePayment(x.payment, x.bill, true, x.r1.Id)
	if err != nil {
		t.Fatal(err)
	}

	bills, err := x.database.BillsByCreditor(x.r1.Id)
	if err != nil {
		t.Fatal(err)
	}
	if len(bills) != 1 {
		t.Fatal("Expected a single bill")
	}
	if bills[0].Amount != "100.00" {
		t.Fatal("Expected a single bill with amount 100.00")
	}
	t.Logf("List of bills: %v", bills)
}

func TestDatabase(t *testing.T) {
	var x DatabaseTest
	var err error

	if x.database, err = databaseConnect("localhost"); err != nil {
		t.Fatalf("PostgreSQL database not up and running: %v", err)
	}

	// NOTE: Order of tests is significant
	t.Run("Test Insert Roommate",   x.TestInsertRoommate)
	t.Run("Test Insert Household",  x.TestInsertHousehold)
	t.Run("Test Invite Roommate",   x.TestInviteRoommate)
	t.Run("Test Housemates",        x.TestHousemates)
	t.Run("Test Insert Bill",       x.TestInsertBill)
	t.Run("Test Bills By Creditor", x.TestBillsByCreditor)
	t.Run("Test Insert Payment",    x.TestInsertPayment)
	t.Run("Test Payments By Bill",  x.TestPaymentsByBill)
	t.Run("Test Validate Payment",  x.TestValidatePayment)
}
