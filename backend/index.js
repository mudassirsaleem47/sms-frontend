const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes/route");
const transportRoutes = require("./routes/transportRoutes");
const lessonPlanRoutes = require("./routes/lessonPlanRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (
            origin.includes('hostingersite.com') ||
            origin.includes('vercel.app') ||
            origin.includes('localhost') ||
            origin.includes('127.0.0.1') ||
            origin.startsWith('http://192.168.')
        ) {
            return callback(null, true);
        }
        callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use('/uploads', express.static('uploads'));

// Routes
app.get("/", (req, res) => {
    res.send("School Management System Backend is Working!");
});

app.use('/', routes);
app.use('/Transport', transportRoutes);
app.use('/LessonPlan', lessonPlanRoutes);
app.use('/Attendance', attendanceRoutes);

// Database Connection
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
        if (require.main === module) {
            app.listen(PORT, '0.0.0.0', () => {
                console.log(`🚀 Server started on port ${PORT}`);
            });
        }
    })
    .catch((err) => {
        console.log("Database Connection Error:", err);
    });

module.exports = app;
