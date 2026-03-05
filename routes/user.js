import { Router } from "express";
import { pool } from "../lib/postgresql/db.js";

export const userRouter = Router();

userRouter.get("/get-user/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        await pool.query("CREATE TABLE IF NOT EXISTS users (_id SERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL, email VARCHAR(200) NOT NULL UNIQUE, password VARCHAR(200) NOT NULL)");

        const result = await pool.query("SELECT * FROM users WHERE _id = $1", [userId]);

        if(result.rowCount > 0) {
            return res.json({success: true, user: result.rows[0]});
        }

        return res.json({success: false, error: "Failed to get user from database."});
    }
    catch(ex) {
        return res.json({success: false, error: "Failed to get user from database. Error: " + ex.message});
    }
});