const express = require("express");
const router = express.Router();

const pets = require("./pets");
const user = require("./user");

router.use("/pets", pets);
router.use("/profile", user);

module.exports = router;
