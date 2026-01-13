// Check if teacher exists in database
use("school-management");

// Find teacher with exact email
const teacher = db.teachers.findOne({ email: "adil@test.com" });

if (teacher) {
    print("✅ Teacher found!");
    print("Name:", teacher.name);
    print("Email:", teacher.email);
    print("Status:", teacher.status || "N/A");
    print("Role:", teacher.role);
} else {
    print("❌ Teacher NOT found with email: adil@test.com");
    print("\nAll teachers in database:");
    db.teachers.find({}, { name: 1, email: 1 }).forEach(t => {
        print(`- ${t.name}: ${t.email}`);
    });
}
