const express = require("express");
const router = express.Router();
const securityLogsController = require("../controllers/securityLogsController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("security_logs.read"), securityLogsController.getSecurityLogs);
router.get("/:id", checkPermission("security_logs.read"), securityLogsController.getSecurityLog);
router.post("/", checkPermission("security_logs.create"), securityLogsController.addSecurityLog);
router.put("/:id", checkPermission("security_logs.edit"), securityLogsController.updateSecurityLog);
router.delete("/:id", checkPermission("security_logs.delete"), securityLogsController.deleteSecurityLog);

module.exports = router;
