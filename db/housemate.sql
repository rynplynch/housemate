CREATE TABLE households (
  ID          SERIAL,
  Name        VARCHAR(256) NOT NULL,

  PRIMARY KEY (ID)
);


CREATE TABLE roommates (
  ID          SERIAL,
  Household   INT NOT NULL DEFAULT 0,
  Name        VARCHAR(256) NOT NULL,
  Email       VARCHAR(256) NOT NULL,
  Password    VARCHAR(128) NOT NULL,

  PRIMARY KEY (ID),
  FOREIGN KEY (Household) REFERENCES households (ID) ON DELETE SET DEFAULT
);


CREATE TABLE bills (
  ID          SERIAL,
  Creditor    INT NOT NULL,
  Debtor      INT NOT NULL,
  Amount      NUMERIC(6,2) NOT NULL,
  Paid        NUMERIC(6,2) NOT NULL DEFAULT 0,
  Description VARCHAR(1024) NOT NULL,
  Due         TIMESTAMP NOT NULL,

  PRIMARY KEY (ID),
  FOREIGN KEY (Creditor) REFERENCES roommates (ID) ON DELETE CASCADE,
  FOREIGN KEY (Debtor)   REFERENCES roommates (ID) ON DELETE CASCADE,

  CHECK (Amount > 0),
  CHECK (Paid >= 0 AND Paid <= Amount)
);
