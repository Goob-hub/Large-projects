import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const url = `mongodb://127.0.0.1:27017/taskListDB`;
const app = express();
const port = 3000;

mongoose.connect(url);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const itemSchema = new mongoose.Schema({
    name: String,
    type: String
});

const Item = mongoose.model("Item", itemSchema);

let sortType = "all";

app.post("/createTask", (req, res) => {
    let data = {name: req.body.task, type: req.body.taskType};
    
    res.render("index.ejs", {tasks: defaultItems, sort: sortType});
});

app.post("/sortTasks", (req, res) => {
    sortType = req.body.taskSort;
    res.render("index.ejs", {tasks: defaultItems, sort: sortType});
});

app.get("/", async (req, res) => {
    let tasksArray = await getTasksFromDB();
    res.render("index.ejs", {tasks: tasksArray, sort: sortType});
});

app.listen(port, () => {
    console.log(`Server is now running on ${port}` );
});

async function getTasksFromDB() {
    try {
        const tasks = await Item.find();
        return tasks;
    } catch (error) {
        console.log(error)
    }
}