const Attendance = require("../models/Attendance");
const User = require("../models/User");
exports.markAttendance = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied: Teachers only" });
    }

    const { studentId, status } = req.body;
    const subject = req.user.subjects?.[0]; // use req.body.subject if you allow multiple
    if (!subject) {
      return res.status(400).json({ message: "Subject not found for teacher" });
    }
    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // prevent duplicate entry for same date
    const existing = await Attendance.findOne({
      student: studentId,
      subject,
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
      subject,
      status,
      className: student.className,
    });

    await attendance.save();

    res.status(201).json({ message: "Attendance marked", attendance });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id);
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied: Teachers only" });
    }

    const { subject, className, date } = req.query;
    const query = {};

    if (subject) query.subject = subject;
    if (className) query.className = className;
    // Enforce subject to be within teacher's subjects
    if (subject) {
      if (teacher.subjects?.includes(subject)) {
        query.subject = subject;
      } else {
        return res
          .status(403)
          .json({ message: "Access denied to this subject" });
      }
    } else if (teacher.subjects?.length) {
      query.subject = { $in: teacher.subjects };
    }

    if (date) {
      const day = new Date(date);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      query.date = {
        $gte: day,
        $lt: nextDay,
      };
    }

    const attendance = await Attendance.find(query).populate(
      "student",
      "name email role"
    );

    res.json({ attendance });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getClassStudents = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied: Teachers only" });
    }

    const students = await User.find({
      role: "student",
      className: req.user.className,
    }).select("name _id");

    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
