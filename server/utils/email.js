import nodemailer from 'nodemailer';
import Mailjet from 'node-mailjet';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize environment variables
const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY;
const MAILJET_FROM_EMAIL =
  process.env.MAILJET_FROM_EMAIL || process.env.EMAIL_FROM_ADDRESS;
const MAILJET_FROM_NAME =
  process.env.MAILJET_FROM_NAME ||
  process.env.EMAIL_FROM_NAME ||
  'Career Recommender';

const NODEMAILER_EMAIL = process.env.AUTH_EMAIL || process.env.EMAIL_USERNAME;
const NODEMAILER_PASSWORD =
  process.env.AUTH_PASSWORD || process.env.EMAIL_PASSWORD;
const NODEMAILER_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
const NODEMAILER_HOST = process.env.EMAIL_HOST;
const NODEMAILER_PORT = process.env.EMAIL_PORT;

// OAuth2 credentials
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;

const LOGO_URL =
  process.env.LOGO_URL ||
  'https://cdn.qwenlm.ai/output/2515d0a9-066b-4246-890e-2303a3e28f0d/t2i/aa5e1966-42c4-45af-95b4-c5ffbe396d90/e6209e7e-7894-45b8-b5e2-015bcfc4126d.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiMjUxNWQwYTktMDY2Yi00MjQ2LTg5MGUtMjMwM2EzZTI4ZjBkIiwicmVzb3VyY2VfaWQiOiJlNjIwOWU3ZS03ODk0LTQ1YjgtYjVlMi0wMTViY2ZjNDEyNmQiLCJyZXNvdXJjZV9jaGF0X2lkIjpudWxsfQ.u7kqqDiWSoXLmAfYsPxoRMTWxTfsQvR23WXCEk1Wmqo';

// Modern email styles
const emailStyles = `
  <style>
    .email-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #0080ff 0%, #0066cc 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      max-width: 200px;
      height: auto;
      margin-bottom: 20px;
    }
    .header-title {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .email-body {
      padding: 40px 30px;
      line-height: 1.6;
      color: #374151;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 20px;
    }
    .content-text {
      font-size: 16px;
      margin-bottom: 20px;
      color: #4b5563;
    }
    .highlight-box {
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
      position: relative;
    }
    .highlight-box.success {
      background: #f0fdf4;
      border-color: #22c55e;
    }
    .highlight-box.warning {
      background: #fffbeb;
      border-color: #f59e0b;
    }
    .highlight-box.info {
      background: #eff6ff;
      border-color: #3b82f6;
    }
    .highlight-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 12px 0;
      color: #111827;
    }
    .highlight-box.success .highlight-title {
      color: #16a34a;
    }
    .highlight-box.warning .highlight-title {
      color: #d97706;
    }
    .highlight-box.info .highlight-title {
      color: #2563eb;
    }
    .appointment-details {
      background: #f8fafc;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
    }
    .appointment-details h3 {
      color: #111827;
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 16px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #374151;
    }
    .detail-value {
      color: #111827;
      font-weight: 500;
    }
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 16px 0;
    }
    .feature-list li {
      padding: 8px 0;
      position: relative;
      padding-left: 24px;
    }
    .feature-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #22c55e;
      font-weight: bold;
    }
    .cta-section {
      text-align: center;
      margin: 32px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #0080ff 0%, #0066cc 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(0, 128, 255, 0.3);
      transition: all 0.3s ease;
    }
    .email-footer {
      background: #f9fafb;
      padding: 32px 30px;
      border-top: 1px solid #e5e7eb;
    }
    .footer-content {
      text-align: center;
    }
    .footer-signature {
      font-size: 16px;
      color: #374151;
      margin-bottom: 24px;
    }
    .footer-signature strong {
      color: #0080ff;
    }
    .footer-contact {
      margin-bottom: 20px;
    }
    .footer-contact h4 {
      color: #111827;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 12px 0;
    }
    .contact-info {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .footer-link {
      color: #0080ff;
      text-decoration: none;
      font-size: 14px;
      padding: 2px 10px;
      font-weight: 500;
    }
    .footer-link:hover {
      text-decoration: underline;
    }
    .footer-disclaimer {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      .email-header, .email-body, .email-footer {
        padding: 24px 20px;
      }
      .header-title {
        font-size: 24px;
      }
      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      .footer-links {
        flex-direction: column;
        gap: 12px;
      }
    }
  </style>
`;

// Modern email wrapper
const wrapEmail = (headerTitle, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerTitle} - Career Recommender</title>
  ${emailStyles}
