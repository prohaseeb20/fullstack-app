const Attendance = require("../models/Attendance");
const User = require("../models/User");

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, status } = req.body;

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // prevent duplicate entry for same date
    const existing = await Attendance.findOne({
      student: studentId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for today" });
    }

    const attendance = new Attendance({
      student: studentId,
      status,
    });

    await attendance.save();

    res.status(201).json({ message: "Attendance marked", attendance });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  console.log("Logged-in student:", req.user._id);

  try {
    const mongoose = require("mongoose");
    const attendance = await Attendance.find({
      student: new mongoose.Types.ObjectId(req.user._id),
    });

    console.log("Found attendance records:", attendance);

    // Optional: Calculate percentage
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({ total, present, percentage, attendance });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Teacher View All Attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate(
      "student",
      "name email role"
    );
    res.json({ attendance });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
