const Student = require('../models/studentSchema');
const Staff = require('../models/staffSchema');
const Sclass = require('../models/sclassSchema');
const Campus = require('../models/campusSchema');
const Designation = require('../models/designationSchema');
const Fee = require('../models/feeSchema');
const FeeTransaction = require('../models/feeTransactionSchema');

// Execute function based on Gemini's function call
async function executeFunctionCall(functionName, args, schoolId) {
    try {
        switch (functionName) {
            case 'getStudents':
                return await getStudents(args, schoolId);
            
            case 'getStaff':
                return await getStaff(args, schoolId);
            
            case 'getClasses':
                return await getClasses(args, schoolId);
            
            case 'getFeeStatistics':
                return await getFeeStatistics(args, schoolId);
            
            case 'getCampuses':
                return await getCampuses(schoolId);
            
            case 'getDesignations':
                return await getDesignations(args, schoolId);
            
            case 'getSystemStats':
                return await getSystemStats(schoolId);
            
            default:
                throw new Error(`Unknown function: ${functionName}`);
        }
    } catch (error) {
        console.error(`Error executing function ${functionName}:`, error);
        throw error;
    }
}

// Get students with filters
async function getStudents(args, schoolId) {
    const filter = { school: schoolId };
    
    if (args.status && args.status !== 'all') {
        filter.status = args.status;
    }
    
    if (args.className) {
        const classDoc = await Sclass.findOne({ 
            sclassName: new RegExp(args.className, 'i'),
            school: schoolId 
        });
        if (classDoc) {
            filter.sclassName = classDoc._id;
        }
    }
    
    if (args.campus) {
        const campusDoc = await Campus.findOne({
            campusName: new RegExp(args.campus, 'i'),
            school: schoolId
        });
        if (campusDoc) {
            filter.campus = campusDoc._id;
        }
    }
    
    const limit = args.limit || 50;
    
    const students = await Student.find(filter)
        .populate('sclassName', 'sclassName')
        .populate('campus', 'campusName')
        .limit(limit)
        .select('name email rollNum status sclassName campus')
        .lean();
    
    return {
        count: students.length,
        students: students.map(s => ({
            name: s.name,
            email: s.email,
            rollNum: s.rollNum,
            class: s.sclassName?.sclassName || 'N/A',
            campus: s.campus?.campusName || 'N/A',
            status: s.status
        }))
    };
}

// Get staff with filters
async function getStaff(args, schoolId) {
    const filter = { school: schoolId };
    
    if (args.status && args.status !== 'all') {
        filter.status = args.status;
    }
    
    if (args.designation) {
        const designationDoc = await Designation.findOne({
            name: new RegExp(args.designation, 'i'),
            school: schoolId
        });
        if (designationDoc) {
            filter.designation = designationDoc._id;
        }
    }
    
    if (args.campus) {
        const campusDoc = await Campus.findOne({
            campusName: new RegExp(args.campus, 'i'),
            school: schoolId
        });
        if (campusDoc) {
            filter.campus = campusDoc._id;
        }
    }
    
    const staff = await Staff.find(filter)
        .populate('designation', 'name')
        .populate('campus', 'campusName')
        .select('name email phone designation campus status')
        .lean();
    
    return {
        count: staff.length,
        staff: staff.map(s => ({
            name: s.name,
            email: s.email,
            phone: s.phone || 'N/A',
            designation: s.designation?.name || 'N/A',
            campus: s.campus?.campusName || 'N/A',
            status: s.status
        }))
    };
}

// Get classes
async function getClasses(args, schoolId) {
    const filter = { school: schoolId };
    
    if (args.campus) {
        const campusDoc = await Campus.findOne({
            campusName: new RegExp(args.campus, 'i'),
            school: schoolId
        });
        if (campusDoc) {
            filter.campus = campusDoc._id;
        }
    }
    
    const classes = await Sclass.find(filter)
        .populate('campus', 'campusName')
        .select('sclassName sections campus')
        .lean();
    
    return {
        count: classes.length,
        classes: classes.map(c => ({
            name: c.sclassName,
            sections: c.sections?.length || 0,
            campus: c.campus?.campusName || 'N/A'
        }))
    };
}

// Get fee statistics
async function getFeeStatistics(args, schoolId) {
    const filter = { school: schoolId };
    
    if (args.campus) {
        const campusDoc = await Campus.findOne({
            campusName: new RegExp(args.campus, 'i'),
            school: schoolId
        });
        if (campusDoc) {
            filter.campus = campusDoc._id;
        }
    }
    
    // Get all fee transactions
    const transactions = await FeeTransaction.find(filter);
    
    const totalCollected = transactions.reduce((sum, t) => sum + (t.amountPaid || 0), 0);
    const totalPending = transactions.reduce((sum, t) => sum + (t.remainingAmount || 0), 0);
    
    // Get pending fees count
    const pendingFeesCount = await Fee.countDocuments({
        ...filter,
        status: 'pending'
    });
    
    return {
        totalCollected,
        totalPending,
        pendingFeesCount,
        transactionCount: transactions.length
    };
}

// Get campuses
async function getCampuses(schoolId) {
    const campuses = await Campus.find({ school: schoolId })
        .select('campusName campusCode address')
        .lean();
    
    // Get stats for each campus
    const campusesWithStats = await Promise.all(
        campuses.map(async (campus) => {
            const studentCount = await Student.countDocuments({ 
                school: schoolId, 
                campus: campus._id 
            });
            const staffCount = await Staff.countDocuments({ 
                school: schoolId, 
                campus: campus._id 
            });
            
            return {
                name: campus.campusName,
                code: campus.campusCode,
                address: campus.address || 'N/A',
                students: studentCount,
                staff: staffCount
            };
        })
    );
    
    return {
        count: campuses.length,
        campuses: campusesWithStats
    };
}

// Get designations
async function getDesignations(args, schoolId) {
    const filter = { school: schoolId };
    
    if (args.status && args.status !== 'all') {
        filter.isActive = args.status;
    }
    
    const designations = await Designation.find(filter)
        .select('name description isActive')
        .lean();
    
    // Get staff count for each designation
    const designationsWithCount = await Promise.all(
        designations.map(async (designation) => {
            const staffCount = await Staff.countDocuments({
                school: schoolId,
                designation: designation._id
            });
            
            return {
                name: designation.name,
                description: designation.description || 'N/A',
                status: designation.isActive,
                staffCount
            };
        })
    );
    
    return {
        count: designations.length,
        designations: designationsWithCount
    };
}

// Get system statistics
async function getSystemStats(schoolId) {
    const [
        totalStudents,
        activeStudents,
        totalStaff,
        activeStaff,
        totalClasses,
        totalCampuses
    ] = await Promise.all([
        Student.countDocuments({ school: schoolId }),
        Student.countDocuments({ school: schoolId, status: 'active' }),
        Staff.countDocuments({ school: schoolId }),
        Staff.countDocuments({ school: schoolId, status: 'active' }),
        Sclass.countDocuments({ school: schoolId }),
        Campus.countDocuments({ school: schoolId })
    ]);
    
    return {
        students: {
            total: totalStudents,
            active: activeStudents,
            inactive: totalStudents - activeStudents
        },
        staff: {
            total: totalStaff,
            active: activeStaff,
            inactive: totalStaff - activeStaff
        },
        classes: totalClasses,
        campuses: totalCampuses
    };
}

module.exports = {
    executeFunctionCall
};
