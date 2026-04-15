const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

const requireAuth = (req, res, next) => {
  
  if (req.session?.user) return next();
  return res.redirect("/auth/login");
 
};

// Temporary middleware to auto-login as user ID 3 for testing purposes. // AUTO LOGIN WITHOUT USER INTERACTION - REMOVE THIS BEFORE DEPLOYMENT
// const requireAuth = (req, res, next) => {
  
//   if (!req.session?.user) {
//     req.session.user = { user_id: "3" };
//   }

//   return next();
// };

router.get("/dashboard", requireAuth, userController.showDashboard);
router.get("/transactions", requireAuth, userController.showTransactions);


module.exports = router;
