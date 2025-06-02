// routes/admin.js

const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Category = require('../models/Categories');
const Item = require('../models/Items');
const Order = require('../models/Orders');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// GET /admin/stats
// Returns counts of users, categories, items, and orders
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const categoriesCount = await Category.countDocuments();
    const itemsCount = await Item.countDocuments();
    const ordersCount = await Order.countDocuments();
    return res.json({ usersCount, categoriesCount, itemsCount, ordersCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
