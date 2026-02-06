const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const Signup = require("../models/Signup");
const OTP = require("../models/OTP");
const { sendOTPEmail } = require("../utils/emailService");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password, phone, otp } = req.body;

    // Check if user already exists in either collection
    const existingSignup = await Signup.findOne({ email });
    const existingUser = await User.findOne({ email });

    if (existingSignup || existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Create new user
    const user = new Signup({
      name,
      email,
      password,
      phone,
    });

    await user.save();

    // Delete OTP record after successful registration
    await OTP.deleteMany({ email });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user - Try both collections
    let user = await Signup.findOne({ email });
    if (!user) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: "Account is deactivated." });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error during profile update." });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // The user object from req.user might not have the password field if it was deselected
    // Let's re-fetch the user with password from the correct collection
    let userWithPassword;
    if (user.constructor.modelName === 'Signup') {
      userWithPassword = await Signup.findById(user._id);
    } else {
      userWithPassword = await User.findById(user._id);
    }

    if (!userWithPassword) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify current password
    const isMatch = await userWithPassword.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    // Update password
    userWithPassword.password = newPassword;
    await userWithPassword.save();

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error during password change." });
  }
};

// Google Login
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId, picture } = ticket.getPayload();

    let user = await Signup.findOne({ email });
    if (!user) {
      user = await User.findOne({ email });
    }

    if (!user) {
      // Create new user if not exists
      user = new Signup({
        name,
        email,
        googleId,
        picture,
        isActive: true,
      });
      await user.save();
    } else {
      // Update existing user's Google info
      user.googleId = googleId;
      if (picture) user.picture = picture;
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Google Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: picture,
      },
    });
  } catch (error) {
    console.error("Google Login error:", error);
    res.status(500).json({ message: "Google Login failed." });
  }
};

// Send OTP
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save/Update OTP in DB
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send Email
    const emailResult = await sendOTPEmail(email, otp);

    if (emailResult.success) {
      res.json({ message: "OTP sent successfully to your email." });
    } else {
      res.status(500).json({ message: "Failed to send OTP email." });
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Server error while sending OTP." });
  }
};

// Verify OTP (Standalone if needed)
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const otpRecord = await OTP.findOne({ email, otp });

    if (otpRecord) {
      res.json({ success: true, message: "OTP verified successfully." });
    } else {
      res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error while verifying OTP." });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  getProfile,
  updateProfile,
  changePassword,
  sendOTP,
  verifyOTP,
};
