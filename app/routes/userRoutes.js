const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/dashboard", userController.showDashboard);
router.get("/transactions", userController.showTransactions);

module.exports = router;
