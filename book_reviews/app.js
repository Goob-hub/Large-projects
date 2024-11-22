import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const port = 3000;
const app = express();
const serverUrl = "localhost:4000/"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let curWebPage = "home";

app.get("/", async (req, res) => {
    curWebPage = "home";
    try {
      const bookReviews = await axios.get(`${serverUrl}/reviews`);
      res.render("home.ejs", { curWebPage: curWebPage, bookReviews: bookReviews });
    } catch (error) {
      console.error(error);
      res.render("home.ejs", { curWebPage: curWebPage, error: "unable to fetch from database" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
  