const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiter');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');


// ===============================
// 🔐 Authentication Routes
// ===============================


// ===============================
// 🔹 Activate Account (Controlled Registration)
// ===============================
router.post(
  '/activate',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required'),

    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ],
  validate,
  authController.activateAccount
);


// ===============================
// 🔹 Login
// ===============================
router.post(
  '/login',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required'),

    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  validate,
  authController.login
);


// ===============================
// 🔹 Forgot Password (Send OTP)
// ===============================
router.post(
  '/forgot-password',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
  ],
  validate,
  authController.forgotPassword
);


// ===============================
// 🔹 Verify OTP
// ===============================
router.post(
  '/verify-otp',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required'),

    body('otp')
      .isLength({ min: 4, max: 4 })
      .withMessage('OTP must be 4 digits')
  ],
  validate,
  authController.verifyOtp
);


// ===============================
// 🔹 Reset Password
// ===============================
router.post(
  '/reset-password',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required'),

    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
  ],
  validate,
  authController.resetPassword
);


// ===============================
// 🔹 Update Profile (H5)
// ===============================
router.put(
  '/profile',
  verifyToken,
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
  ],
  validate,
  authController.updateProfile
);


// ===============================
// 🔹 Get Users by Role(s)
// Used by frontend to resolve user IDs for inbox notifications
// ?roles=STUDENT,TECHNICAL_OFFICER,INSTRUCTOR,HOD  (comma-separated)
// ===============================
const db = require('../config/db');
router.get('/users', verifyToken, (req, res) => {
  const roles = req.query.roles
    ? req.query.roles.split(',').map(r => r.trim().toUpperCase())
    : [];
  if (roles.length === 0) {
    return res.json([]);
  }
  const placeholders = roles.map(() => '?').join(',');
  db.query(
    `SELECT id, CONCAT(first_name, ' ', last_name) AS name, email, role FROM users WHERE role IN (${placeholders})`,
    roles,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});


module.exports = router;
