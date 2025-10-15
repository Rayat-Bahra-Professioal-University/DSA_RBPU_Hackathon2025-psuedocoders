const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  
  // Fields for OTP Verification
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },

  // Field for Admin Role (from our old model)
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);
module.exports = User;