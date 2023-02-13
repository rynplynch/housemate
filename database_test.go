package main

import "testing"

func (db Database) TestExample1(t *testing.T) {
	err := db.DeleteRoommate(1)
	if err != nil {
		t.Error(err)
	}
}

func TestDatabase(t *testing.T) {
	db, err := DatabaseConnect()
	if err != nil {
		t.Fatal(err)
	}

	t.Run("Example 1", db.TestExample1)
}
