const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Signup = require("../models/Signup");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // First try finding in User collection
    let user = await User.findById(decoded.userId).select("-password");

    // If not found, try finding in Signup collection
    if (!user) {
      user = await Signup.findById(decoded.userId).select("-password");
    }

    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ message: "Invalid token or user inactive." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Access denied. Admin role required." });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { auth, adminAuth };
