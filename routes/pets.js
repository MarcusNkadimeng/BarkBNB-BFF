const express = require("express");
const router = express.Router();
const firebaseAuthMiddleware = require("../middlewares/firebaseAuthMiddleware.js");
const db = require("../db/index.js");

router.get("/", firebaseAuthMiddleware, async (req, res) => {
  try {
    const userUid = firebaseAuthMiddleware.decodedToken.uid;
    const pets = await db.query("SELECT * FROM pets WHERE user_uid = $1", [
      userUid,
    ]);
    res.json(pets.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:petId", firebaseAuthMiddleware, async (req, res) => {
  const { petId } = req.params;

  try {
    const pet = await db.query("SELECT * FROM pets WHERE id = $1", [petId]);

    if (!pet.rows.length) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.json(pet.rows);
  } catch (error) {
    console.error("Error fetching pet:", error);
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
    medical_requirements,
    birthdate,
    vaccine_status,
    neutered,
  } = req.body;

  if (
    !name ||
    !breed ||
    !gender ||
    !image ||
    !dietary_requirements ||
    !medical_requirements ||
    !birthdate ||
    !vaccine_status ||
    !neutered
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.query(
      "INSERT INTO pets (user_uid, name, breed, gender, image, dietary_requirements, medical_requirements, birthdate, vaccine_status, neutered) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        userId,
        name,
        breed,
        gender,
        image,
        dietary_requirements,
        medical_requirements,
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
  const keys = [
    "name",
    "breed",
    "gender",
    "image",
    "dietary_requirements",
    "medical_requirements",
    "birthdate",
    "vaccine_status",
    "neutered",
  ];

  const fields = [];

  keys.forEach((key) => {
    if (req.body[key]) {
      fields.push(key);
    }
  });

  fields.forEach((field, index) => {
    db.query(
      `UPDATE pets SET ${field} = $1 WHERE id = $2 AND user_uid = $3`,
      [req.body[field], petId, userId],
      (err, result) => {
        if (err) {
          console.error("Error updating pet:", err);
          return res.status(500).json({ error: "Database error" });
        }
        if (index === fields.length - 1) {
          res.redirect("/api/pets");
        }
      }
    );
  });
});

router.delete("/:petId", firebaseAuthMiddleware, async (req, res) => {
  const userId = req.user.uid;
  const { petId } = req.params;

  try {
    const pet = await db.query(
      "SELECT * FROM pets WHERE id = $1 AND user_uid = $2",
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