</head>
<body style="margin: 0; padding: 20px; background-color: #f3f4f6;">
  <div class="email-container">
    <div class="email-header">
      <img src="${LOGO_URL}" alt="Career Recommender Logo" class="logo" />
      <h1 class="header-title">${headerTitle}</h1>
    </div>
    
    <div class="email-body">
      ${bodyContent}
    </div>
    
    <div class="email-footer">
      <div class="footer-content">
        <div class="footer-signature">
          <strong>Best regards,</strong><br>
          The Career Recommender Team
        </div>
        
        <div class="footer-contact">
          <h4>Contact Information</h4>
          <div class="contact-info">
            ${process.env.SUPPORT_EMAIL || 'support@careerrecommender.com'}<br>
            ${process.env.SUPPORT_PHONE || '+254 700 000 000'}<br>
            ${process.env.CLIENT_URL || 'http://localhost:3000'}
          </div>
        </div>
        
        <div class="footer-links">
          <a href="${
            process.env.CLIENT_URL || 'http://localhost:3000'
          }/privacy" class="footer-link">Privacy Policy</a>
          <a href="${
            process.env.CLIENT_URL || 'http://localhost:3000'
          }/terms" class="footer-link">Terms of Service</a>
          <a href="${
            process.env.CLIENT_URL || 'http://localhost:3000'
          }/support" class="footer-link">Contact Us</a>
        </div>
        
        <div class="footer-disclaimer">
          <p>© ${new Date().getFullYear()} Career Recommender. All rights reserved.<br>
          This email was sent to you because you have an account with Career Recommender.<br>
          If you no longer wish to receive these emails, you can <a href="${
            process.env.CLIENT_URL || 'http://localhost:3000'
          }/unsubscribe" style="color: #0080ff;">unsubscribe here</a>.</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Initialize Nodemailer transport using Gmail App Password (SMTP)
const createNodemailerTransport = async () => {
  const dkimConfig =
    process.env.DKIM_DOMAIN_NAME &&
    process.env.DKIM_SELECTOR &&
    process.env.DKIM_PRIVATE_KEY
      ? {
          dkim: {
            domainName: process.env.DKIM_DOMAIN_NAME,
            keySelector: process.env.DKIM_SELECTOR,
            privateKey: process.env.DKIM_PRIVATE_KEY,
          },
        }
      : {};

  const host = NODEMAILER_HOST || 'smtp.gmail.com';
  const port = Number(NODEMAILER_PORT || 587);

  if (!NODEMAILER_EMAIL || !NODEMAILER_PASSWORD) {
    throw new Error(
      'SMTP auth missing: AUTH_EMAIL/EMAIL_USERNAME and AUTH_PASSWORD/EMAIL_PASSWORD are required'
    );
  }

  console.log(
    '[Email] Using Nodemailer via SMTP (App Password). Host:',
    host,
    'Port:',
    port
  );

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: String(port) === '465',
    auth: {
      user: NODEMAILER_EMAIL,
      pass: NODEMAILER_PASSWORD, // Use Gmail App Password when host=smtp.gmail.com
    },
    tls: { rejectUnauthorized: false },
    ...dkimConfig,
  });

  // Verify the transporter configuration
  try {
    await transporter.verify();
    console.log('✅ Email server ready');
  } catch (err) {
    console.error('❌ Email config error:', err);
    throw err;
  }

  return transporter;
};

// Initialize Mailjet client if credentials are available
const getMailjetClient = () => {
  if (MAILJET_API_KEY && MAILJET_SECRET_KEY) {
    return Mailjet.apiConnect(MAILJET_API_KEY, MAILJET_SECRET_KEY);
  }
  return null;
};

