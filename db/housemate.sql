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
