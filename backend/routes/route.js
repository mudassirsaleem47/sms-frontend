const router = require('express').Router();
const { adminRegister, adminLogin } = require('../controllers/admin-controller.js');
const { studentAdmission, getStudentsBySchool } = require('../controllers/student-controller.js');
const { enquiryCreate, enquiryList, enquiryDelete, enquiryUpdate } = require('../controllers/enquiry-controller.js');
const { sclassCreate, getSclassesBySchool, deleteSclass, addSection, deleteSection } = require('../controllers/sclass-controller.js');
const { addTeacher, getTeachersBySchool, updateTeacher, deleteTeacher, assignClassToTeacher, removeClassFromTeacher } = require('../controllers/teacher-controller.js');
const { visitorCreate, visitorList, visitorUpdate, visitorDelete } = require('../controllers/visitor-controller.js');


// --- Admin Auth Routes ---
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogin);

// --- Student Routes ---
router.post('/StudentRegister', studentAdmission); 
router.get('/Students/:schoolId', getStudentsBySchool); 

// --- SClass (Academic) Routes ---
// POST: Nayi Class Create karna
router.post('/SclassCreate', sclassCreate);

// GET: Class List (School ID ke hisab se)
router.get('/Sclasses/:schoolId', getSclassesBySchool);

// DELETE: Class Delete karna
router.delete('/Sclass/:id', deleteSclass);

// Add Section
router.put('/Sclass/:id/Section', addSection);
// Delete Section
router.delete('/Sclass/:id/Section/:sectionId', deleteSection);

// --- Enquiry Routes ---

// Nayi enquiry add karna
router.post('/EnquiryCreate', enquiryCreate);

// Saari enquiries dekhna (School ID ke sath)
router.get('/EnquiryList/:id', enquiryList);

// Enquiry delete karna (ID ke sath)
router.delete('/EnquiryDelete/:id', enquiryDelete);

// Enquiry edit/update karna
router.put('/EnquiryUpdate/:id', enquiryUpdate);

// --- Teacher Routes ---

// POST: Naya Teacher Add karna
router.post('/TeacherRegister', addTeacher);

// GET: Teacher List (School ID ke hisab se)
router.get('/Teachers/:schoolId', getTeachersBySchool);

// PUT: Teacher Update karna
router.put('/Teacher/:id', updateTeacher);

// DELETE: Teacher Delete karna
router.delete('/Teacher/:id', deleteTeacher);

// PUT: Class Assign karna Teacher ko
router.put('/Teacher/:id/AssignClass', assignClassToTeacher);

// DELETE: Class Remove karna Teacher se
router.delete('/Teacher/:id/Class/:classId', removeClassFromTeacher);

// --- Visitor Routes ---

// POST: Naya Visitor Add karna
router.post('/VisitorCreate', visitorCreate);

// GET: Visitor List (School ID ke hisab se)
router.get('/Visitors/:schoolId', visitorList);

// PUT: Visitor Update karna
router.put('/Visitor/:id', visitorUpdate);

// DELETE: Visitor Delete karna
router.delete('/Visitor/:id', visitorDelete);


module.exports = router;