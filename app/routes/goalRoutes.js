const express = require("express");
const router = express.Router();
const goalController = require("../controllers/goal.controller");
const categoryController = require("../controllers/category.controller");

router.get("/", goalController.listGoals);
router.get("/categories", categoryController.showCategories);
router.post("/create", goalController.createGoal);
router.get("/:id", goalController.showGoalDetails);
router.get("/:id/transactions", goalController.showTransactions);




module.exports = router;
