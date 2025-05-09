const express = require("express");
const router = express.Router();

const pets = require("./pets");
const user = require("./user");
const serviceOfferings = require("./serviceOfferings");

router.use("/pets", pets);
router.use("/profile", user);
router.use("/service-offerings", serviceOfferings);

module.exports = router;
