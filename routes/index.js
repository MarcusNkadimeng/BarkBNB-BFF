const express = require("express");
const router = express.Router();

const pets = require("./pets");
const user = require("./user");
const serviceOfferings = require("./serviceOfferings");
const bookings = require("./bookings");
const units = require("./units");

router.use("/pets", pets);
router.use("/profile", user);
router.use("/service-offerings", serviceOfferings);
router.use("/bookings", bookings);
router.use("/units", units);

module.exports = router;
