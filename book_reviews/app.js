import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const port = 3000;
const app = express();
const serverUrl = "http://localhost:4000"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let curWebPage = "home";

app.get("/", async (req, res) => {
    curWebPage = "home";
    try {
      const response = await axios.get(`${serverUrl}/review`);
      const bookReviews = response.data;
      
      res.render("home.ejs", { curWebPage: curWebPage, bookReviews: bookReviews });
    } catch (error) {
      console.error(error);
      res.render("home.ejs", { curWebPage: curWebPage, error: "unable to fetch from database" });
    }
});

app.get("/create", async (req, res) => {
    curWebPage = "create_review";
    res.render("create_review.ejs", { curWebPage: curWebPage });
});

app.post("/create", async (req, res) => {
    const bookReview = req.body;
    bookReview.rating = bookReview.rating[bookReview.rating.length - 1];
    curWebPage = "create_review"

    try {
        const response = await axios.post(`${serverUrl}/review`, bookReview, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.render("create_review.ejs", {curWebPage: curWebPage, error: "Could not complete post request"});
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
  