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

async function getBooksAndReviews() {
  const dataToFetch = "books.title, books.authors, books.ibsn, books.date_read, reviews.review, reviews.rating"
  const response = await db.query(`SELECT ${dataToFetch} from books JOIN reviews ON review.id = books.id`);
}

function formatBookReviewData(reviewData) {
  if(reviewData.day.length < 10) {
    reviewData.day = "0" + reviewData.day;
  }

  if(reviewData.month.length === 1) {
    reviewData.month = "0" + reviewData.month;
  }

  let date = `${reviewData.year}-${reviewData.month}-${reviewData.day}`;
  let isRealDate = isDateValid(date);

  if(isRealDate) {
    return {
      title: reviewData.title,
      authors: reviewData.authors,
      ibsn: reviewData.ibsn,
      date_read: date
    }
  } else {
    return "uh oh spaghetti-o"
  }
}

function isDateValid(dateStr) {
  return !isNaN(new Date(dateStr));
}

app.get("/", async (req, res) => {
  try {
    //Fetch data from database
  } catch (error) {
    console.error(error.status);
  }
  res.render("index.ejs", { curWebPage: "index" });
});

app.get("/create", async (req, res) => {
  try {

  } catch (error) {
    console.error(error.status);
  }
  res.render("create_review.ejs", { curWebPage: "create_review" })
});

app.post("/create", async (req, res) => {
  console.log(req.body);
  const data = formatBookReviewData(req.body);
  // try {
  //   const response = await db.query("INSERT INTO books (title, authors, ibsn, date_read) VALUES($1, $2, $3, $4)", [data.title, data.authors, data.ibsn, data.date_read]);

  //   try {
  //     //This is where we would handle inserting the review of said book from the user
  //   } catch (error) {
  //     console.error(error.status);
  //   }

  // } catch (error) {
  //   console.error(error.status);
  // }

  res.redirect("/")
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
  