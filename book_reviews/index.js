import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});
const app = express();
const port = 3000;

db.connect();

app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let curWebPage = "home";

async function getFeaturedBookReviews() {
  const dataToFetch = "books.book_id, books.title, books.authors, books.ibsn, books.date_read, reviews.review, reviews.rating";
  const response = await db.query(`SELECT ${dataToFetch} FROM books INNER JOIN reviews ON books.book_id = reviews.review_id WHERE reviews.featured = true`);

  return formatDbDates(response.rows);
}

async function getAllBookReviews() {
  const dataToFetch = "books.book_id, books.title, books.authors, books.ibsn, books.date_read, reviews.review, reviews.rating";
  const response = await db.query(`SELECT ${dataToFetch} FROM books INNER JOIN reviews ON books.book_id = reviews.review_id`);

  return formatDbDates(response.rows);
}

async function getBookReviewById(id) {
  console.log(id)
  const dataToFetch = "books.book_id, books.title, books.authors, books.ibsn, books.date_read, reviews.review, reviews.rating";
  const response = await db.query(`SELECT ${dataToFetch} FROM books INNER JOIN reviews ON books.book_id = reviews.review_id WHERE books.book_id = ${id}`);

  console.log(response.rows);

  return formatDbDates(response.rows);
}

function formatDbDates(bookReviewArray) {
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
  curWebPage = "home"
  try {
    const bookReviews = await getFeaturedBookReviews();
    res.render("home.ejs", { curWebPage: curWebPage, bookReviews: bookReviews, onlyFeatured: true });
  } catch (error) {
    console.error(error);
    res.render("home.ejs", { curWebPage: curWebPage, error: "unable to fetch featured book reviews from database" });
  }
});

app.get("/full-list", async (req, res) => {
  curWebPage = "full_list";
  try {
    const bookReviews = await getAllBookReviews();
    res.render("full_list.ejs", { curWebPage: curWebPage, bookReviews: bookReviews, onlyFeatured: false })
  } catch (error) {
    console.error(error);
    res.render("full_list.ejs", { curWebPage: curWebPage, error: "unable to fetch all book reviews from database" });
  }
});

app.get("/review", async (req, res) => {
  curWebPage = "read_review"; 
  const reviewId = req.query.id;
  console.log(reviewId);
  try {
    const bookReview = await getBookReviewById(reviewId);
    res.render("read_review.ejs", { curWebPage: curWebPage, bookReview: bookReview[0] });
    
  } catch (error) {
    console.error(error);
    res.render("read_review.ejs", { error: "Could not fetch book review by id." });
  }
});

app.get("/create", async (req, res) => {
  curWebPage = "create_review";
  res.render("create_review.ejs", { curWebPage: curWebPage });
});

app.post("/create", async (req, res) => {
  let data = req.body;
  data.rating = data.rating[data.rating.length - 1];

  if(data.featured === "true") {
    data.featured = true;
  } else {
    data.featured = false;
  }

  try {
    const response = await db.query("INSERT INTO books (title, authors, ibsn, date_read) VALUES($1, $2, $3, $4)", [data.title, data.authors, data.ibsn, data.date_read]);

    try {
      const response = await db.query("INSERT INTO reviews (book_id, review, rating, featured) VALUES($1, $2, $3, $4)", [data.review, parseInt(data.rating), data.featured]);
    } catch (error) {
      console.error(error);
    }

  } catch (error) {
    console.error(error);
  }

  res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
  