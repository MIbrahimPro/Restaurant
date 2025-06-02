const mongoose = require('mongoose');





const AddressSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Address title is required"],
            trim: true,
            maxlength: [50, "Title cannot exceed 50 characters"],
        },
        address: {
            type: String,
            required: [true, "Address text is required"],
            trim: true,
            maxlength: [200, "Address cannot exceed 200 characters"],
        },
    },
    { _id: false }
);

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        hashedPassword: {
            type: String,
            required: [true, "Password hash is required"],
            minlength: [60, "Hashed password must be at least 60 characters"], // e.g. bcrypt hash length
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            match: [
                /^\+?\d{1,15}$/, // Allows optional '+' followed by 1 to 15 digits (0-9)
                "Please fill a valid phone number (e.g., +1234567890 or 01234567890)",
            ],
        },
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        addresses: {
            type: [AddressSchema],
            default: [],
        },
    },
    { timestamps: true }
);





module.exports = mongoose.model('User', UserSchema);