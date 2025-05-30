const express = require("express");
const router = express.Router();
const courtHearingController = require("../controllers/court_hearingController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("court_hearings.read"), courtHearingController.getAllHearings);
router.get("/:id", checkPermission("court_hearings.read"), courtHearingController.getHearingById);
router.post("/", checkPermission("court_hearings.create"), courtHearingController.addHearing);
router.put("/:id", checkPermission("court_hearings.edit"), courtHearingController.updateHearing);
router.delete("/:id", checkPermission("court_hearings.delete"), courtHearingController.deleteHearing);

module.exports = router;
