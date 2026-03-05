import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../lib/postgresql/db.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await pool.query("CREATE TABLE IF NOT EXISTS users (_id SERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL, email VARCHAR(200) NOT NULL UNIQUE, password VARCHAR(200) NOT NULL)");

        await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, password]);

        return res.json({success: true});
    }
    catch(ex) {
        return res.json({success: false, error: "Failed to register the user in the database. Error: " + ex.message});
    }
});

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        await pool.query("CREATE TABLE IF NOT EXISTS users (_id SERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL, email VARCHAR(200) NOT NULL UNIQUE, password VARCHAR(200) NOT NULL)");

        const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);

        if(result.rowCount > 0) {
            const accessToken = jwt.sign({_id: result.rows[0]._id}, process.env.JWT_SECRET);

            return res.json({success: true, accessToken, userId: result.rows[0]._id});
        }

        return res.json({success: false, error: "No account found with given credentials."});
    }
    catch(ex) {
        return res.json({success: false, error: "Failed to register the user in the database. Error: " + ex.message});
    }
});