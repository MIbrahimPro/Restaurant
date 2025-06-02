// /routes/orders.js

const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const Item = require("../models/Items");
const { authenticateToken, isAdmin } = require("../middleware/auth");

/**
 * POST /orders
 * Authenticated users place an order.
 * Body:
 *   {
 *     items: [
 *       { item: <itemId>, quantity: <number> }
 *       // … more items
 *     ],
 *     shippingAddress: { title, address },
 *     paymentMethod: "Cash on Delivery" | "Credit Card" | ...
 *   }
 */
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;
        console.log(items, shippingAddress, paymentMethod)
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "At least one item is required." });
        }
        if (
            !shippingAddress ||
            !shippingAddress.title ||
            !shippingAddress.address ||
            !paymentMethod
        ) {
            return res
                .status(400)
                .json({ message: "Shipping address and payment method are required." });
        }

        // 1) Fetch each item from DB to get current price & name
        let totalPrice = 0;
        const orderItems = [];
        for (let i = 0; i < items.length; i++) {
            const { item: itemId, quantity } = items[i];
            if (!itemId || !quantity || quantity < 1) {
                return res.status(400).json({ message: "Invalid item or quantity." });
            }
            const dbItem = await Item.findById(itemId);
            if (!dbItem) {
                return res.status(404).json({ message: `Item ${itemId} not found.` });
            }
            const priceAtPurchase = dbItem.price;
            const subTotal = priceAtPurchase * quantity;
            totalPrice += subTotal;

            orderItems.push({
                item: dbItem._id,
                name: dbItem.name,
                quantity,
                price: priceAtPurchase,
                subtotal: subTotal,
            });
        }

        // 2) Create Order document
        const newOrder = new Order({
            user: req.user._id,
            items: orderItems,
            totalPrice,
            shippingAddress: {
                title: shippingAddress.title.trim(),
                address: shippingAddress.address.trim(),
            },
            paymentMethod,
            paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
            status: "Pending",
        });

        await newOrder.save();
        return res.status(201).json(newOrder);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error." });
    }
});

/**
 * GET /orders
 * returns only their own orders
 */
router.get("/", authenticateToken, async (req, res) => {
    try {
        let filter = {};
        filter.user = req.user._id;
        const orders = await Order.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        return res.json(orders);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error." });
    }
});


/**
 * GET /orders
 * - Admin: returns all orders
 * - User: returns only their own orders
 */
router.get("/all", authenticateToken, async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === "customer") {
            filter.user = req.user._id;
        }
        const orders = await Order.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        return res.json(orders);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error." });
    }
});



/**
 * GET /orders/:id
 * - Admin: can fetch any order
 * - Customer: can fetch only their own
 */
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );
        if (!order) return res.status(404).json({ message: "Order not found." });

        // If customer, ensure they own it
        if (req.user.role === "customer" && !order.user._id.equals(req.user._id)) {
            return res.status(403).json({ message: "Access denied." });
        }

        return res.json(order);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Invalid ID." });
    }
});

/**
 * PUT /orders/:id
 * Admin only → update status or delete
 * Body can include: { status, paymentStatus }
 */
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const updates = {};
        if (req.body.status) {
            const allowedStatuses = [
                "Pending",
                "Processing",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
            ];
            if (!allowedStatuses.includes(req.body.status)) {
                return res
                    .status(400)
                    .json({ message: "Invalid status value." });
            }
            updates.status = req.body.status;
        }
        if (req.body.paymentStatus) {
            const allowedPays = ["Pending", "Paid", "Failed", "Refunded"];
            if (!allowedPays.includes(req.body.paymentStatus)) {
                return res
                    .status(400)
                    .json({ message: "Invalid paymentStatus value." });
            }
            updates.paymentStatus = req.body.paymentStatus;
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found." });
        return res.json(order);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Invalid data or ID." });
    }
});

/**
 * DELETE /orders/:id
 * Admin only → delete an order
 */
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found." });
        return res.json({ message: "Order deleted." });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Invalid ID." });
    }
});

module.exports = router;
