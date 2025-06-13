const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController.JS");
const requireLogin = require("../middlewares/requireLogin.JS");

router.post("/book/:id", requireLogin, bookingController.bookCar);
router.get("/confirmation", bookingController.confirmation);
router.get("/history", bookingController.history);

module.exports = router;
