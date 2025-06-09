
const express = require("express");
const router = express.Router();
const transportController = require("./transportController");

router.get("/", transportController.getTransport);
router.get("/:id", transportController.getTransportById);
router.post("/", transportController.createTransport);
router.put("/:id", transportController.updateTransport);
router.delete("/:id", transportController.deleteTransport);

module.exports = router;
