const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiter');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');


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
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
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
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
  ],
  validate,
  authController.resetPassword
);


module.exports = router;
