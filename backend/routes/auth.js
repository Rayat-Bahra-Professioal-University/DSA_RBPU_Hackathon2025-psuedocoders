const express = require("express");
const bcrypt = require("bcryptjs"); // Use bcryptjs to be consistent
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Correct model path
const sendOtpEmail = require("../utils/sendOtp");

const router = express.Router();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- SIGNUP ---
router.post("/signup", async (req, res) => {
  // We wrap the entire logic in a try...catch block
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Use bcryptjs here
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    // Send OTP email
    await sendOtpEmail(email, otp);

    // If everything is successful, send the response
    res.status(201).json({ message: "OTP sent to your email", userId: newUser._id });
  } catch (err) {
    console.error("SIGNUP ERROR:", err); // Log the detailed error on the server
    res.status(500).json({ message: "Server error during signup process. Please check server logs." });
  }
});

// --- VERIFY OTP ---
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.isVerified = true;
    user.otp = undefined; // Use undefined to remove from MongoDB document
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Account verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin, // <-- IMPORTANT
      },
    });
  } catch (err) { /* ... */ }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isMatch = user && (await bcrypt.compare(password, user.password));
    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
      await user.save();
      await sendOtpEmail(email, otp);
      return res.status(200).json({ message: "OTP sent to email", userId: user._id });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin, // <-- IMPORTANT
      },
    });
  } catch (err) { /* ... */ }
});

module.exports = router;