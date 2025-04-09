const express = require("express");
const router = express.Router();
const firebaseAuthMiddleware = require("../middlewares/firebaseAuthMiddleware.js");
const db = require("../db/index.js");

const ADMIN_UIDS = ["LlowqXkGoOPfY3mYGM0eVmWooDA3"];

router.get("/", firebaseAuthMiddleware, async (req, res) => {
  try {
    const userUid = req.user.uid;
    console.log("User UID:", userUid);
    const user = await db.query("SELECT * FROM users WHERE uid = $1", [
      userUid,
    ]);
    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", firebaseAuthMiddleware, async (req, res) => {
  const userUid = req.user.uid;

  let role;
  if (ADMIN_UIDS.includes(userUid)) {
    role = "admin";
  } else {
    role = "user";
  }
  console.log("User UID:", userUid);
  console.log("User Role:", role);

  const { firstName, lastName, email, cellNumber } = req.body;

  if (!firstName || !lastName || !email || !cellNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await db.query(
      "INSERT INTO users (uid, firstname, lastname, email, cellnumber, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [userUid, firstName, lastName, email, cellNumber, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating an account:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
