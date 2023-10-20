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
    type: String,
    isDone: String
});

const Item = mongoose.model("Item", itemSchema);

let tasksFromDB = [];
let sortType = "all";

app.post("/updateTask", async (req, res) => {
    let filter = {name: req.body.name};
    let params = {isDone: req.body.isDone};
    await updateTask(filter, params);

    tasksFromDB = await getTasksFromDB();
    res.redirect("/");
});

app.post("/deleteTask", async (req, res) => {
    console.log(req.body)
    let filter = {name: req.body.name};
    await deleteTaskFromDB(filter);

    tasksFromDB = await getTasksFromDB();
    res.redirect("/")
});

app.post("/createTask", async (req, res) => {
    console.log(req.body)
    let task = {name: req.body.task, type: req.body.taskType, isDone: "false"};
    await addTaskToDB(task);

    tasksFromDB = await getTasksFromDB();
    res.redirect("/")
});

app.post("/sortTasks", (req, res) => {
    console.log(req.body)
    sortType = req.body.taskSort;
    res.redirect("/")
});

app.get("/", async (req, res) => {
    let tasksArray = await getTasksFromDB();
    tasksFromDB = tasksArray;
    res.render("index.ejs", {tasks: tasksFromDB, sort: sortType});
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

async function addTaskToDB(task) {
    try {
        let newTask = new Item ({
            name: task.name,
            type: task.type,
            isDone: "false"
        });

        newTask.save();
    } catch (error) {
        console.log(error)
    }
}

async function deleteTaskFromDB(filter){
    try {
        let res = await Item.deleteOne(filter);
        console.log(`Successfully deleted ${res.deletedCount} task!`)
    } catch (error) {
        console.log(error);
    }
}

async function updateTask(filter, params){
    try {
        let res = await Item.updateOne(filter, params);
        console.log(`Successfully updated ${res.matchedCount} task!`);
    } catch (error) {
        console.log(error);
    }
}