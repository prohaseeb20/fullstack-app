const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
    required: true, // new field
  },
  className: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
