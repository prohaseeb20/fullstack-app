const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getAllAttendance,
  markAttendance,
  getClassStudents,
} = require("../controllers/teacherController");

router.get("/attendance", protect, getAllAttendance);
router.post("/attendance/mark", protect, markAttendance);
router.get("/students", protect, getClassStudents);
module.exports = router;
