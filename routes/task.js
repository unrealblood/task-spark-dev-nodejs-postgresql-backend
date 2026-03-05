import { Router } from "express";
import { pool } from "../lib/postgresql/db.js";

export const tasksRouter = Router();

tasksRouter.get("/get-all/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        await pool.query("CREATE TABLE IF NOT EXISTS tasks (_id SERIAL PRIMARY KEY, content VARCHAR(200) NOT NULL, completed BOOL NOT NULL, userId INT NOT NULL)");

        const result = await pool.query("SELECT * FROM tasks WHERE userId = $1", [userId]);

        if(result) {
            return res.json({success: true, tasks: result.rows});
        }

        return res.json({success: false});
    }
    catch(ex) {
        return res.json({success: false, error: "Failed to get all tasks of user. Error: " + ex.message});
    }
});

tasksRouter.post("/add-task", async (req, res) => {
    const { content, completed, userId } = req.body;

    try {
        await pool.query("CREATE TABLE IF NOT EXISTS tasks (_id SERIAL PRIMARY KEY, content VARCHAR(200) NOT NULL, completed BOOL NOT NULL, userId INT NOT NULL)");

        const result = await pool.query("INSERT INTO tasks (content, completed, userId) VALUES ($1, $2, $3) RETURNING *", [content, completed, userId]);

        if(result.rowCount > 0) {
            return res.json({success: true, taskId: result.rows[0]._id});
        }

        return res.json({success: false});
    }
    catch(error) {
        return res.json({success: false, error: "Failed to add task in database. Error: " + error.message});
    }
});

tasksRouter.put("/update-task-content/:taskId", async (req, res) => {
    const { taskId } = req.params;
    const { newContent } = req.body;

    try {
        await pool.query("CREATE TABLE IF NOT EXISTS tasks (_id SERIAL PRIMARY KEY, content VARCHAR(200) NOT NULL, completed BOOL NOT NULL, userId INT NOT NULL)");

        const result = await pool.query("UPDATE tasks SET content = $1 WHERE _id = $2", [newContent, taskId]);

        if(result.rowCount > 0) {
            return res.json({success: true});
        }

        return res.json({success: false});
    }
    catch(ex) {
        return res.json({success: false, error: "Failed to update task in database. Error: " + ex.message});
    }
});

tasksRouter.put("/update-task-completed/:taskId", async (req, res) => {
    const { taskId } = req.params;
    const { newCompleted } = req.body;

    try {
        await pool.query("CREATE TABLE IF NOT EXISTS tasks (_id SERIAL PRIMARY KEY, content VARCHAR(200) NOT NULL, completed BOOL NOT NULL, userId INT NOT NULL)");

        const result = await pool.query("UPDATE tasks SET completed = $1 WHERE _id = $2", [newCompleted, taskId]);

        if(result.rowCount > 0) {
            return res.json({success: true});
        }

        return res.json({success: false});
    }
    catch(ex) {
        return res.json({success: false, error: "Failed to update task in database. Error: " + ex.message});
    }
});

tasksRouter.delete("/delete-task/:taskId", async (req, res) => {
    const { taskId } = req.params;

    try {
        await pool.query("CREATE TABLE IF NOT EXISTS tasks (_id SERIAL PRIMARY KEY, content VARCHAR(200) NOT NULL, completed BOOL NOT NULL, userId INT NOT NULL)");

        const result = await pool.query("DELETE FROM tasks WHERE _id = $1", [taskId]);

        if(result.rowCount > 0) {
            return res.json({success: true});
        }

        return res.json({success: false});
    }
    catch(ex) {
        return res.json({success: false, error: "Failed to delete task in database. Error: " + ex.message});
    }
});