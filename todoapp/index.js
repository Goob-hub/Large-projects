import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const url = `mongodb://127.0.0.1:27017/taskListDB`;
const app = express();
const port = 3000;

mongoose.connect(url);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const listSchema = new mongoose.Schema({
    name: String,
    items: Array
});

const Lists = mongoose.model("Lists", listSchema);

async function deleteListsWithoutItems(){
    let res = await Lists.deleteMany({items: []});
    console.log(res);
}

deleteListsWithoutItems();

let tasksFromDB = [];
let curList = "Today";

app.post("/updateTask", async (req, res) => {
    let task = {name: req.body.name, isDone: req.body.isDone};
    await updateTaskFromCurList(task);

    res.redirect("/");
});

app.post("/deleteTask", async (req, res) => {
    let taskName = req.body.name;
    await deleteTaskFromCurList(taskName);
    res.redirect("/")
});

app.post("/createTask", async (req, res) => {
    let task = {name: req.body.task, isDone: "false"};
    await addTaskToCurList(task);
    res.redirect("/");
});

app.get("/:listName", async (req, res) => {
    let listName = req.params.listName;
    if(listName == undefined || listName === "favicon.ico"){
        return;
    }
    
    listName = `${listName[0].toUpperCase()}${listName.slice(1, listName.length).toLowerCase()}`;
    
    curList = listName;
    await createNewList(listName);
    res.redirect("/");
});

app.get("/", async (req, res) => {
    let tasks = await getTasksFromList(curList);
    tasksFromDB = tasks;
    res.render("index.ejs", {tasks: tasksFromDB, curList: curList});
});

app.listen(port, () => {
    console.log(`Server is now running on ${port}` );
});

async function getTasksFromList(listName) {
    try {
        const list = await Lists.findOne({name: listName});
        if(list == undefined){
            await createNewList(listName);
            return [];
        } else {
            return list.items;
        }
    } catch (error) {
        console.log(error);
    }
}

async function addTaskToCurList(task){
    try {
        let listItems = await getTasksFromList(curList);

        if(listItems == undefined){
            throw new Error("Could not find list items from " + curList + " List");
        }

        listItems.push(task)
        let res = await Lists.updateOne({name: curList}, {items: listItems});
        console.log(`Successfully added task to ${curList} list!`);
    } catch (error) {
        console.log(error);
    }
}

async function createNewList(listName, items) {
    try {
        let list = await Lists.findOne({name: listName});

        if(list != undefined){
           console.log(`Did not save list because a list with the name ${listName} already exists.`)
        } else {
            let newList = new Lists ({
                name: listName,
                items: items || []
            });

            newList.save();
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteTaskFromCurList(taskName){
    try {
        let listItems = await getTasksFromList(curList);

        if(listItems == undefined){
            throw new Error("Could not find list items from " + curList + " List");
        }

        listItems = listItems.filter(task => {return task.name !== taskName});

        let res = await Lists.updateOne({name: curList}, {items: listItems})
        console.log(`Successfully deleted task from ${curList} list!`);
    } catch (error) {
        console.log(error);
    }
}

async function updateTaskFromCurList(item){
    try {
        let listItems = await getTasksFromList(curList);

        if(listItems == undefined){
            throw new Error("Could not find list items from " + curList + " List");
        }

        listItems.forEach(task => {
            if(task.name === item.name){
                task.isDone = item.isDone;
                task.name = item.name;
            }
        });

        let res = await Lists.updateOne({name: curList}, {items: listItems})
        console.log(`Successfully updated task from ${curList} list!`);
    } catch (error) {
        console.log(error);
    }
}