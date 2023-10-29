//jshint esversion:6
import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "elephantdb2023",
  port: 5432,
});

const app = express();
const port = 3000;

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", async (req, res) => {
    try {
        const text = "INSERT INTO users(username, password) VALUES($1, $2)";
        const values = [req.body.username, req.body.password];
        const result = await db.query(text, values);
        res.redirect("/");
    } catch (error) {
        console.log("this is an error", error);
        res.render("register.ejs", {error: error.constraint});
    }
});

app.post("/login", async (req, res) => {
    try {
        const text = "SELECT * FROM users WHERE "
    } catch (error) {
        console.log("this is an error", error);
        res.render("/login", {error: error.constraint});
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});