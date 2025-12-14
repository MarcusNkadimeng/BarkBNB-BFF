const express = require("express");
const router = express.Router();
const firebaseAuthMiddleware = require("../middlewares/firebaseAuthMiddleware.js");
const db = require("../db/index.js");

router.post("/", firebaseAuthMiddleware, async (req, res) => {
  const { userUid } = req.user;
  const { servicePackageId, unitId, startDate, endDate, petId } = req.body;

  if (!servicePackageId || !unitId || !startDate || !endDate || !petId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await db.query(
      "INSERT INTO bookings (user_uid, service_package_id, unit_id, start_date, end_date, pet_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [userUid, servicePackageId, unitId, startDate, endDate, petId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
