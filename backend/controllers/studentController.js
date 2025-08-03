const Attendance = require("../models/Attendance");
const User = require("../models/User");

exports.getStudentAttendance = async (req, res) => {
  try {
    const { subject, className, date } = req.query;

    const query = { student: req.user._id };

    if (subject) query.subject = subject;
    if (className) query.className = className;
    if (date) {
      const day = new Date(date);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      query.date = {
        $gte: day,
        $lt: nextDay,
      };
    }

    const records = await Attendance.find(query);

    // Overall stats
    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    // Per subject stats
    const bySubject = {};

    records.forEach((record) => {
      const sub = record.subject || "Unknown";
      if (!bySubject[sub]) {
        bySubject[sub] = { total: 0, present: 0 };
      }
      bySubject[sub].total += 1;
      if (record.status === "present") {
        bySubject[sub].present += 1;
      }
    });

    for (let subject in bySubject) {
      const s = bySubject[subject];
      s.percentage = ((s.present / s.total) * 100).toFixed(2);
    }

    res.json({
      filter: { subject, className, date },
      overall: { total, present, percentage },
      bySubject,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
