const mongoose = require("mongoose");

const sclassSchema = new mongoose.Schema({
    sclassName: {
        type: String,
        required: true,
    },
    // Sections ka array add kiya (e.g., Section A, Section B)
    sections: [{ 
        sectionName: { type: String, required: true } 
    }],
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    }
}, { timestamps: true });

module.exports = mongoose.model("sclass", sclassSchema);