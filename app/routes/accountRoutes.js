const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controller");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, accountController.showAccounts);
router.get("/add", requireAuth, accountController.showAddAccount);
router.post("/add", requireAuth, accountController.addAccount);
router.get("/:id/edit", requireAuth, accountController.showEditAccount);
router.post("/:id/edit", requireAuth, accountController.updateAccount);
router.post("/:id/delete", requireAuth, accountController.deleteAccount);

module.exports = router;
