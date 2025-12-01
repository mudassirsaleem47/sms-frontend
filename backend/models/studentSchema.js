const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNum: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass', // Link to Class Model
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin', // Link to Admin/School
        required: true
    },
    role: {
        type: String,
        default: "Student"
    }
}, { timestamps: true });

module.exports = mongoose.model("student", studentSchema);