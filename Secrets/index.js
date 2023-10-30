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

app.get("/logout", (req, res) => {
    res.redirect("/");
});

app.get("/submit", (req, res) => {
    res.render("submit.ejs");
});

app.post("/register", async (req, res) => {
    try {
        const text = "INSERT INTO users(username, password) VALUES($1, crypt($2, gen_salt('md5'))";
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
        const text = "SELECT id FROM users WHERE username = $1 AND password = crypt($2, password);";
        const values = [req.body.username, req.body.password];
        const result = await db.query(text, values);
        
        if(result.rows.length === 0){
            res.render("login.ejs", {error: "Incorrect username or password."});
        } else {
            res.render("secrets.ejs");
        }
    } catch (error) {
        console.log("this is an error", error);
        res.render("login.ejs", {error: error.constraint});
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});