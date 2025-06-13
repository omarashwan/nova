const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const carController = require("../controllers/carController.JS");

router.get("/showcars.html", carController.showCars);
router.get("/cars/new", carController.newCarForm);
router.post("/cars", upload.single("image"), carController.createCar);
router.get("/car/:id", carController.carDetails);

module.exports = router;
