const mongoose = require('mongoose');


const { Schema, model, Types } = mongoose;

const OrderItemSchema = new mongoose.Schema(
  {
    item: {
      type: Types.ObjectId,
      ref: "Item",
      required: [true, "Order must reference an item"],
    },
    name: {
      type: String,
      required: [true, "Item name at purchase time is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity cannot be less than 1"],
      default: 1,
    },
    price: {
      type: Number,
      required: [true, "Price at purchase time is required"],
      min: [0, "Price cannot be negative"],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"],
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Order must be associated with a user"],
    },
    items: {
      type: [OrderItemSchema],
      required: [true, "Order must contain at least one item"],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one order item is required",
      },
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shippingAddress: {
      type: new mongoose.Schema(
        {
          title: {
            type: String,
            required: [true, "Shipping address title is required"],
            trim: true,
          },
          address: {
            type: String,
            required: [true, "Shipping address text is required"],
            trim: true,
          },
        },
        { _id: false }
      ),
      required: [true, "Shipping address is required"],
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Credit Card", "Debit Card", "Online Payment"],
      required: [true, "Payment method is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Order', OrderSchema);