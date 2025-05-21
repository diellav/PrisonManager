const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const checkPermission = require("../checkPermission");

router.get("/permissions", checkPermission("roles.read"), roleController.getAllPermissions);
router.get("/", checkPermission("roles.read"), roleController.getRoles);
router.get("/:id", checkPermission("roles.read"), roleController.getRole);
router.post("/", checkPermission("roles.create"), roleController.addRole);
router.put("/:id", checkPermission("roles.edit"), roleController.updateRole);
router.delete("/:id", checkPermission("roles.delete"), roleController.deleteRole);

module.exports = router;
