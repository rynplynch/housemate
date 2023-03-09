CREATE EXTENSION pgcrypto;

CREATE TABLE households (
	id          INT NOT NULL GENERATED ALWAYS AS IDENTITY,
	name        VARCHAR NOT NULL,

	PRIMARY KEY (id)
);

CREATE TABLE roommates (
	id          UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
	name        VARCHAR NOT NULL,
	email       VARCHAR NOT NULL,
	password    VARCHAR NOT NULL,
	household   INT,

	PRIMARY KEY (id),
	FOREIGN KEY (household) REFERENCES households (id) ON DELETE SET NULL,
	UNIQUE (email)
);

CREATE TABLE bills (
	id          UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
	creditor    UUID NOT NULL,
	debtor      UUID NOT NULL,
	amount      NUMERIC(6,2) NOT NULL,
	description VARCHAR NOT NULL,
	due         TIMESTAMP NOT NULL,

	PRIMARY KEY (id),
	FOREIGN KEY (creditor) REFERENCES roommates (id) ON DELETE CASCADE,
	FOREIGN KEY (debtor)   REFERENCES roommates (id) ON DELETE CASCADE,
	CHECK (amount >= 0)
);

CREATE TABLE payments (
	bill        UUID NOT NULL,
	amount      NUMERIC(6,2) NOT NULL,
	state       INT NOT NULL DEFAULT -1,
	date        TIMESTAMP NOT NULL DEFAULT NOW(),

	FOREIGN KEY (bill) REFERENCES bills (id) ON DELETE CASCADE,
	UNIQUE(bill, date)
);


CREATE FUNCTION mkroommate(INT, VARCHAR, VARCHAR, VARCHAR) RETURNS UUID LANGUAGE SQL AS
  'INSERT INTO roommates (id, name, email, password, household)
     VALUES(DEFAULT, $2, $3, crypt($4, gen_salt(''bf'', 8)), $1) RETURNING id';
CREATE FUNCTION mkhousehold(VARCHAR) RETURNS INT LANGUAGE SQL AS
  'INSERT INTO households (id, name)
     VALUES (DEFAULT, $1) RETURNING id';
CREATE FUNCTION mkbill(UUID, UUID, NUMERIC, VARCHAR, TIMESTAMP) RETURNS UUID LANGUAGE SQL AS
  'INSERT INTO bills(id, creditor, debtor, amount, description, due)
     VALUES (DEFAULT, $1, $2, $3, $4, $5) RETURNING id';
CREATE FUNCTION mkpayment(UUID, NUMERIC, INT, INTERVAL) RETURNS TIMESTAMP LANGUAGE SQL AS
  'INSERT INTO payments(bill, amount, state, date)
     VALUES ($1, $2, $3, now() + $4) RETURNING date';

/* ===== Delete or comment out everything below this line to remove dummy data ===== */

DO $$
DECLARE
	h1 INT := mkhousehold('HOUSEHOLD 1');
	h2 INT := mkhousehold('HOUSEHOLD 2');
	r1 UUID := mkroommate(h1, 'John Doe',   'johndoe@mail.com',   'pass');
	r2 UUID := mkroommate(h1, 'Jane Doe',   'janedoe@mail.com',   'pass');
	r3 UUID := mkroommate(h1, 'Adam Smith', 'adamsmith@mail.com', 'pass');
	r4 UUID := mkroommate(h2, 'Anna Smith', 'annasmith@mail.com', 'pass');
	r5 UUID := mkroommate(h2, 'Fred Smith', 'fredsmith@mail.com', 'pass');
	b1 UUID := mkbill(r1, r2, 67.89, 'Rent',       now()::TIMESTAMP + INTERVAL '1 days');
	b2 UUID := mkbill(r1, r2, 56.78, 'Food',       now()::TIMESTAMP + INTERVAL '2 days');
	b3 UUID := mkbill(r1, r3, 45.67, 'Electricty', now()::TIMESTAMP + INTERVAL '3 days');
	b4 UUID := mkbill(r1, r3, 34.56, 'Internet',   now()::TIMESTAMP + INTERVAL '4 days');
	b5 UUID := mkbill(r2, r1, 23.45, 'Water',      now()::TIMESTAMP + INTERVAL '5 days');
	b6 UUID := mkbill(r3, r1, 12.34, 'Gas',        now()::TIMESTAMP + INTERVAL '6 days');
	p1 TIMESTAMP := mkpayment(b1, 4.56, -1, INTERVAL '1s');
	p2 TIMESTAMP := mkpayment(b1, 3.45,  0, INTERVAL '2s');
	p3 TIMESTAMP := mkpayment(b1, 2.34,  1, INTERVAL '3s');
	p4 TIMESTAMP := mkpayment(b5, 1.23, -1, INTERVAL '4s');
BEGIN
	RAISE NOTICE 'Using dummy data!';
END; $$
