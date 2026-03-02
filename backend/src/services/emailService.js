const nodemailer = require("nodemailer");

exports.sendResetEmail = async (to, otp) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Verification</h2>
        <p>You requested to reset your password.</p>
        <p>Your 4-digit verification code is:</p>
        <h1 style="letter-spacing: 5px; color: #2563eb;">${otp}</h1>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully to:", to);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
