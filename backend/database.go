package main

import (
	"database/sql"
	"time"

	_ "github.com/lib/pq"
)

type Roommate struct {
	Id        string        `json:"id"`
	Name      string        `json:"name"`
	Email     string        `json:"-"`
	Password  string        `json:"-"`
	Household sql.NullInt64 `json:"-"`
}
type Bill struct {
	Id          string    `json:"id"`
	Creditor    string    `json:"creditor,omitempty"`
	Debtor      string    `json:"debtor,omitempty"`
	Amount      string    `json:"amount"`
	Description string    `json:"description"`
	Due         time.Time `json:"due"`
}
type Payment struct {
	Bill   string    `json:"-"`
	Amount string    `json:"amount"`
	State  int64     `json:"state"`
	Date   time.Time `json:"date"`
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
			&r.Id,
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
func scanBills(rows *sql.Rows, created bool) ([]Bill, error) {
	var bills []Bill

	for rows.Next() {
		var err error
		var b Bill

		if created {
			err = rows.Scan(
				&b.Id,
				&b.Debtor,
				&b.Amount,
				&b.Description,
				&b.Due)
		} else {
			err = rows.Scan(
				&b.Id,
				&b.Creditor,
				&b.Amount,
				&b.Description,
				&b.Due)
		}
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
func scanPayments(rows *sql.Rows) ([]Payment, error) {
	var payments []Payment

	for rows.Next() {
		var p Payment

		err := rows.Scan(
			&p.Amount,
			&p.State,
			&p.Date)
		if err != nil {
			return nil, err
		}
		payments = append(payments, p)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return payments, nil
}

// POST /register
func (db Database) InsertRoommate(r *Roommate) error {
	row := db.handle.QueryRow(`
	    INSERT INTO roommates (id, name, email, password)
	      VALUES (DEFAULT, $1, $2, crypt($3, gen_salt('bf', 8)))
	      RETURNING id`,
		r.Name,
		r.Email,
		r.Password)
	return row.Scan(&r.Id)
}

// AUTH DELETE /register
func (db Database) DeleteRoommate(u string) error {
	_, err := db.handle.Exec(`
	    DELETE FROM roommates WHERE id = $1`, u)
	return err
}

// POST /login
func (db Database) RoommateAuthenticate(r *Roommate) error {
	row := db.handle.QueryRow(`
	    SELECT id,name FROM roommates
	      WHERE email = $1 AND password = crypt($2, password)`,
		r.Email,
		r.Password)
	return row.Scan(&r.Id, &r.Name)
}

// AUTH POST /household
func (db Database) InsertHousehold(u, name string) error {
	_, err := db.handle.Exec(`
	    WITH new AS (INSERT INTO households (id, name) VALUES (DEFAULT, $2)
	      RETURNING id)
	    UPDATE roommates SET household = new.id FROM new
	      WHERE roommates.id = $1`,
		u,
		name)
	return err
}

// AUTH POST /household/invite
func (db Database) InviteRoommate(u, email string) error {
	_, err := db.handle.Exec(`
	    WITH new AS (SELECT household FROM roommates WHERE id = $1)
	    UPDATE roommates SET household = new.household FROM new
	      WHERE email = $2 AND roommates.household IS NULL`,
		u,
		email)
	return err
}

// AUTH GET /household/roommates
func (db Database) Housemates(u string) ([]Roommate, error) {
	rows, err := db.handle.Query(`
	    SELECT id,name FROM roommates WHERE id <> $1 AND household IN
	      (SELECT household FROM roommates WHERE id = $1)`, u)

	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanRoommates(rows)
}

// AUTH GET /household
func (db Database) HouseholdName(u string) (string, error) {
	var name string
	row := db.handle.QueryRow(`
	    SELECT name FROM households WHERE id IN
	      (SELECT household FROM roommates WHERE id = $1)`, u)
	err := row.Scan(&name)
	return name, err
}

// AUTH DELETE /household
func (db Database) LeaveHousehold(u string) error {
	_, err := db.handle.Exec(`
	    UPDATE roommates SET household = NULL WHERE id = $1`, u)
	return err
}

// AUTH POST /bills (TODO: needs to verify roommates are in the same household)
func (db Database) InsertBill(b *Bill) error {
	row := db.handle.QueryRow(`
	    INSERT INTO bills (id, creditor, debtor, amount, description, due)
	      VALUES (DEFAULT, $1, $2, $3, $4, $5)
	      RETURNING id`,
		b.Creditor,
		b.Debtor,
		b.Amount,
		b.Description,
		b.Due)
	return row.Scan(&b.Id)
}

// AUTH GET /bills/created
func (db Database) BillsByCreditor(creditor string) ([]Bill, error) {
	rows, err := db.handle.Query(`
	    SELECT id,debtor,amount,description,due FROM bills WHERE creditor = $1`,
		creditor)

	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanBills(rows, true)
}

// AUTH GET /bills/assigned
func (db Database) BillsByDebtor(debtor string) ([]Bill, error) {
	rows, err := db.handle.Query(`
	    SELECT id,creditor,amount,description,due FROM bills WHERE debtor = $1`,
		debtor)

	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanBills(rows, false)
}

// AUTH DELETE /bills/:uuid
func (db Database) DeleteBill(u, id string) error {
	_, err := db.handle.Exec(`
	    DELETE FROM bills WHERE id = $1 AND creditor = $2`, id, u)
	return err
}

// AUTH POST /payments
func (db Database) InsertPayment(p *Payment, u string) error {
	_, err := db.handle.Exec(`
	    INSERT INTO payments (bill, amount)
	      SELECT id,$2 FROM bills
	      WHERE id = $1 AND amount >= $2 AND debtor = $3`,
		p.Bill,
		p.Amount,
		u)
	return err
}

// AUTH POST /payments/validate
func (db Database) ValidatePayment(id time.Time, bill string, valid bool, u string) error {
	var amount string
	var state int64
	if valid {
		state = 1
	}
	tx, err := db.handle.Begin()
	if err != nil {
		return err
	}

	err = tx.QueryRow(`
	    UPDATE payments SET state = $4 WHERE state < 0 AND date = $1 AND bill =
	      (SELECT id FROM bills WHERE id = $2 AND creditor = $3)
	      RETURNING amount`, id, bill, u, state).Scan(&amount)
	if err != nil {
		tx.Rollback()
		return err
	}
	if !valid {
		return tx.Commit()
	}

	_, err = tx.Exec(`
	    UPDATE bills SET amount = amount - $1 WHERE id = $2`, amount, bill)
	if err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit()
}

// AUTH GET /payments/:uuid
func (db Database) PaymentsByBill(bill, u string) ([]Payment, error) {
	rows, err := db.handle.Query(`
	    SELECT amount,state,date FROM payments WHERE bill IN
	      (SELECT id FROM bills WHERE id = $1 AND
	      (creditor = $2 OR debtor = $2))`,
		bill,
		u)

	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanPayments(rows)
}

// AUTH DELETE /payments/:uuid/:time
func (db Database) DeletePayment(id time.Time, bill, u string) error {
	_, err := db.handle.Exec(`
	    DELETE FROM payments WHERE state <= 0 AND date = $1 AND bill IN
	      (SELECT id FROM bills WHERE id = $2 AND debtor = $3)`,
		id,
		bill,
		u)
	return err
}
