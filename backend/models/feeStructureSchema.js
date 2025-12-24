const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    feeName: {
        type: String,
        required: true
    },
    feeType: {
        type: String,
        enum: ['Tuition', 'Transport', 'Library', 'Sports', 'Lab', 'Exam', 'Uniform', 'Other'],
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    section: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    academicYear: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model("feeStructure", feeStructureSchema);
