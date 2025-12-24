const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Admin",
    },
    schoolName: {
        type: String,
        unique: true,
        required: true
    },
    schoolLogo: {
        type: String,
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    website: {
        type: String,
    }
});

module.exports = mongoose.model("admin", adminSchema);