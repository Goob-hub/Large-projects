-- Tables for data --

CREATE TABLE IF NOT EXISTS books (
    id int NOT NULL SERIAL,
    title text NOT NULL,
    authors text NOT NULL,
    ibsn text UNIQUE NOT NULL,
    date_read date NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id int NOT NULL,
    rating int NOT NULL,
    review text NOT NULL,
    featured boolean NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES books (id)
);