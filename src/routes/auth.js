// routes/auth.js
const express = require('express');
const sendOtpEmail = require('../helper/emailService'); // Import your email service
const router = express.Router();

// Endpoint to send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Send OTP to the provided email
  const success = await sendOtpEmail(email, otp);

  if (success) {
    // Here, you would typically save the OTP to your database with an expiration time
    // Example: await db.collection('otps').insertOne({ email, otp, expires: Date.now() + 600000 });
    res.status(200).json({ message: 'OTP sent successfully' });
  } else {
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

module.exports = router;
