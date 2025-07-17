const express = require("express");
const router = express.Router();
const firebaseAuthMiddleware = require("../middlewares/firebaseAuthMiddleware.js");
const db = require("../db/index.js");

router.post("/", firebaseAuthMiddleware, async (req, res) => {
  const { name, is_available } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await db.query(
      "INSERT INTO units (name, is_available) VALUES ($1, $2) RETURNING *",
      [name, is_available]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating unit:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/", firebaseAuthMiddleware, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM units");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ error: "Database error" });
  }
});
