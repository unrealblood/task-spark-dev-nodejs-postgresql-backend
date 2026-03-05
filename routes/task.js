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