const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.JS");
const isAdmin = require("../middlewares/isAdmin.JS");


router.get("/admin-dashboard",  adminController.adminDashboard);
router.get("/cars", adminController.getManageCars);
router.post("/cars/delete/:id", adminController.deleteCar);
router.get("/admin/cars/edit/:id", adminController.getEditCar);
router.post("/admin/cars/edit/:id", adminController.postEditCar);
router.get("/bookings",adminController.managebooking);






module.exports = router;
