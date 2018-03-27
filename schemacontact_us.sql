CREATE TABLE contact_us (
  id serial primary key,
  datetime timestamp NOT NULL DEFAULT current_timestamp,
  name character varying(255) NOT NULL,
  email character varying(255) NOT NULL,
  subject character varying(255),
  about text NOT NULL
);