CREATE TABLE households (
  ID          SERIAL,
  Name        VARCHAR(256) NOT NULL,

  PRIMARY KEY (ID)
);

CREATE TABLE roommates (
  ID          SERIAL,
  Household   INT,
  Name        VARCHAR(256) NOT NULL,
  Email       VARCHAR(256) NOT NULL,
  Password    VARCHAR(128) NOT NULL,

  PRIMARY KEY (ID),
  FOREIGN KEY (Household) REFERENCES households (ID) ON DELETE SET NULL
);

CREATE TABLE bills (
  ID          SERIAL,
  Creditor    INT NOT NULL,
  Debtor      INT NOT NULL,
  Amount      NUMERIC(6,2) NOT NULL,
  Description VARCHAR(1024) NOT NULL,
  Due         TIMESTAMP NOT NULL,

  PRIMARY KEY (ID),
  FOREIGN KEY (Creditor) REFERENCES roommates (ID) ON DELETE CASCADE,
  FOREIGN KEY (Debtor)   REFERENCES roommates (ID) ON DELETE CASCADE,
  CHECK (Amount >= 0)
);

CREATE TABLE payments (
  ID          SERIAL,
  Bill        INT NOT NULL,
  Amount      NUMERIC(6,2) NOT NULL,
  Date        TIMESTAMP NOT NULL DEFAULT NOW(),
  Valid       BOOL,

  PRIMARY KEY (ID),
  FOREIGN KEY (Bill) REFERENCES bills (ID) ON DELETE CASCADE
);
