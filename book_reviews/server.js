import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const API_URL = "https://covers.openlibrary.org/b/isbn/9780385533225-S.jpg";

async function getBooksAndReviews() {
  const dataToFetch = "books.title, books.authors, books.ibsn, books.date_read, reviews.review, reviews.rating"
  const response = await db.query(`SELECT ${dataToFetch} FROM books JOIN reviews ON books.id = reviews.id`);

  return formatReviewDates(response.rows);
}

async function formatReviewDates(bookReviewArray) {
  bookReviewArray.forEach(bookReview => {
    const date = bookReview.date_read;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${month}/${day}/${year}`; 

    bookReview.date_read = formattedDate;
  });

  return bookReviewArray;
}

app.get("/review", async (req, res) => {
  try {
    const dbData = await getBooksAndReviews();
    res.json(dbData);
  } catch (error) {
    console.error(error);
    res.json({error: "Could not fetch book reviews from database :("});
  }
});

app.post("/review", async (req, res) => {
  const bookReview = req.body;

  try {
    const response = await db.query("INSERT INTO books (title, authors, ibsn, date_read) VALUES($1, $2, $3, $4)", [bookReview.title, bookReview.authors, bookReview.ibsn, bookReview.date_read]);

    try {
      const response = await db.query("INSERT INTO reviews (review, rating) VALUES($1, $2)", [bookReview.review, parseInt(bookReview.rating)]);
      res.json("Successfully inserted all data into database!");
    } catch (error) {
      console.error(error);
      res.json("There was an error with inserting review data into review table in database :(");
    }

  } catch (error) {
    console.error(error);
    res.json("There was an error with inserting book data into book table in database :(");
  }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
  