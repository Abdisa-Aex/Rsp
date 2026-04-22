const nodemailer = require("nodemailer");
const { logger } = require("../utils/logger");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Gmail error:', error.message);
  } else {
    console.log('✅ Gmail ready');
  }
});

// Send magic link verification email
exports.sendVerificationEmail = async (email, name, token) => {
  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    
    console.log(`📧 Sending to: ${email}`);
    console.log(`🔗 Link: ${verificationLink}`);

    const mailOptions = {
      from: `"ResourceHub" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: "Verify Your ResourceHub Account ✨",
      text: `Welcome to ResourceHub, ${name}!\n\nVerify your email by clicking this link:\n${verificationLink}\n\nThis link expires in 24 hours.\n\nIf you didn't create an account, ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #10b981;">Welcome to ResourceHub, ${name}! 🎉</h2>
          <p>Click the button below to verify your email:</p>
          <a href="${verificationLink}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy this link: <a href="${verificationLink}">${verificationLink}</a></p>
          <p style="color: #666; font-size: 12px;">This link expires in 24 hours.</p>
          <hr>
          <p style="color: #999; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent! Message ID: ${info.messageId}`);
    logger.info(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    logger.error(`Gmail error: ${error.message}`);
    return false;
  }
};

exports.sendWelcomeEmail = async (email, name, userType) => {
  try {
    await transporter.sendMail({
      from: `"ResourceHub" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: "Welcome to ResourceHub! 🎉",
      text: `Welcome ${name}! Your account is verified.`,
      html: `<h2>Welcome ${name}!</h2><p>Your account is verified and ready to use.</p>`,
    });
    return true;
  } catch (error) {
    return false;
  }
};

exports.sendPasswordResetEmail = async (email, name, token) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: `"ResourceHub" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: "Reset Your Password",
      text: `Reset your password: ${resetLink}`,
      html: `<a href="${resetLink}">Reset Password</a>`,
    });
    return true;
  } catch (error) {
    return false;
  }
};

exports.sendTransactionEmail = async (email, name, type, details) => {
  try {
    await transporter.sendMail({
      from: `"ResourceHub" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: `${type} - ResourceHub`,
      text: details,
    });
    return true;
  } catch (error) {
    return false;
  }
};
