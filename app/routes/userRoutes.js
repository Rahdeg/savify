const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/dashboard", userController.showDashboard);

module.exports = router;
