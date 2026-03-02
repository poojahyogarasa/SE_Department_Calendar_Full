const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendResetEmail } = require('../services/emailService');


// =======================
// 🔐 ACTIVATE ACCOUNT (Controlled Registration)
// =======================
exports.activateAccount = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    // ❌ Not pre-registered
    if (results.length === 0) {
      return res.status(403).json({
        message: 'You are not authorized. Contact admin.'
      });
    }

    const user = results[0];

    // ❌ Already activated
    if (user.is_active === 1) {
      return res.status(400).json({
        message: 'Account already activated. Please login.'
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'UPDATE users SET password = ?, is_active = 1 WHERE email = ?',
        [hashedPassword, email],
        (updateErr) => {
          if (updateErr)
            return res.status(500).json({
              message: 'Error activating account'
            });

          return res.status(200).json({
            message: 'Account activated successfully'
          });
        }
      );

    } catch (error) {
      return res.status(500).json({
        message: 'Password hashing failed'
      });
    }
  });
};


// =======================
// 🔐 LOGIN
// =======================
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password required'
    });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const user = results[0];

    // ❌ Not activated
    if (user.is_active !== 1) {
      return res.status(403).json({
        message: 'Account not activated. Please activate your account first.'
      });
    }

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          department: user.department
        }
      });

    } catch {
      return res.status(500).json({
        message: 'Authentication failed'
      });
    }
  });
};


// =======================
// 🔐 FORGOT PASSWORD
// =======================
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'Email is required'
    });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(200).json({
        message: 'If this email exists, a verification code has been sent.'
      });
    }

    const user = results[0];

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    db.query(
      'INSERT INTO password_reset_tokens (user_id, token, expiry) VALUES (?, ?, ?)',
      [user.id, otp, expiry],
      async (insertErr) => {
        if (insertErr)
          return res.status(500).json({
            message: 'Error generating OTP'
          });

        try {
          await sendResetEmail(email, otp);

          return res.status(200).json({
            message: 'Verification code sent successfully'
          });

        } catch {
          return res.status(500).json({
            message: 'Failed to send verification code'
          });
        }
      }
    );
  });
};


// =======================
// 🔐 VERIFY OTP
// =======================
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: 'Email and OTP required'
    });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0)
      return res.status(400).json({ message: 'Invalid request' });

    const user = results[0];

    db.query(
      `SELECT * FROM password_reset_tokens 
       WHERE user_id = ? AND token = ? 
       ORDER BY id DESC LIMIT 1`,
      [user.id, otp],
      (tokenErr, tokenResults) => {

        if (tokenErr)
          return res.status(500).json({ message: 'Database error' });

        if (tokenResults.length === 0)
          return res.status(400).json({ message: 'Invalid OTP' });

        const resetToken = tokenResults[0];

        if (new Date(resetToken.expiry) < new Date())
          return res.status(400).json({ message: 'OTP expired' });

        return res.status(200).json({
          message: 'OTP verified successfully'
        });
      }
    );
  });
};


// =======================
// 🔐 RESET PASSWORD
// =======================
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      message: 'Email and new password required'
    });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0)
      return res.status(400).json({ message: 'Invalid request' });

    const user = results[0];

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, user.id],
        (updateErr) => {

          if (updateErr)
            return res.status(500).json({
              message: 'Error updating password'
            });

          db.query(
            'DELETE FROM password_reset_tokens WHERE user_id = ?',
            [user.id]
          );

          return res.status(200).json({
            message: 'Password reset successful'
          });
        }
      );

    } catch {
      return res.status(500).json({
        message: 'Password reset failed'
      });
    }
  });
};
