const { OpenAI } = require("openai");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.askAI = async (req, res) => {
  try {
    const { question } = req.body;

    // Fetch attendance data based on user role
    let records;
    if (req.user.role === "teacher") {
      records = await Attendance.find().populate("student", "name email");
    } else {
      records = await Attendance.find({ student: req.user._id }).populate(
        "student",
        "name email"
      );
    }

    const attendanceData = records.map((r) => {
      return `${r.student.name} (${r.student.email}) - ${r.subject} - ${
        r.status
      } on ${new Date(r.date).toDateString()}`;
    });

    const prompt = `
You are an attendance assistant.
Here is the attendance data:\n\n${attendanceData.join("\n")}
\n\nQuestion: ${question}
Answer in 1-2 sentences.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI failed", details: err.message });
  }
};
