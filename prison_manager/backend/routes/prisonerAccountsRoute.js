const express = require("express");
const router = express.Router();
const prisonerAccountController = require("../controllers/prisonerAccountController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("prisoner_accounts.read"), prisonerAccountController.getPrisonerAccounts);
router.get("/:id", checkPermission("prisoner_accounts.read"), prisonerAccountController.getPrisonerAccount);
router.post("/", checkPermission("prisoner_accounts.create"), prisonerAccountController.addPrisonerAccount);
router.put("/:id", checkPermission("prisoner_accounts.edit"), prisonerAccountController.updatePrisonerAccount);
router.delete("/:id", checkPermission("prisoner_accounts.delete"), prisonerAccountController.deletePrisonerAccount);

module.exports = router;
