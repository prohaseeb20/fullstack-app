const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ✅ auth route
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);
app.use("/api/student", require("./routes/student.routes"));
app.use("/api/teacher", require("./routes/teacher.routes"));
app.use("/api/ai", require("./routes/ai.routes"));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
