// routes/users.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const SALT_ROUNDS = 12;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * A) GET /users/me
 *    (unchanged) – return the logged-in user info (name, email, phone, addresses, role, etc.)
 * ─────────────────────────────────────────────────────────────────────────────
 */
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-hashedPassword");
        if (!user) return res.status(404).json({ message: "User not found." });
        return res.json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error." });
    }
});

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * B) PUT /users/me
 *    Update name & phone only (email is not editable)
 * ─────────────────────────────────────────────────────────────────────────────
 */
router.put("/me", authenticateToken, async (req, res) => {
    try {
        const updates = {};
        if (req.body.name) updates.name = req.body.name.trim();
        if (req.body.phone) updates.phone = req.body.phone.trim();
        // Email is not allowed to change

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-hashedPassword");
        if (!user) return res.status(404).json({ message: "User not found." });
        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Invalid data." });
    }
});

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * C) PUT /users/me/change-password
 *    Change current password → new password
 * ─────────────────────────────────────────────────────────────────────────────
 */
router.put("/me/change-password", authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both fields are required." });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found." });

        const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password incorrect." });
        }

        const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
        user.hashedPassword = hashed;
        await user.save();
        return res.json({ message: "Password changed successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error." });
    }
});

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * D) POST /users/me/addresses
 *    Add a new address to current user 
 * ─────────────────────────────────────────────────────────────────────────────
 */
router.post("/me/addresses", authenticateToken, async (req, res) => {
    try {
        const { title, address } = req.body;
        if (!title || !address) {
            return res.status(400).json({ message: "Title and address are required." });
        }
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found." });

        // Prevent duplicates:
        const duplicate = user.addresses.find(
            (a) => a.title === title.trim() && a.address === address.trim()
        );
        if (duplicate) {
            return res.status(400).json({ message: "This address already exists." });
        }

        user.addresses.push({ title: title.trim(), address: address.trim() });
        await user.save();
        return res.status(201).json(user.addresses);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Invalid data." });
    }
});

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * E) PUT /users/me/addresses
 *    Edit an existing address by matching oldTitle & oldAddress
 * ─────────────────────────────────────────────────────────────────────────────
 */
router.put("/me/addresses", authenticateToken, async (req, res) => {
    try {
        const { oldTitle, oldAddress, title, address } = req.body;
        if (!oldTitle || !oldAddress || !title || !address) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found." });

        const idx = user.addresses.findIndex(
            (a) => a.title === oldTitle && a.address === oldAddress
        );
        if (idx === -1) {
            return res.status(404).json({ message: "Address not found." });
        }

        user.addresses[idx].title = title.trim();
        user.addresses[idx].address = address.trim();
        await user.save();
        return res.json(user.addresses);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Invalid data." });
    }
});

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * F) DELETE /users/me/addresses
 *    Remove an address by matching both title & address
 * ─────────────────────────────────────────────────────────────────────────────
 */
router.delete("/me/addresses", authenticateToken, async (req, res) => {
    try {
        const { title, address } = req.body;
        if (!title || !address) {
            return res.status(400).json({ message: "Title and address are required." });
        }
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found." });

        const filtered = user.addresses.filter(
            (a) => !(a.title === title && a.address === address)
        );
        user.addresses = filtered;
        await user.save();
        return res.json(user.addresses);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Invalid data." });
    }
});


/**
 * ─────────────────────────────────────────────────────────────────────────────
 * C) ADMIN‐ONLY: view/update/delete any user
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * GET /users
 * Admin → list all users
 */
router.get("/", authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select("-hashedPassword")
            .sort({ createdAt: -1 });
        return res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error." });
    }
});

/**
 * GET /users/:id
 * Admin → get one user by ID
 */
router.get("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-hashedPassword");
        if (!user) return res.status(404).json({ message: "User not found." });
        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Invalid ID." });
    }
});

/**
 * PUT /users/:id
 * Admin → update any user (e.g. change role or deactivate)
 * Body: { name, email, phone, role }
 */
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const updates = {};
        if (req.body.name) updates.name = req.body.name.trim();
        if (req.body.email) updates.email = req.body.email.toLowerCase().trim();
        if (req.body.phone) updates.phone = req.body.phone.trim();
        if (req.body.role && ["admin", "customer"].includes(req.body.role)) {
            updates.role = req.body.role;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-hashedPassword");
        if (!user) return res.status(404).json({ message: "User not found." });
        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Invalid data or ID." });
    }
});

/**
 * DELETE /users/:id
 * Admin → delete a user
 */
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: "User not found." });
        const deleteOrdersResult = await Order.deleteMany({ userId });
        return res.json({ message: "User deleted." });
    } catch (err) {
        console.error("Error deleting user or orders:", err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid User ID format." });
        }
        return res.status(500).json({ message: "An error occurred while deleting the user." });
    }
});

module.exports = router;
