const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { isAdmin } = require("../middleware/isAdmin");
const { requireAdminSecret } = require("../middleware/requireAdminSecret");

router.get("/verify", isAdmin, adminController.showVerifyPage);
router.post("/verify", isAdmin, adminController.verifyAdminSecret);
router.get("/dashboard", isAdmin, requireAdminSecret, adminController.showAdminDashboard);

module.exports = router;