const mongoose = require('mongoose');



const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
            minlength: [2, "Category name must be at least 2 characters"],
            maxlength: [50, "Category name cannot exceed 50 characters"],
        },
        icon: {
            type: String,
            required: [true, "Icon URL or classname is required"],
            trim: true,
        },
    },
    { timestamps: true }
);





module.exports = mongoose.model('Category', CategorySchema);
