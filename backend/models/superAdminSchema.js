const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "SuperAdmin"
    },
    phone: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String
    }
}, { timestamps: true });

// Index for faster queries
superAdminSchema.index({ email: 1 });

module.exports = mongoose.model("superadmin", superAdminSchema);
