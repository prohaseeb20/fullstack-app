const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { registerUser, loginUser } = require("../controllers/authController");

// Signup
router.post("/signup", registerUser);

// Login
router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
  res.json({ message: "This is protected", user: req.user });
});

module.exports = router;
