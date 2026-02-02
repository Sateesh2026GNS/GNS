const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Validate SMTP configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP configuration is missing. Please set SMTP_USER and SMTP_PASSWORD in your .env file.');
  }

  // Check if using placeholder values
  if (process.env.SMTP_PASSWORD.includes('your-app-password') || 
      process.env.SMTP_PASSWORD.includes('your-app-password-here') ||
      process.env.SMTP_USER.includes('your-email')) {
    throw new Error('SMTP credentials are not configured. Please update your .env file with actual Gmail App Password. See README_EMAIL_SETUP.md for instructions.');
  }

  // Remove spaces from password (Gmail app passwords sometimes have spaces)
  const cleanPassword = process.env.SMTP_PASSWORD.replace(/\s+/g, '');
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // Your email address
      pass: cleanPassword // Your app password (not regular password)
    },
    tls: {
      rejectUnauthorized: false // For development, set to true in production with valid certificates
    }
  });
};

/**
 * Send email using SMTP
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 * @param {string} options.text - Plain text email body (optional)
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"GNS Software" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for plain text fallback
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Provide more helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error('SMTP authentication failed. Please check your email and app password in .env file.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Could not connect to SMTP server. Please check your SMTP_HOST and SMTP_PORT settings.');
    } else if (error.message) {
      throw error; // Re-throw with the original message
    } else {
      throw new Error(`Email sending failed: ${error.message || 'Unknown error'}`);
    }
  }
};

/**
 * Send contact form submission email
 * @param {Object} formData - Contact form data
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendContactFormEmail = async (formData) => {
  const { name, email, organization, phone, inquiryType, message } = formData;
  
  const recipientEmail = process.env.CONTACT_EMAIL || 'info@gnssoftware.in';
  
  const subject = `New Contact Form Submission - ${inquiryType || 'General Inquiry'}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1f2937; }
        .value { color: #4b5563; margin-top: 5px; }
        .footer { background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          ${organization ? `
          <div class="field">
            <div class="label">Organization:</div>
            <div class="value">${organization}</div>
          </div>
          ` : ''}
          ${phone ? `
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value"><a href="tel:${phone}">${phone}</a></div>
          </div>
          ` : ''}
          ${inquiryType ? `
          <div class="field">
            <div class="label">Inquiry Type:</div>
            <div class="value">${inquiryType}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the GNS Software contact form.</p>
          <p>Submitted on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${organization ? `Organization: ${organization}\n` : ''}${phone ? `Phone: ${phone}\n` : ''}${inquiryType ? `Inquiry Type: ${inquiryType}\n` : ''}
Message:
${message}

Submitted on: ${new Date().toLocaleString()}
  `;

  return await sendEmail({
    to: recipientEmail,
    subject: subject,
    html: html,
    text: text
  });
};

module.exports = {
  sendEmail,
  sendContactFormEmail
};
