const nodemailer = require("nodemailer");
const { logger } = require("../utils/logger");

// Create transporter with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Send magic link verification email
exports.sendVerificationEmail = async (email, name, token) => {
  try {
    const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"ResourceHub" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: "Verify Your Email - ResourceHub ✨",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #f4f4f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 560px;
              margin: 40px auto;
              padding: 20px;
            }
            .card {
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              width: 70px;
              height: 70px;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              border-radius: 18px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
            }
            h1 {
              color: #111827;
              font-size: 28px;
              margin: 0 0 10px 0;
            }
            p {
              color: #4b5563;
              line-height: 1.6;
              margin: 16px 0;
            }
            .button-container {
              text-align: center;
              margin: 32px 0;
            }
            .verify-button {
              display: inline-block;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              text-decoration: none;
              padding: 14px 36px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
              transition: transform 0.2s;
            }
            .verify-button:hover {
              transform: translateY(-2px);
            }
            .fallback-link {
              margin-top: 24px;
              padding: 16px;
              background: #f9fafb;
              border-radius: 12px;
              font-size: 13px;
              word-break: break-all;
            }
            .fallback-link a {
              color: #10b981;
              text-decoration: none;
            }
            .expiry {
              text-align: center;
              color: #6b7280;
              font-size: 13px;
              margin-top: 24px;
              padding-top: 24px;
              border-top: 1px solid #e5e7eb;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #9ca3af;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <div class="logo">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h1>Verify your email</h1>
                <p style="font-size: 18px; color: #10b981; font-weight: 500;">Welcome to ResourceHub, ${name}! 🎉</p>
              </div>
              
              <p>Thanks for joining! Click the button below to verify your email address and activate your account.</p>
              
              <div class="button-container">
                <a href="${verificationLink}" class="verify-button">
                  ✨ Verify Email Address
                </a>
              </div>
              
              <div class="fallback-link">
                <p style="margin: 0 0 8px 0; color: #6b7280;">Button not working? Copy and paste this link:</p>
                <a href="${verificationLink}">${verificationLink}</a>
              </div>
              
              <div class="expiry">
                ⏰ This magic link will expire in <strong>24 hours</strong>
              </div>
              
              <div class="footer">
                <p>If you didn't create an account, you can safely ignore this email.</p>
                <p>© ${new Date().getFullYear()} ResourceHub</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to ResourceHub, ${name}!\n\nVerify your email by clicking this link:\n${verificationLink}\n\nThis link expires in 24 hours.\n\nIf you didn't create an account, ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`✅ Verification email sent to ${email} via Gmail`);
    return true;
  } catch (error) {
    logger.error(`Gmail error: ${error.message}`);
    return false;
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (email, name, userType) => {
  try {
    const mailOptions = {
      from: `"ResourceHub" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: "Welcome to ResourceHub! 🎉",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4f46e5;">Welcome to ResourceHub, ${name}! 🎉</h2>
          <p>Your account has been successfully verified. You're now ready to:</p>
          <ul>
            <li>📚 Share and discover resources</li>
            <li>🤝 Connect with the community</li>
            <li>⭐ Save your favorite content</li>
          </ul>
          <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard" 
             style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Go to Dashboard
          </a>
          <hr />
          <p style="color: #6b7280; font-size: 12px;">Need help? Just reply to this email!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error(`Welcome email error: ${error.message}`);
    return false;
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, name, token) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"ResourceHub" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: "Reset Your Password - ResourceHub",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password. Click the button below:</p>
          <a href="${resetLink}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Reset Password
          </a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    logger.error(`Password reset email error: ${error.message}`);
    return false;
  }
};
