// /routes/auth.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const { authenticateToken } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET ;
const SALT_ROUNDS = 12;

/**
 * POST /auth/signup
 * Body: { name, email, password, phone }
 * Creates a new user (role defaults to "customer").
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      hashedPassword: hashed,
      phone: phone.trim(),
      // role → defaults to "customer"
    });

    await user.save();
    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
});

/**
 * POST /auth/login
 * Body: { email, password }
 * Returns: { token, user: { _id, name, email, phone, role, addresses } }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    // Return user data (minus hashedPassword)
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
    };

    return res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
});

/**
 * GET /auth/me
 * Headers: Authorization: Bearer <token>
 * Returns the currently logged‐in user’s data.
 */
router.get("/me", authenticateToken, (req, res) => {
  const safeUser = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    addresses: req.user.addresses,
  };
  return res.json({ user: safeUser });
});

module.exports = router;
