package main

import (
	"database/sql"
	"time"

	_ "github.com/lib/pq"
)

type Roommate struct {
	ID        int64         `json:"id"`
	Name      string        `json:"name"`
	Email     string        `json:"email,omitempty"`
	Password  string        `json:"password,omitempty"`
	Household sql.NullInt64 `json:"-"`
}
type Bill struct {
	ID          int64     `json:"id"`
	Creditor    int64     `json:"creditor"`
	Debtor      int64     `json:"debtor"`
	Amount      string    `json:"amount"`
	Description string    `json:"description"`
	Due         time.Time `json:"due"`
}
type Database struct {
	handle *sql.DB
}

func databaseConnect(host string) (Database, error) {
	const source = "user=postgres password=password sslmode=disable host="
	var db Database
	var err error

	db.handle, err = sql.Open("postgres", source+host)
	return db, err
}

func scanRoommates(rows *sql.Rows) ([]Roommate, error) {
	var roommates []Roommate

	for rows.Next() {
		var r Roommate

		err := rows.Scan(
			&r.ID,
			&r.Name)
		if err != nil {
			return nil, err
		}
		roommates = append(roommates, r)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return roommates, nil
}

func scanBills(rows *sql.Rows) ([]Bill, error) {
	var bills []Bill

	for rows.Next() {
		var b Bill

		err := rows.Scan(
			&b.ID,
			&b.Creditor,
			&b.Debtor,
			&b.Amount,
			&b.Description,
			&b.Due)
		if err != nil {
			return nil, err
		}
		bills = append(bills, b)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return bills, nil
}

func (db Database) Housemates(id int64) ([]Roommate, error) {
	rows, err := db.handle.Query(`
	    SELECT ID,Name FROM roommates WHERE Household IN
	      (SELECT Household FROM roommates WHERE ID = $1)`, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanRoommates(rows)
}

func (db Database) BillsByCreditor(creditor int64) ([]Bill, error) {
	rows, err := db.handle.Query(`
	    SELECT * FROM bills WHERE Creditor = $1`, creditor)

	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanBills(rows)
}

func (db Database) BillsByDebtor(debtor int64) ([]Bill, error) {
	rows, err := db.handle.Query(`
	    SELECT * FROM bills WHERE Debtor = $1`, debtor)

	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanBills(rows)
}

func (db Database) InsertRoommate(r *Roommate) error {
	row := db.handle.QueryRow(`
	    INSERT INTO roommates (ID, Name, Email, Password)
	      VALUES (DEFAULT, $1, $2, $3) RETURNING ID`,
		r.Name,
		r.Email,
		r.Password)
	return row.Scan(&r.ID)
}

func (db Database) InsertBill(b *Bill) error {
	row := db.handle.QueryRow(`
	    INSERT INTO bills (ID, Creditor, Debtor, Amount, Description, Due)
	      VALUES (DEFAULT, $1, $2, $3, $4, $5) RETURNING ID`,
		b.Creditor,
		b.Debtor,
		b.Amount,
		b.Description,
		b.Due)
	return row.Scan(&b.ID)
}

func (db Database) RoommateByEmail(email string) (Roommate, error) {
	var r Roommate
	row := db.handle.QueryRow(`
	    SELECT * FROM roommates WHERE Email = $1`, email)
	err := row.Scan(&r.ID, &r.Name, &r.Email, &r.Password, &r.Household)
	return r, err
}

func (db Database) DeleteBill(id, creditor int64) error {
	_, err := db.handle.Exec(`
	    DELETE FROM bills WHERE ID = $1 AND Creditor = $2`, id, creditor)
	return err
}
