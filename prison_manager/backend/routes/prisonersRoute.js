const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const prisonerController = require("../controllers/prisonersController");
const checkPermission = require("../checkPermission");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
      const originalName = path.parse(file.originalname).name.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
      const extension = path.extname(file.originalname);
      
      const namePart = req.body.first_name && req.body.last_name 
        ? `${req.body.first_name}_${req.body.last_name}`.replace(/\s+/g, "_") 
        : "prisoner";
  
      const finalName = `${namePart}_${originalName}${extension}`;
      cb(null, finalName);
    }
  });
  
const upload = multer({ storage });

router.get("/", checkPermission("prisoners.read"), prisonerController.getPrisoners);
router.get("/:id", checkPermission("prisoners.read"), prisonerController.getPrisoner);
router.post("/", checkPermission("prisoners.create"), upload.single("photo"), prisonerController.addPrisoner);
router.put("/:id", checkPermission("prisoners.edit"), upload.single("photo"), prisonerController.updatePrisoner);
router.delete("/:id", checkPermission("prisoners.delete"), prisonerController.deletePrisoner);

module.exports = router;
