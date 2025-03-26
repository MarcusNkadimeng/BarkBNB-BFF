const express = require("express");
const router = express.Router();
const firebaseAuthMiddleware = require("../middlewares/firebaseAuthMiddleware.js");
const db = require("../db/index.js");

router.get("/pets", firebaseAuthMiddleware, async (req, res) => {
  try {
    const userUid = req.user.uid;
    const pets = await db.query("SELECT * FROM pets WHERE user_uid = $1", [
      userUid,
    ]);
    res.json(pets.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", firebaseAuthMiddleware, async (req, res) => {
  const userId = req.user.uid;
  const {
    name,
    breed,
    gender,
    image,
    dietary_requirements,
    birthdate,
    vaccine_status,
    neutered,
  } = req.body;

  if (
    !name ||
    !breed ||
    !gender ||
    !dietary_requirements ||
    !birthdate ||
    !vaccine_status ||
    !neutered
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.query(
      "INSERT INTO pets (user_id, name, breed, gender, image, dietary_requirements, birthdate, vaccine_status, neutered) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        userId,
        name,
        breed,
        gender,
        image,
        dietary_requirements,
        birthdate,
        vaccine_status,
        neutered,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.put("/:petId", firebaseAuthMiddleware, async (req, res) => {
  const userId = req.user.uid;
  const { petId } = req.params;
  const {
    name,
    breed,
    gender,
    image,
    dietary_requirements,
    birthdate,
    vaccine_status,
    neutered,
  } = req.body;

  try {
    const pet = await db.query(
      "SELECT * FROM pets WHERE id = $1 AND user_id = $2",
      [petId, userId]
    );

    if (pet.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to update this pet" });
    }

    const result = await db.query(
      "UPDATE pets SET name = $1, breed = $2, gender = $3, image = $4, dietary_requirements = $5, birthdate = $6, vaccine_status = $7, neutered = $8 WHERE id = $9 RETURNING *",
      [
        name,
        breed,
        gender,
        image,
        petId,
        dietary_requirements,
        birthdate,
        vaccine_status,
        neutered,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.delete("/:petId", firebaseAuthMiddleware, async (req, res) => {
  const userId = req.user.uid;
  const { petId } = req.params;

  try {
    const pet = await db.query(
      "SELECT * FROM pets WHERE id = $1 AND user_id = $2",
      [petId, userId]
    );

    if (pet.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to delete this pet" });
    }

    await db.query("DELETE FROM pets WHERE id = $1", [petId]);

    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
