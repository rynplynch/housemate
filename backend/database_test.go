package main

import "testing"

func (db Database) TestExample1(t *testing.T) {
}

func TestDatabase(t *testing.T) {
	db, err := databaseConnect("localhost")
	if err != nil {
		t.Fatal(err)
	}

	t.Run("Example 1", db.TestExample1)
}
