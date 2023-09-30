import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let sortType = "all";
let tasksArr = [
    {name: "Eat breakfast", type: "daily"},
    {name: "Program", type: "work"}
];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/createTask", (req, res) => {
    let data = {name: req.body.task, type: req.body.taskType};
    tasksArr.push(data);
    res.render("index.ejs", {tasks: tasksArr, sort: sortType});
});

app.post("/sortTasks", (req, res) => {
    sortType = req.body.taskSort;
    res.render("index.ejs", {tasks: tasksArr, sort: sortType});
});

app.get("/", (req, res) => {
    res.render("index.ejs", {tasks: tasksArr, sort: sortType});
});

app.listen(port, () => {
    console.log(`Server is now running on ${port}` );
});