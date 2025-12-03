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
    section: {
        type: String, // Storing Section Name
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
    },
    // Personal Information
    firstName: String,
    lastName: String,
    gender: String,
    dateOfBirth: Date,
    category: String,
    mobileNumber: String,
    email: String,

    // Admission Details
    admissionDate: Date,
    studentPhoto: String,
    bloodGroup: String,
    house: String,
    height: String,
    weight: String,
    measurementDate: Date,

    // Religion and Caste
    religion: String,
    caste: String,

    // Parent/Guardian Details
    father: {
        name: String,
        phone: String,
        occupation: String,
        email: String,
        address: String,
        photo: String
    },
    mother: {
        name: String,
        phone: String,
        occupation: String,
        email: String,
        address: String,
        photo: String
    },
    guardian: {
        name: String,
        phone: String,
        occupation: String,
        email: String,
        address: String,
        photo: String,
        relation: String
    },

    // Transport Details
    transport: {
        route: String,
        pickupPoint: String,
        feesMonth: String
    },

    // Siblings
    siblings: [{
        name: String,
        class: String,
        section: String,
        rollNum: String,
        school: String
    }]
}, { timestamps: true });

module.exports = mongoose.model("student", studentSchema);