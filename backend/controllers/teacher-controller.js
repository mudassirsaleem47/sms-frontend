const Teacher = require('../models/teacherSchema.js');
const bcrypt = require('bcryptjs');

// 1. Add New Teacher
const addTeacher = async (req, res) => {
    try {
        const { name, email, password, phone, subject, qualification, experience, salary, joiningDate, school } = req.body;

        // Check: Email already exists?
        const teacherExists = await Teacher.findOne({ email });
        if (teacherExists) {
            return res.status(400).json({ message: "Email already registered." });
        }

        // Password Hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new teacher
        const newTeacher = new Teacher({
            name,
            email,
            password: hashedPassword,
            phone,
            subject,
            qualification,
            experience: experience || 0,
            salary,
            joiningDate: joiningDate || Date.now(),
            school,
            assignedClasses: []
        });

        const result = await newTeacher.save();

        res.status(201).json({
            message: "Teacher added successfully!",
            teacherId: result._id
        });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error during Teacher Registration.", error: err.message });
    }
};

// 2. Get All Teachers by School
const getTeachersBySchool = async (req, res) => {
    try {
        const { schoolId } = req.params;

        // Find teachers and populate assigned classes
        const teachers = await Teacher.find({ school: schoolId })
            .populate('assignedClasses', 'sclassName')
            .select('-password'); // Exclude password from response

        if (teachers.length === 0) {
            return res.status(404).json({ message: "No teachers found in this school." });
        }

        res.status(200).json(teachers);

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error while fetching teachers.", error: err.message });
    }
};

// 3. Update Teacher Details
const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If password is being updated, hash it
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedTeacher) {
            return res.status(404).json({ message: "Teacher not found." });
        }

        res.status(200).json({
            message: "Teacher updated successfully!",
            teacher: updatedTeacher
        });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error during Teacher Update.", error: err.message });
    }
};

// 4. Delete Teacher
const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTeacher = await Teacher.findByIdAndDelete(id);

        if (!deletedTeacher) {
            return res.status(404).json({ message: "Teacher not found." });
        }

        res.status(200).json({ message: "Teacher deleted successfully!" });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error during Teacher Deletion.", error: err.message });
    }
};

// 5. Assign Class to Teacher
const assignClassToTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { classId } = req.body;

        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found." });
        }

        // Check if class is already assigned
        if (teacher.assignedClasses.includes(classId)) {
            return res.status(400).json({ message: "Class already assigned to this teacher." });
        }

        teacher.assignedClasses.push(classId);
        await teacher.save();

        res.status(200).json({
            message: "Class assigned successfully!",
            teacher: await teacher.populate('assignedClasses', 'sclassName')
        });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error during Class Assignment.", error: err.message });
    }
};

// 6. Remove Class from Teacher
const removeClassFromTeacher = async (req, res) => {
    try {
        const { id, classId } = req.params;

        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found." });
        }

        teacher.assignedClasses = teacher.assignedClasses.filter(
            cls => cls.toString() !== classId
        );

        await teacher.save();

        res.status(200).json({
            message: "Class removed successfully!",
            teacher: await teacher.populate('assignedClasses', 'sclassName')
        });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error during Class Removal.", error: err.message });
    }
};

module.exports = {
    addTeacher,
    getTeachersBySchool,
    updateTeacher,
    deleteTeacher,
    assignClassToTeacher,
    removeClassFromTeacher
};
