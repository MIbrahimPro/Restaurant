// routes/categories.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Category = require('../models/Categories');
const Item = require('../models/Items');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// ─── Multer Configuration ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // compute the full directory path
    const uploadDir = path.join(__dirname, 'uploads', 'categories');

    // create the directory (and any missing parents) if it doesn't exist
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, uploadDir);
    });
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
// ─── GET /categories ───────────────────────────────────────────────────────────
// Returns all categories, each with an additional "itemsCount" field.
router.get('/', async (req, res) => {
  try {
    // Aggregate categories with a count of items in each
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: 'category',
          as: 'itemsArr',
        },
      },
      {
        $addFields: {
          itemsCount: { $size: '$itemsArr' },
        },
      },
      {
        $project: {
          itemsArr: 0, // remove the expanded array
        },
      },
    ]);
    return res.json(categories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ─── POST /categories ──────────────────────────────────────────────────────────
// Requires admin. Accepts "name" (text) and "icon" (file).
router.post('/', authenticateToken, isAdmin, upload.single('icon'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ message: 'Name and icon are required.' });
    }
    const iconPath = 'uploads/categories/' + req.file.filename;
    const newCat = new Category({ name: name.trim(), icon: iconPath });
    await newCat.save();
    return res.status(201).json(newCat);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ─── PUT /categories/:id ───────────────────────────────────────────────────────
// Requires admin. Accepts "name" (text) and optionally "icon" (file) to update.
router.put('/:id', authenticateToken, isAdmin, upload.single('icon'), async (req, res) => {
  try {
    const { name } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (req.file) {
      updates.icon = '/uploads/categories/' + req.file.filename;
    }
    const updatedCat = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedCat) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    return res.json(updatedCat);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// ─── DELETE /categories/:id ────────────────────────────────────────────────────
// Requires admin. Only delete if no items reference this category.
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const itemsCount = await Item.countDocuments({ category: req.params.id });
    if (itemsCount > 0) {
      return res
        .status(400)
        .json({ message: 'Cannot delete: category still has items.' });
    }
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    return res.json({ message: 'Category deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
