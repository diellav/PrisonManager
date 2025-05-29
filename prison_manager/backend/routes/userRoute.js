const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const userController = require("../controllers/userController");
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
      : "user";
    const finalName = `${namePart}_${originalName}${extension}`;
    cb(null, finalName);
  }
});

const upload = multer({ storage });

router.get("/", checkPermission("users.read"), userController.getUsers);
router.get("/:id", checkPermission("users.read"), userController.getUser);
router.post("/", checkPermission("users.create"), upload.single("photo"), userController.addUser);
router.put("/:id", checkPermission("users.edit"), upload.single("photo"), userController.updateUser);
router.delete("/:id", checkPermission("users.delete"), userController.deleteUser);
router.get("/profile/view", userController.getProfile);

module.exports = router;
