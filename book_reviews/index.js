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


app.get("/", async (req, res) => {
    try {

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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
  