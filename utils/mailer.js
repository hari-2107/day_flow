// utils/mailer.js
// Sends OTP emails via SMTP (works with Gmail, Outlook, SendGrid SMTP, etc.)
// Configure SMTP_* values in .env. If they're not set, OTPs are just
// logged to the console so you can still test locally without email setup.

const nodemailer = require("nodemailer");

const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

async function sendOtpEmail(toEmail, otp) {
  if (!transporter) {
    // Dev fallback: no SMTP configured, just print it
    console.log(`📧 [DEV MODE] OTP for ${toEmail}: ${otp}`);
    return { devMode: true };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: "Dayflow HRMS - Your Verification Code",
    text: `Your Dayflow verification code is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your Dayflow verification code is:</p>
           <h2 style="letter-spacing:4px;">${otp}</h2>
           <p>This code expires in 10 minutes.</p>`,
  });

  return { devMode: false };
}

module.exports = { sendOtpEmail };
