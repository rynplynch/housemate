package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type Database struct {
	handle *sql.DB
}

func DatabaseConnect() (Database, error) {
	const source = "user=postgres password=password sslmode=disable"
	var db Database
	var err error

	db.handle, err = sql.Open("postgres", source)
	if err != nil {
		return db, fmt.Errorf("DatabaseConnect: %v", err)
	}
	return db, nil
}

func (db Database) ScanRoommates(rows *sql.Rows) ([]Roommate, error) {
	var roommates []Roommate

	for rows.Next() {
		var r Roommate

		err := rows.Scan(
			&r.ID,
			&r.Household,
			&r.Name,
			&r.Email,
			&r.Password)
		if err != nil {
			return nil, fmt.Errorf("ScanRoommates: %v", err)
		}
		roommates = append(roommates, r)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("ScanRoommates: %v", err)
	}
	return roommates, nil
}

func (db Database) ScanBills(rows *sql.Rows) ([]Bill, error) {
	var bills []Bill

	for rows.Next() {
		var b Bill

		err := rows.Scan(
			&b.ID,
			&b.Creditor,
			&b.Debtor,
			&b.Amount,
			&b.Paid,
			&b.Description,
			&b.Due)
		if err != nil {
			return nil, fmt.Errorf("ScanBills: %v", err)
		}
		bills = append(bills, b)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("ScanBills: %v", err)
	}
	return bills, nil
}

func (db Database) RoommatesByHousehold(household int64) ([]Roommate, error) {
	rows, err := db.handle.Query(`
	    SELECT * FROM roommates WHERE Household = $1`, household)

	if err != nil {
		return nil, fmt.Errorf("RoommatesByHousehold %v: %v", household, err)
	}
	defer rows.Close()
	return db.ScanRoommates(rows)
}

func (db Database) BillsByCreditor(creditor int64) ([]Bill, error) {
	rows, err := db.handle.Query(`
	    SELECT * FROM bills WHERE Creditor = $1`, creditor)

	if err != nil {
		return nil, fmt.Errorf("BillsByCreditor %v: %v", creditor, err)
	}
	defer rows.Close()
	return db.ScanBills(rows)
}

func (db Database) BillsByDebtor(debtor int64) ([]Bill, error) {
	rows, err := db.handle.Query(`
	    SELECT * FROM bills WHERE Debtor = $1`, debtor)

	if err != nil {
		return nil, fmt.Errorf("BillsByDebtor %v: %v", debtor, err)
	}
	defer rows.Close()
	return db.ScanBills(rows)
}

func (db Database) DeleteHousehold(id int64) error {
	_, err := db.handle.Exec(`
	    DELETE FROM households WHERE ID = $1`, id)

	if err != nil {
		return fmt.Errorf("DeleteHousehold %v: %v", id, err)
	}
	return nil
}

func (db Database) DeleteRoommate(id int64) error {
	_, err := db.handle.Exec(`
	    DELETE FROM roommates WHERE ID = $1`, id)

	if err != nil {
		return fmt.Errorf("DeleteRoommate %v: %v", id, err)
	}
	return nil
}

func (db Database) NewHousehold(h *Household) error {
	res, err := db.handle.Exec(`
	    INSERT INTO households (Name)
	      VALUES ($1)`,
		h.Name)
	if err != nil {
		return fmt.Errorf("NewHousehold %+v: %v", *h, err)
	}

	h.ID, err = res.LastInsertId()
	if err != nil {
		return fmt.Errorf("NewHousehold %+v: %v", *h, err)
	}
	return nil
}

func (db Database) NewRoommate(r *Roommate) error {
	res, err := db.handle.Exec(`
	    INSERT INTO roommates (Name, Email, Password)
	      VALUES ($1, $2, $3) ON CONFLICT (Email) DO NOTHING`,
		r.Name,
		r.Email,
		r.Password)
	if err != nil {
		return fmt.Errorf("NewRoommate %+v: %v", *r, err)
	}

	r.ID, err = res.LastInsertId()
	if err != nil {
		return fmt.Errorf("NewRoommate %+v: %v", *r, err)
	}
	return nil
}

func (db Database) NewBill(b *Bill) error {
	res, err := db.handle.Exec(`
	    INSERT INTO bills (Creditor, Debtor, Amount, Description, Due)
	      VALUES ($1, $2, $3, $4, $5)`,
		b.Creditor,
		b.Debtor,
		b.Amount,
		b.Description,
		b.Due)
	if err != nil {
		return fmt.Errorf("NewBill %+v: %v", *b, err)
	}

	b.ID, err = res.LastInsertId()
	if err != nil {
		return fmt.Errorf("NewBill %+v: %v", *b, err)
	}
	return nil
}

func (db Database) JoinHousehold(id, household int64) error {
	_, err := db.handle.Exec(`
	    UPDATE roommates SET Household = $1 WHERE ID = $2`, household, id)

	if err != nil {
		return fmt.Errorf("JoinHousehold %v, %v: %v", id, household, err)
	}
	return nil
}

func (db Database) PayBill(id int64, amount string) error {
	_, err := db.handle.Exec(`
	    UPDATE bills SET Paid = Paid + $1 WHERE ID = $2`, amount, id)

	if err != nil {
		return fmt.Errorf("PayBill %v, %v: %v", id, amount, err)
	}
	return nil
}
