require('dotenv').config();

const express = require('express');
const cors = require('cors');

require('./config/db');

const app = express();

// ===============================
// 🔐 Secure CORS Configuration
// ===============================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// ===============================
// 🔄 Middleware
// ===============================
app.use(express.json());

// ===============================
// 📦 ROUTES IMPORT
// ===============================
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const hodRoutes = require('./routes/hodRoutes');
const toRoutes = require('./routes/toRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const todoRoutes = require('./routes/todoRoutes');
const auditRoutes = require('./routes/auditRoutes');

// ===============================
// 🚀 ROUTES REGISTER
// ===============================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/to', toRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audit', auditRoutes);

// ===============================
// 🏠 Root Route
// ===============================
app.get('/', (req, res) => {
  res.send('Department Calendar Backend Running 🚀');
});

// ===============================
// ❌ 404 Handler
// ===============================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ===============================
// ⚠ Global Error Handler
// ===============================
const { errorHandler } = require('./middlewares/errorMiddleware');
app.use(errorHandler);

// ===============================
module.exports = app;
