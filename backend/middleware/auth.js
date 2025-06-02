// /middleware/auth.js

const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const SECRET = process.env.JWT_SECRET;

// 1) Verify JWT and attach `req.user`
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // expecting “Bearer <token>”
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const payload = jwt.verify(token, SECRET);
    // payload should contain at least { userId, role, email, etc. }
    const user = await User.findById(payload.userId).select("-hashedPassword");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // attach full user document (minus password)
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

// 2) Only allow if user.role === "admin"
function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

module.exports = {
  authenticateToken,
  isAdmin,
};
