CREATE TABLE households (
  ID          SERIAL,
  Name        VARCHAR(256) NOT NULL,

  PRIMARY KEY (ID)
);

CREATE TABLE roommates (
  ID          SERIAL,
<<<<<<< HEAD
  Household   INT,
=======
>>>>>>> origin/main
  Name        VARCHAR(256) NOT NULL,
  Email       VARCHAR(256) NOT NULL,
  Password    VARCHAR(128) NOT NULL,
  Household   INT,

  PRIMARY KEY (ID),
<<<<<<< HEAD
  FOREIGN KEY (Household) REFERENCES households (ID) ON DELETE SET NULL
=======
  FOREIGN KEY (Household) REFERENCES households (ID) ON DELETE SET NULL,
  UNIQUE (Email)
>>>>>>> origin/main
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
<<<<<<< HEAD
=======
);

CREATE TABLE payments (
  ID          SERIAL,
  Bill        INT NOT NULL,
  Amount      NUMERIC(6,2) NOT NULL,
  Date        TIMESTAMP NOT NULL DEFAULT NOW(),
  Valid       BOOL,

  PRIMARY KEY (ID),
  FOREIGN KEY (Bill) REFERENCES bills (ID) ON DELETE CASCADE
>>>>>>> origin/main
);

CREATE TABLE payments (
  ID          SERIAL,
  Bill        INT NOT NULL,
  Amount      NUMERIC(6,2) NOT NULL,
  Date        TIMESTAMP NOT NULL DEFAULT NOW(),
  Valid       BOOL,

<<<<<<< HEAD
  PRIMARY KEY (ID),
  FOREIGN KEY (Bill) REFERENCES bills (ID) ON DELETE CASCADE
);
=======
INSERT INTO households
  (Name)
VALUES
  ('Household 1'),
  ('Household 2');

INSERT INTO roommates
  (Name, Email, Password, Household)
VALUES
  ('John Doe',   'johndoe@gmail.com',   '$2a$10$OH02gbP9SEkB/Gb59ZUMkO1iESdrfAbm.1JP8bbrl.TUY4KwqQT5O', 1),
  ('Jane Doe',   'janedoe@gmail.com',   '$2a$10$OH02gbP9SEkB/Gb59ZUMkO1iESdrfAbm.1JP8bbrl.TUY4KwqQT5O', 2),
  ('Adam Smith', 'adamsmith@gmail.com', '$2a$10$OH02gbP9SEkB/Gb59ZUMkO1iESdrfAbm.1JP8bbrl.TUY4KwqQT5O', 2);

INSERT INTO bills
  (Creditor, Debtor, Amount, Description, Due)
VALUES
  (3, 2, 54.50, 'bill 1', now() + INTERVAL '3 days'),
  (3, 2, 12.47, 'bill 2', now() + INTERVAL '5 days');
>>>>>>> origin/main
