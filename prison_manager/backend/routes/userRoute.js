const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("users.read"), userController.getUsers);
router.get("/:id", checkPermission("users.read"), userController.getUser);
router.post("/", checkPermission("users.create"), userController.addUser);
router.put("/:id", checkPermission("users.edit"), userController.updateUser);
router.delete("/:id", checkPermission("users.delete"), userController.deleteUser);

module.exports = router;
