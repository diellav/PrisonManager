const express = require("express");
const router = express.Router();
const paroleController = require("../controllers/parolesControllers");
const checkPermission = require("../checkPermission");


router.get("/", checkPermission("paroles.read"), paroleController.getAllParoles);
router.get("/:id", checkPermission("paroles.read"), paroleController.getParoleById);
router.post("/", checkPermission("paroles.create"), paroleController.addParole);
router.put("/:id", checkPermission("paroles.edit"), paroleController.updateParole);
router.delete("/:id", checkPermission("paroles.delete"), paroleController.deleteParole);

module.exports = router;
