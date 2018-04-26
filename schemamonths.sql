CREATE TABLE months (
    tourid CHARACTER(255) Not Null,
  date TIMESTAMP NOT NULL,
  seatsTaken Integer NOT NULL,
  groups Integer NOT NULL,
  datetime timestamp NOT NULL DEFAULT current_timestamp
);