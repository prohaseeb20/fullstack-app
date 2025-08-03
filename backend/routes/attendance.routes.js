const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { markAttendance } = require("../controllers/attendanceController");
const {
  getStudentAttendance,
  getAllAttendance,
} = require("../controllers/attendanceController");

// Protected POST route
router.post("/mark", protect, markAttendance);
router.get("/student", protect, getStudentAttendance);
router.get("/all", protect, getAllAttendance);

module.exports = router;
