//jshint esversion:6
import 'dotenv/config'
import bcrypt from 'bcrypt'
import bodyParser from "body-parser";
import express from "express";
import pg from "pg";


const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

const app = express();
const port = parseInt(process.env.NORMAL_PORT);
const saltRounds = 10;


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
    bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
        try {
            let hashPassword = hash;
            const text = `INSERT INTO users(username, password) VALUES($1, $2)`;
            const values = [req.body.username, hashPassword];
            const result = await db.query(text, values);
            res.redirect("/");
        }  catch (error) {
            console.log("this is an error", error);
            res.render("register.ejs", {error: error});
        }
    });
});

app.post("/login", async (req, res) => {
    try {
        const text = "SELECT password FROM users WHERE username = $1";
        const values = [req.body.username];
        const result = await db.query(text, values);
        const match = await bcrypt.compare(req.body.password, result.rows[0].password);

        if(!match){
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