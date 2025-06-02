const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffSalaryController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("staff_salaries.read"), staffController.getAllSalaries);
router.get("/:id", checkPermission("staff_salaries.read"), staffController.getSalaryById);
router.post("/", checkPermission("staff_salaries.create"), staffController.addSalary);
router.put("/:id", checkPermission("staff_salaries.edit"), staffController.updateSalary);
router.delete("/:id", checkPermission("staff_salaries.delete"), staffController.deleteSalary);

module.exports = router;
