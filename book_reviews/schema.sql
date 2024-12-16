-- Tables for data --

CREATE TABLE IF NOT EXISTS books (
    book_id SERIAL NOT NULL,
    title text NOT NULL,
    authors text NOT NULL,
    ibsn text NOT NULL UNIQUE,
    date_read date NOT NULL,
    PRIMARY KEY (book_id)
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL NOT NULL UNIQUE,
    rating int NOT NULL,
    review text NOT NULL,
    featured boolean NOT NULL,
    PRIMARY KEY (review_id),
    FOREIGN KEY (review_id) REFERENCES books(book_id)
);