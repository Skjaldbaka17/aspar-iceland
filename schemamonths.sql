CREATE TABLE months (
    tourid CHARACTER(255) Not Null,
  year CHARACTER(4) NOT NULL,
  month CHARACTER(10) NOT NULL,
  day INTEGER NOT NULL,
  seatsTaken Integer NOT NULL,
  groups Integer NOT NULL,
  datetime timestamp NOT NULL DEFAULT current_timestamp
);