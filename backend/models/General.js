const mongoose = require('mongoose');


const { Schema, model, Types } = mongoose;



const GeneralSchema = new Schema(
    {
        contactPhone: {
            type: String,
            required: [true, "Contact phone is required"],
            trim: true,
            match: [
                /^\+?\d{1,15}$/, // Allows optional '+' followed by 1 to 15 digits (0-9)
                "Please fill a valid phone number (e.g., +1234567890 or 01234567890)",
            ],
        },
        contactEmail: {
            type: String,
            required: [true, "Contact email is required"],
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        contactAddress: {
            type: String,
            required: [true, "Contact address is required"],
            trim: true,
            maxlength: [200, "Contact address cannot exceed 200 characters"],
        },
        Instagram: {
            type: String,
            required: [true, "Instagram link is required"],
            trim: true,
        },
        Facebook: {
            type: String,
            required: [true, "Instagram link is required"],
            trim: true,
        },
        Whatsaap: {
            type: String,
            required: [true, "Instagram link is required"],
            trim: true,
        },

    },
    { timestamps: true }
);


module.exports = mongoose.model('General', GeneralSchema);