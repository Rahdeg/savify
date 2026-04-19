const express = require("express");
const router = express.Router();
const goalController = require("../controllers/goal.controller");
const categoryController = require("../controllers/category.controller");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, goalController.listGoals);
router.get("/categories", requireAuth, categoryController.showCategories);
router.post("/create", requireAuth, goalController.createGoal);
router.get("/:id", goalController.showGoalDetails);
router.get("/:id/transactions", goalController.showTransactions);
router.get("/:id/contribute", requireAuth, goalController.showContributePage);
router.post("/:id/contribute", requireAuth, goalController.addContribution);
router.get("/:id/withdraw", requireAuth, goalController.showWithdrawPage);
router.post("/:id/withdraw", requireAuth, goalController.withdrawGoal);
module.exports = router;
