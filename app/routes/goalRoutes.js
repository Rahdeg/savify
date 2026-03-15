const express = require("express");
const router = express.Router();
const goalController = require("../controllers/goal.controller");

router.get("/", goalController.listGoals);
router.get("/:id", goalController.showGoalDetails);
router.get("/:id/transactions", goalController.showTransactions);

module.exports = router;
