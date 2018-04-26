CREATE TABLE bookings (
  tourID CHARACTER varying(255) NOT NULL,
  tourGuide Character varying(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  firstName character varying(255) NOT NULL,
  lastName character varying(255) NOT NULL,
  email character varying(255) NOT NULL,
  phoneCountry character varying(255) NOT NULL,
  fullPhoneNumber character varying(255) NOT NULL,
  phoneNumber character varying(255) NOT NULL,
  nationality character varying(255),
  persons INTEGER NOT NULL,
  price CHARACTER varying(255) NOT NULL,
  paid boolean,
  pickup boolean,
  datetime timestamp NOT NULL DEFAULT current_timestamp
);