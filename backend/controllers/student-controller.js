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

        // Handle file uploads
        const studentPhoto = req.files && req.files['studentPhoto'] ? req.files['studentPhoto'][0].path : "";
        const fatherPhoto = req.files && req.files['fatherPhoto'] ? req.files['fatherPhoto'][0].path : "";
        const motherPhoto = req.files && req.files['motherPhoto'] ? req.files['motherPhoto'][0].path : "";
        const guardianPhoto = req.files && req.files['guardianPhoto'] ? req.files['guardianPhoto'][0].path : "";

        // Parse JSON fields
        const father = req.body.father ? JSON.parse(req.body.father) : {};
        const mother = req.body.mother ? JSON.parse(req.body.mother) : {};
        const guardian = req.body.guardian ? JSON.parse(req.body.guardian) : {};
        const transport = req.body.transport ? JSON.parse(req.body.transport) : {};
        const siblings = req.body.siblings ? JSON.parse(req.body.siblings) : [];

        const newStudent = new Student({
            ...req.body,
            password: hashedPassword,
            studentPhoto,
            father: { ...father, photo: fatherPhoto },
            mother: { ...mother, photo: motherPhoto },
            guardian: { ...guardian, photo: guardianPhoto },
            transport,
            siblings
        });

        const result = await newStudent.save();

        res.status(201).json({ 
            message: "Student admitted successfully!",
            studentId: result._id
        });

    } catch (err) {
        console.error(err);
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

const updateStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        // Logic to update fields
        const result = await Student.findByIdAndUpdate(studentId, req.body, { new: true });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Error updating student", error: err.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        await Student.findByIdAndDelete(studentId);
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting student", error: err.message });
    }
};

module.exports = { studentAdmission, getStudentsBySchool, updateStudent, deleteStudent };