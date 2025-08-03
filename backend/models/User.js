const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },
    className: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },

    subjects: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
