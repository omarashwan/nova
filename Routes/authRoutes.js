const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.JS");

router.get("/login.html", authController.getLogin);
router.get("/register.html", authController.getRegister);
router.post("/registerform", authController.postRegister);
router.post("/loginform", authController.postLogin);
router.get("/logout", authController.logout);

module.exports = router;
