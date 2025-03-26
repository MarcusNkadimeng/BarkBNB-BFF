const express = require("express");
const router = express.Router();

const pets = require("./pets");

router.use("/pets", pets);

module.exports = router;
