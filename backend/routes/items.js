// /routes/items.js

const express = require("express");
const router = express.Router();
const Item = require("../models/Items");
const Category = require("../models/Categories");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

/**
 * GET /items
 * Public → list all items (optionally filter by category via query ?category=<id>)
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const items = await Item.find(filter).populate("category", "name icon");
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
});

/**
 * GET /items/random
 * Public → get random items (default 4, max 10)
 * Query params: count (optional, number of items to return)
 */
router.get("/random", async (req, res) => {
  try {
    // Parse and validate the count query parameter
    let count = parseInt(req.query.count);
    if (isNaN(count) || count < 1) count = 4; // Default to 4 for the home screen

    // Use MongoDB aggregation to select random items
    const items = await Item.aggregate([{ $sample: { size: count } }]);

    // Populate the category field with name and icon
    const populatedItems = await Item.populate(items, { path: "category", select: "name icon" });

    // Return the populated items
    return res.json(populatedItems);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
});

/**
 * GET /items/:id
 * Public → get single item
 */
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("category", "name icon");
    if (!item) return res.status(404).json({ message: "Item not found." });
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid ID." });
  }
});

/**
 * POST /items
 * Admin only → create new item (with image file)
 * Use form‐data: fields: name, description, price, category (id), tags[]
 * and file field named “img”
 */
router.post(
  "/",
  authenticateToken,
  isAdmin,
  upload.single("img"),
  async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      if (!name || !description || !price || !category) {
        return res
          .status(400)
          .json({ message: "name, description, price, and category are required." });
      }

      // Verify category exists
      const cat = await Category.findById(category);
      if (!cat) return res.status(400).json({ message: "Invalid category ID." });

      // Build item object
      const newItem = {
        category,
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        img: req.file ? req.file.path : "",
      };


      const item = new Item(newItem);
      await item.save();

      return res.status(201).json(item);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Invalid data or missing fields." });
    }
  }
);

/**
 * PUT /items/:id
 * Admin only → update item (fields are optional, and you can upload a new img)
 */
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  upload.single("img"),
  async (req, res) => {
    try {
      const updates = {};
      if (req.body.name) updates.name = req.body.name.trim();
      if (req.body.description) updates.description = req.body.description.trim();
      if (req.body.price) updates.price = parseFloat(req.body.price);
      if (req.body.category) {
        // verify category
        const cat = await Category.findById(req.body.category);
        if (!cat) return res.status(400).json({ message: "Invalid category ID." });
        updates.category = req.body.category;
      }
      if (req.file) {
        updates.img = req.file.path;
      }

      const item = await Item.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!item) return res.status(404).json({ message: "Item not found." });
      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Invalid data or ID." });
    }
  }
);

/**
 * DELETE /items/:id
 * Admin only → remove item
 */
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });
    return res.json({ message: "Item deleted." });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid ID." });
  }
});

module.exports = router;
