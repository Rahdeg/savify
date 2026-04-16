const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { requireAuth } = require("../middleware/auth");

router.get("/dashboard", requireAuth, userController.showDashboard);
router.get("/transactions", requireAuth, userController.showTransactions);


module.exports = router;
