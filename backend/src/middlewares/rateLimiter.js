const rateLimit = require('express-rate-limit');

// 🔐 Auth rate limiter
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per window
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 📅 Event creation rate limiter
exports.eventLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: {
    success: false,
    message: "Too many event requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});
