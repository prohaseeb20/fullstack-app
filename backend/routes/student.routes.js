const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getStudentAttendance } = require("../controllers/studentController");

router.get("/attendance", protect, getStudentAttendance);

module.exports = router;
