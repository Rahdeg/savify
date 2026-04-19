const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { isAdmin } = require("../middleware/isAdmin");

// Protect ALL admin routes with isAdmin middleware
router.get("/dashboard", isAdmin, adminController.showAdminDashboard);

module.exports = router;