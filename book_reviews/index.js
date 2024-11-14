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

const API_LINK = "https://covers.openlibrary.org/b/"

app.get("/", async (req, res) => {
    //key: ibsn value: 1936891026 size: M
    try {
      const result = await axios.get(API_LINK + "ibsn/1936891026-L.jpg");
      console.log(result.data);
    } catch (error) {
      console.error(error.status);
    }
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
  