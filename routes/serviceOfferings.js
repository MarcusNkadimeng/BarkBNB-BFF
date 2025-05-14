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

router.get("/", firebaseAuthMiddleware, async (req, res) => {
  try {
    const packages = await db.query("SELECT * FROM packages");
    res.json(packages.rows);
  } catch (error) {
    console.error("Error fetching service offerings:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.put("/:packageId", firebaseAuthMiddleware, async (req, res) => {
  const { packageId } = req.params;
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await db.query(
      "UPDATE packages SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
      [name, description, price, packageId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Service offering not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating service offering:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.delete("/:packageId", firebaseAuthMiddleware, async (req, res) => {
  const { packageId } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM packages WHERE id = $1 RETURNING *",
      [packageId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Service offering not found" });
    }
    res.json({ message: "Service offering deleted successfully" });
  } catch (error) {
    console.error("Error deleting service offering:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
