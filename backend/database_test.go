package main

import "testing"

func (db Database) TestExample1(t *testing.T) {
	err := db.DeleteBill(1, 3)
	if err != nil {
		t.Error(err)
	}
}

func TestDatabase(t *testing.T) {
	db, err := databaseConnect("localhost")
	if err != nil {
		t.Fatal(err)
	}

	t.Run("Example 1", db.TestExample1)
}
