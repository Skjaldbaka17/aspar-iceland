CREATE TABLE bookings (
  tourID CHARACTER varying(255) NOT NULL,
  tourGuide Character varying(255) NOT NULL,
  year CHARACTER(4) NOT NULL,
  month CHARACTER(10) NOT NULL,
  day INTEGER NOT NULL,
  time CHARACTER(5) NOT NULL,
  firstName character varying(255) NOT NULL,
  lastName character varying(255) NOT NULL,
  email character varying(255) NOT NULL,
  phoneNumber character varying(255) NOT NULL,
  nationality character varying(255),
  persons INTEGER NOT NULL,
  price CHARACTER varying(255) NOT NULL,
  paid boolean,
  pickup boolean,
  datetime timestamp NOT NULL DEFAULT current_timestamp
);