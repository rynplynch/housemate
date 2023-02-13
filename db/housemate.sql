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


INSERT INTO households
  (Name)
VALUES
  ('household 1'),
  ('household 2');

INSERT INTO roommates
  (Household, Name, Email, Password)
VALUES
  (1, 'user 1', 'x', 'abc'),
  (2, 'user 2', 'y', 'def'),
  (2, 'user 3', 'z', 'ghi');

INSERT INTO bills
  (Creditor, Debtor, Amount, Description, Due)
VALUES
  (3, 1, 54.50, 'bill 1', now()),
  (3, 1, 32.16, 'bill 2', now()),
  (2, 1, 78.94, 'bill 3', now()),
  (2, 1, 12.47, 'bill 4', now());
