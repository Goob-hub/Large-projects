import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

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

const API_URL = "https://covers.openlibrary.org/b/isbn/9780385533225-S.jpg";

let currentWebPage = "index";

async function getBooksAndReviews() {
  const dataToFetch = "books.title, books.authors, books.ibsn, books.date_read, reviews.review, reviews.rating"
  const response = await db.query(`SELECT ${dataToFetch} FROM books JOIN reviews ON books.id = reviews.id`);

  return formatDbDates(response.rows);
}

//DO THIS IN BOOK REVIEW PARTIAL WHERE BOOK INFO IS DISPLAYED, IT WILL BE MORE EFFICIENT
async function formatDbDates(bookReviewArray) {
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

app.get("/", async (req, res) => {
  currentWebPage = "index"
  try {
    const dbData = await getBooksAndReviews();
    res.render("index.ejs", { curWebPage: currentWebPage, bookReviews: dbData });
  } catch (error) {
    console.error(error);
    res.render("index.ejs", { curWebPage: currentWebPage, error: "unable to fetch from database" });
  }
});

app.get("/create", async (req, res) => {
  currentWebPage = "create_review";
  res.render("create_review.ejs", { curWebPage: currentWebPage });
});

app.post("/create", async (req, res) => {
  let data = req.body;
  data.rating = data.rating[data.rating.length - 1];

  try {
    const response = await db.query("INSERT INTO books (title, authors, ibsn, date_read) VALUES($1, $2, $3, $4)", [data.title, data.authors, data.ibsn, data.date_read]);

    try {
      const response = await db.query("INSERT INTO reviews (review, rating) VALUES($1, $2)", [data.review, parseInt(data.rating)]);
    } catch (error) {
      console.error(error);
    }

  } catch (error) {
    console.error(error);
  }

  res.redirect("/")
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
  