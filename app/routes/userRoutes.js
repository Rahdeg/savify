const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { requireAuth } = require("../middleware/auth");

router.get("/dashboard", requireAuth, userController.showDashboard);
router.get("/transactions", requireAuth, userController.showTransactions);
router.get("/contributions", requireAuth, userController.showContributions);
router.get("/profile", requireAuth, userController.showProfile);
router.post("/profile", requireAuth, userController.updateProfile);
router.post("/profile/delete", requireAuth, userController.deleteUserAccount);


module.exports = router;
