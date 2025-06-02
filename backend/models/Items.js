const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const ItemSchema = new mongoose.Schema(
    {
        category: {
            type: Types.ObjectId,
            ref: "Category",
            required: [true, "Category reference is required"],
        },
        name: {
            type: String,
            required: [true, "Item name is required"],
            unique: true,
            trim: true,
            minlength: [2, "Item name must be at least 2 characters"],
            maxlength: [100, "Item name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        img: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true,
        },
    },
    { timestamps: true }
);







module.exports = mongoose.model('Item', ItemSchema);