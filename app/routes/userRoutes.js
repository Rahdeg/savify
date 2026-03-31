const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

const requireAuth = (req, res, next) => {
  if (req.session?.user) return next();
  return res.redirect("/auth/login");
};

router.get("/dashboard", requireAuth, userController.showDashboard);
router.get("/transactions", requireAuth, userController.showTransactions);

module.exports = router;
