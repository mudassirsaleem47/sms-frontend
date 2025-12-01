const Student = require('../models/studentSchema.js');
const Sclass = require('../models/sclassSchema.js');
const bcrypt = require('bcryptjs');

// 1. New Student ka Admission
const studentAdmission = async (req, res) => {
    try {
        // Front-end se aane wala data
        const { rollNum, password, sclassName, school } = req.body;

        // Check: Roll Number ya Email pehle se exist toh nahi karta? (Email check later)
        const studentExists = await Student.findOne({ rollNum, sclassName });
        if (studentExists) {
            return res.status(400).json({ message: "Roll Number already registered in this class." });
        }

        // Check: Class ID valid hai?
        const sclass = await Sclass.findById(sclassName);
        if (!sclass) {
            return res.status(404).json({ message: "Class not found." });
        }
        
        // Password ko encrypt (Hashing)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya student object banana
        const newStudent = new Student({
            ...req.body, // Name, details etc.
            password: hashedPassword,
        });

        const result = await newStudent.save();

        res.status(201).json({ 
            message: "Student admitted successfully!",
            studentId: result._id
        });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error during Admission.", error: err.message });
    }
};

// 2. Student List Fetch karna (School ID ke hisab se)
const getStudentsBySchool = async (req, res) => {
    try {
        const { schoolId } = req.params;
        
        // Find students belonging to this school ID
        // .populate('sclassName') se class ka poora data bhi saath mein aa jayega
        const students = await Student.find({ school: schoolId }).populate('sclassName');

        if (students.length === 0) {
            return res.status(404).json({ message: "No students found in this school." });
        }

        // Security: Password ko response se hata diya
        const safeStudents = students.map(student => {
            const { password, ...rest } = student.toObject();
            return rest;
        });

        res.status(200).json(safeStudents);

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error while fetching students.", error: err.message });
    }
};


module.exports = { studentAdmission, getStudentsBySchool };