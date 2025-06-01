const express = require("express");
const router = express.Router();
const incidentsController = require("../controllers/incidentsController");
const checkPermission = require("../checkPermission");
const { verifyToken } = require('../authMiddleware');


router.get("/", checkPermission("incidents.read"), incidentsController.getIncidents);
router.get("/:id", checkPermission("incidents.read"), incidentsController.getIncident);
router.post("/", checkPermission("incidents.create"), incidentsController.addIncident);
router.put("/:id", checkPermission("incidents.edit"), incidentsController.updateIncident);
router.delete("/:id", checkPermission("incidents.delete"), incidentsController.deleteIncident);

module.exports = router;
