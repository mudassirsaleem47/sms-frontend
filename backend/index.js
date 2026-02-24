const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes/route");

// Config setup
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (Data samajhne ke liye)
app.use(express.json());

// --- MIDDLEWARE: Double Slash Fix ---
app.use((req, res, next) => {
    if (req.url.includes('//')) {
        req.url = req.url.replace(/\/+/g, '/');
    }
    next();
});

// CORS configuration for local network + Vercel deployments
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Postman, etc.)
        if (!origin) return callback(null, true);

        const sanitizedOrigin = origin.replace(/\/$/, "");

        // Simplified: Allow common domains and local dev
        if (
            sanitizedOrigin.includes('hostingersite.com') ||
            sanitizedOrigin.includes('vercel.app') ||
            sanitizedOrigin.includes('localhost') ||
            sanitizedOrigin.includes('127.0.0.1') ||
            sanitizedOrigin.startsWith('http://192.168.')
        ) {
            return callback(null, true);
        }

        console.log("CORS Blocked Origin:", origin);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use('/uploads', express.static('uploads'));

// Basic Route (Check karne ke liye ke server chal raha hai ya nahi)
app.get("/", (req, res) => {
    res.send("School Management System Backend is Working!");
});

app.use('/', routes);

const transportRoutes = require("./routes/transportRoutes");
app.use('/Transport', transportRoutes);

const lessonPlanRoutes = require("./routes/lessonPlanRoutes");
app.use('/LessonPlan', lessonPlanRoutes);

const attendanceRoutes = require("./routes/attendanceRoutes");
app.use('/Attendance', attendanceRoutes);

// Database Connection aur Server Start
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
        if (require.main === module) {
            app.listen(PORT, '0.0.0.0', () => {
                console.log(`🚀 Server started on port ${PORT}`);
                console.log(`📱 Access from other devices: http://192.168.10.85:${PORT}`);
            });
        }
    })
    .catch((err) => {
        console.log("Database Connection Error:", err);
    });

module.exports = app;
