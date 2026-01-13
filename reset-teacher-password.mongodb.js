// MongoDB Playground - Reset Teacher Password
use("school-management");

// Hash password: "adil123"
// You need to run this in backend to get the hash
const bcrypt = require('bcryptjs');
const newPassword = 'adil123';
const hashedPassword = await bcrypt.hash(newPassword, 10);

// Update teacher password
db.teachers.updateOne(
    { email: "adil@test.com" },
    { $set: { password: hashedPassword } }
);

// Verify
db.teachers.findOne({ email: "adil@test.com" }, { email: 1, name: 1 });