// Enhanced email templates with modern design
const emailTemplates = {
  // Welcome email template
  welcome: (name) =>
    wrapEmail(
      'Welcome to Career Recommender',
      `
    <div class="greeting">Hello ${name}! 👋</div>
    <p class="content-text">We're thrilled to welcome you to Career Recommender, your personalized career guidance platform!</p>
    <p class="content-text">Thank you for taking this important step towards discovering career paths that align with your KCSE results and interests.</p>
    
    <div class="highlight-box success">
      <h3 class="highlight-title">🚀 You're All Set!</h3>
      <p class="content-text">Your account is ready to use. You can now input your KCSE results and receive personalized career recommendations.</p>
    </div>
    
    <div class="highlight-box info">
      <h3 class="highlight-title">What's Next?</h3>
      <ul class="feature-list">
        <li>Complete your profile with accurate KCSE results</li>
        <li>Receive personalized career recommendations</li>
        <li>Explore different career paths and requirements</li>
        <li>Access our career resources and tools</li>
      </ul>
    </div>
    
    <div class="cta-section">
      <a href="${
        process.env.CLIENT_URL || 'http://localhost:3000'
      }" class="cta-button">Get Started</a>
    </div>
    
    <div class="highlight-box warning">
      <h3 class="highlight-title">💡 Pro Tip</h3>
      <p class="content-text">The more accurate your KCSE results, the better your career recommendations will be!</p>
    </div>
    
    <p class="content-text">If you have any questions or need assistance getting started, don't hesitate to reach out to our support team. We're here to help you every step of the way.</p>
  `
    ),

  // Password reset template
  resetPassword: (resetLink) =>
    wrapEmail(
      'Reset Your Password',
      `
    <div class="greeting">Password Reset Request 🔐</div>
    <p class="content-text">We received a request to reset your password. No worries - it happens to the best of us!</p>
    
    <div class="highlight-box info">
      <h3 class="highlight-title">Reset Your Password</h3>
      <p class="content-text">Click the button below to create a new password for your account:</p>
    </div>
    
    <div class="cta-section">
      <a href="${resetLink}" class="cta-button">Reset My Password</a>
    </div>
    
    <div class="highlight-box warning">
      <h3 class="highlight-title">⚠️ Important Security Information</h3>
      <ul class="feature-list">
        <li>This link will expire in <strong>10 minutes</strong> for security reasons</li>
        <li>If you didn't request this reset, please ignore this email</li>
        <li>Contact support if you have concerns about your account security</li>
      </ul>
    </div>
  `
    ),

  // Email verification template
  verifyEmail: (verificationLink) =>
    wrapEmail(
      'Verify Your Email Address',
      `
    <div class="greeting">Email Verification ✉️</div>
    <p class="content-text">Thank you for registering with Career Recommender! We're almost ready to help you discover your ideal career path.</p>
    
    <div class="highlight-box info">
      <h3 class="highlight-title">Complete Your Registration</h3>
      <p class="content-text">Please verify your email address by clicking the button below to complete your registration:</p>
    </div>
    
    <div class="cta-section">
      <a href="${verificationLink}" class="cta-button">Verify My Email</a>
    </div>
    
    <div class="highlight-box">
      <p class="content-text">If you did not create an account with us, please ignore this email and no further action is required.</p>
    </div>
  `
    ),

  // Account notification template
  accountNotification: (message) =>
    wrapEmail(
      'Account Notification',
      `
    <div class="greeting">Account Notification 📢</div>
    <div class="highlight-box info">
      <p class="content-text">${message}</p>
    </div>
  `
    ),

  // Career recommendation template
  careerRecommendation: (data) =>
    wrapEmail(
      'Your Career Recommendations',
      `
    <div class="greeting">Hello ${data.name}! 🎯</div>
    <p class="content-text">Great news! Based on your KCSE results, we've generated personalized career recommendations that align with your academic strengths and interests.</p>
    
    <div class="highlight-box success">
      <h3 class="highlight-title">🌟 Top Career Matches</h3>
      <div style="space-y: 15px;">
        ${data.careers
          .map(
            (career, index) => `
          <div style="background-color: white; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <h4 style="color: #1e293b; margin: 0; font-size: 18px; font-weight: 600;">${
                index + 1
              }. ${career.title}</h4>
              <span style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                ${career.match}% Match
              </span>
            </div>
            <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">
              ${career.description.substring(0, 120)}...
            </p>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
    
    <div class="cta-section">
      <a href="${
        process.env.CLIENT_URL || 'http://localhost:3000'
      }/recommendations" class="cta-button">View Detailed Analysis</a>
    </div>
  `
    ),

  // Account locked template
  accountLocked: (unlockTime) =>
    wrapEmail(
      'Account Temporarily Locked',
      `
    <div class="greeting">Account Security Alert 🔒</div>
    
    <div class="highlight-box warning">
      <h3 class="highlight-title">Account Locked</h3>
      <p class="content-text">Your account has been temporarily locked due to multiple failed login attempts.</p>
      <p class="content-text">You can try logging in again after <strong>${unlockTime}</strong>, or reset your password using the button below.</p>
    </div>
    
    <div class="cta-section">
      <a href="${
        process.env.CLIENT_URL || 'http://localhost:3000'
      }/forgot-password" class="cta-button">Reset Password Now</a>
    </div>
    
    <div class="highlight-box warning">
      <h3 class="highlight-title">⚠️ Security Notice</h3>
      <p class="content-text">If you didn't attempt to log in, please reset your password immediately as someone may be trying to access your account.</p>
    </div>
  `
    ),

  // Security alert template
  securityAlert: (data) =>
    wrapEmail(
      'Security Alert',
      `
    <div class="greeting">Security Alert 🚨</div>
    
    <div class="highlight-box warning">
      <h3 class="highlight-title">Suspicious Activity Detected</h3>
      <p class="content-text">We detected security-related activity on your account that requires your attention:</p>
      <div style="background-color: white; border-radius: 8px; padding: 15px; margin: 15px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #374151; font-weight: 600; width: 80px;">Activity:</td>
            <td style="padding: 8px 0; color: #991b1b; font-weight: 500;">${
              data.activity
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #374151; font-weight: 600;">Time:</td>
            <td style="padding: 8px 0; color: #6b7280;">${data.time}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #374151; font-weight: 600;">Location:</td>
            <td style="padding: 8px 0; color: #6b7280;">${data.location}</td>
          </tr>
        </table>
      </div>
    </div>
    
    <div class="highlight-box info">
      <p class="content-text"><strong>Was this you?</strong> If you recognize this activity, you can safely ignore this message.</p>
      <p class="content-text"><strong>Don't recognize this?</strong> Please secure your account immediately by changing your password.</p>
    </div>
    
    <div class="cta-section">
      <a href="${
        process.env.CLIENT_URL || 'http://localhost:3000'
      }/reset-password" class="cta-button">Secure My Account</a>
    </div>
  `
    ),

  // Admin invitation template
  adminInvitation: (data) =>
    wrapEmail(
      'Admin Invitation',
      `
    <div class="greeting">Hello ${data.name}! 👑</div>
    <p class="content-text"><strong style="color: #0080ff;">${data.inviterName}</strong> has invited you to join the Career Recommender System as an administrator.</p>
    
    <div class="highlight-box info">
      <h3 class="highlight-title">🔑 Admin Privileges Include:</h3>
      <ul class="feature-list">
        <li>User account management and oversight</li>
        <li>Career database administration</li>
        <li>Institution and program management</li>
        <li>System settings and configuration</li>
        <li>Analytics and reporting access</li>
      </ul>
    </div>
    
    <div class="cta-section">
      <a href="${data.invitationURL}" class="cta-button">Accept Admin Invitation</a>
    </div>
    
    <div class="highlight-box warning">
      <h3 class="highlight-title">⏰ Important Notes:</h3>
      <ul class="feature-list">
        <li>This invitation link will expire in <strong>7 days</strong></li>
        <li>If you didn't expect this invitation, please ignore this email</li>
        <li>Contact support if you believe this was sent in error</li>
      </ul>
    </div>
  `
    ),
};

// Send email via Mailjet
const sendMailjetEmail = async (to, subject, htmlContent) => {
  const mailjetClient = getMailjetClient();

  if (!mailjetClient) {
    throw new Error('Mailjet credentials not configured');
  }

  const request = mailjetClient.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: MAILJET_FROM_EMAIL,
          Name: MAILJET_FROM_NAME,
        },
        To: [
          {
            Email: to,
          },
        ],
        Subject: subject,
        HTMLPart: htmlContent,
      },
    ],
  });

  try {
    const result = await request;
    console.log('Email sent successfully via Mailjet');
    return result;
  } catch (err) {
    console.error('Failed to send email via Mailjet', err);
    throw new Error(`Failed to send email via Mailjet: ${err.message}`);
  }
};

// Send email via Nodemailer
const sendNodemailerEmail = async (to, subject, htmlContent) => {
  const transport = await createNodemailerTransport();

  try {
    // Build a simple text alternative to improve spam rating
    const textContent = htmlContent
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const unsubscribeUrl = `${
      process.env.CLIENT_URL || 'http://localhost:3000'
    }/unsubscribe`;

    const result = await transport.sendMail({
      from: `"${MAILJET_FROM_NAME}" <${NODEMAILER_EMAIL}>`,
      to,
      subject,
      html: htmlContent,
      text: textContent,
      envelope: {
        from: NODEMAILER_EMAIL,
        to,
      },
      headers: {
        'X-Mailer': 'Career-Recommender (Nodemailer)',
        'X-Entity-Ref-ID': Date.now().toString(),
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
      },
      messageId: `${Date.now()}@${(
        process.env.DKIM_DOMAIN_NAME ||
        NODEMAILER_HOST ||
        'localhost'
      ).toString()}`,
    });
    console.log('Email sent successfully via Nodemailer');
    return result;
  } catch (err) {
    console.error('Failed to send email via Nodemailer', err);
    throw new Error(`Failed to send email via Nodemailer: ${err.message}`);
  }
};

// Main email sending function with fallback
export const sendEmail = async (options) => {
  const { email, subject, template, templateData } = options;

  // If template is provided, use it
  if (template) {
    // Get the template function
    const templateFn = emailTemplates[template];

    if (!templateFn) {
      throw new Error(`Email template "${template}" not found`);
    }

    // Generate the HTML content
    const htmlContent = templateFn(templateData);

    // New order: Nodemailer first (with multi-strategy), then Mailjet as fallback
    try {
      console.log('[Email] Sending via Nodemailer...');
      return await sendNodemailerEmail(email, subject, htmlContent);
    } catch (nodemailerError) {
      console.error(
        '[Email] Nodemailer failed, falling back to Mailjet:',
        nodemailerError.message
      );
      if (MAILJET_API_KEY && MAILJET_SECRET_KEY) {
        try {
          console.log('[Email] Sending via Mailjet...');
          return await sendMailjetEmail(email, subject, htmlContent);
        } catch (mailjetError) {
          console.error('[Email] Mailjet also failed:', mailjetError.message);
          throw new Error('Failed to send email through all available methods');
        }
      }
      throw new Error('Mailjet not configured; cannot fallback');
    }
  } else {
    // For backward compatibility with the original implementation
    // that just takes a message
    const htmlContent = wrapEmail(
      'Notification',
      `
      <div class="highlight-box info">
        <p class="content-text">${options.message}</p>
      </div>
    `
    );

    try {
      console.log('[Email] Sending (no template) via Nodemailer...');
      return await sendNodemailerEmail(email, subject, htmlContent);
    } catch (nodemailerError) {
      console.error(
        '[Email] Nodemailer failed (no template), falling back to Mailjet:',
        nodemailerError.message
      );
      if (MAILJET_API_KEY && MAILJET_SECRET_KEY) {
        try {
          console.log('[Email] Sending (no template) via Mailjet...');
          return await sendMailjetEmail(email, subject, htmlContent);
        } catch (mailjetError) {
          console.error(
            '[Email] Mailjet also failed (no template):',
            mailjetError.message
          );
          throw new Error('Failed to send email');
        }
      }
      throw new Error('Mailjet not configured; cannot fallback');
    }
  }
};

// Specific email sending functions
export const sendWelcomeEmail = async (email, name) => {
  return sendEmail({
    email,
    subject:
      "Welcome to Career Recommender - Let's Find Your Perfect Career! 🎉",
    template: 'welcome',
    templateData: name,
  });
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  return sendEmail({
    email,
    subject: 'Reset Your Career Recommender Password 🔐',
    template: 'resetPassword',
    templateData: resetLink,
  });
};

export const sendVerificationEmail = async (email, verificationLink) => {
  return sendEmail({
    email,
    subject:
      'Verify Your Email - Complete Your Career Recommender Registration ✉️',
    template: 'verifyEmail',
    templateData: verificationLink,
  });
};

export const sendAccountNotification = async (email, message) => {
  return sendEmail({
    email,
    subject: 'Career Recommender Account Notification 📢',
    template: 'accountNotification',
    templateData: message,
  });
};

export const sendRecommendationEmail = async (email, name, careers) => {
  return sendEmail({
    email,
    subject: 'Your Personalized Career Recommendations Are Ready! 🎯',
    template: 'careerRecommendation',
    templateData: { name, careers },
  });
};

export const sendAccountLockedEmail = async (email, unlockTime) => {
  return sendEmail({
    email,
    subject: 'Account Security Alert - Temporarily Locked 🔒',
    template: 'accountLocked',
    templateData: unlockTime,
  });
};

export const sendSecurityAlertEmail = async (
  email,
  activity,
  time,
  location
) => {
  return sendEmail({
    email,
    subject: 'Security Alert - Immediate Action Required 🚨',
    template: 'securityAlert',
    templateData: { activity, time, location },
  });
};

// Send admin invitation email
export const sendAdminInvitation = async (
  email,
  name,
  invitationURL,
  inviterName
) => {
  return sendEmail({
    email,
    subject: 'Admin Invitation - Join the Career Recommender Team 👑',
    template: 'adminInvitation',
    templateData: { name, invitationURL, inviterName },
  });
};

// Export the Nodemailer function for direct testing
export { sendNodemailerEmail };
