const { sendEmail } = require('../utils/emailService');

/**
 * Test email endpoint - for debugging SMTP configuration
 */
const testEmail = async (req, res) => {
  try {
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      return res.status(400).json({
        success: false,
        message: 'SMTP credentials not configured',
        details: {
          SMTP_USER: process.env.SMTP_USER ? 'Set' : 'Missing',
          SMTP_PASSWORD: process.env.SMTP_PASSWORD ? 'Set' : 'Missing'
        }
      });
    }

    // Try to send a test email
    await sendEmail({
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: 'Test Email from GNS Software Backend',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify SMTP configuration.</p>
        <p>If you received this, your email setup is working correctly!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `,
      text: 'This is a test email to verify SMTP configuration. If you received this, your email setup is working correctly!'
    });

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully! Check your inbox.',
      config: {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASSWORD_LENGTH: process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.length : 0
      }
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      },
      troubleshooting: {
        hint: 'Check that:',
        checks: [
          'App Password was generated for the same email as SMTP_USER',
          '2-Step Verification is enabled on the Google account',
          'App Password is correct (16 characters, no spaces)',
          'SMTP_USER matches the email used to generate the App Password'
        ]
      }
    });
  }
};

module.exports = {
  testEmail
};
