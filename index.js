const express = require('express')
const app = express();
const cors = require('cors')
const pool = require('./db')
const PORT = 8080

// middleware
app.use(cors());
app.use(express.json())

app.listen(PORT, () => {
    console.log(`server started at https://localhost:${PORT}`);

})

// ROUTES

// CREATE
app.post("/todos", async (req, res) => {
    try {

        const { description } = req.body
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *"
            , [description])
        res.json(newTodo.rows[0])
    } catch (error) {
        console.error(error.message);
    }
})
// get all

app.get("/todos", async (req, res) => {
    try {

        const allTodos = await pool.query("SELECT * FROM todo")
        res.json(allTodos.rows)
    } catch (err) {
        console.error(err.message);
    }
})

// get one
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todos = await pool.query("SELECT * FROM todo WHERE todo_id= $1", [id]);
        res.json(todos.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})
// edit

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description= $1 WHERE todo_id = $2", [description, id])
        res.json('updated');
    } catch (err) {
        console.error(err.message);
    }
})

// delete
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id])
        res.json('deleted');
    } catch (err) {
        console.error(err.message);
    }
})