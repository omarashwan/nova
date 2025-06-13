const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.JS");
const requireLogin = require("../middlewares/requireLogin.JS");


router.get("/", userController.home);
router.get("/user-dashboard", requireLogin, userController.userDashboard);
router.get("/login", userController.renderLogin);
router.get("/register", userController.renderRegister);
router.post("/loginform", userController.login);
router.post("/registerform", userController.register);
router.get("/logout", userController.logout);


module.exports = router;
