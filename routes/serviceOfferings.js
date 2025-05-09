const express = require("express");
const router = express.Router();
const firebaseAuthMiddleware = require("../middlewares/firebaseAuthMiddleware.js");
const db = require("../db/index.js");

router.post("/", firebaseAuthMiddleware, async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await db.query(
      "INSERT INTO packages (name, description, price) VALUES ($1, $2, $3) RETURNING *",
      [name, description, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating service offering:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
