// MongoDB Script - Remove empty teachers collection
use("school-management");

// Check if teachers collection exists and is empty
const teachersCount = db.teachers.countDocuments();
console.log("Teachers collection count:", teachersCount);

if (teachersCount === 0) {
    // Drop the empty collection
    db.teachers.drop();
    console.log("✅ Empty 'teachers' collection removed!");
} else {
    console.log("⚠️ Teachers collection has data, not removing.");
}

// Verify staffs collection (should have data)
const staffsCount = db.staffs.countDocuments();
console.log("Staffs collection count:", staffsCount);

// Show all collections
console.log("\n📋 All collections:");
db.getCollectionNames().forEach(name => {
    console.log(`  - ${name}`);
});
