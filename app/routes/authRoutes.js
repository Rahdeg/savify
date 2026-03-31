const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get("/register", authController.showRegister);
router.get("/login", authController.showLogin);
router.get("/verify", authController.showVerifyEmail);
router.get("/logout", authController.logout);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify", authController.verifyEmail);
router.post("/resend-otp", authController.resendOtp);

module.exports = router;
