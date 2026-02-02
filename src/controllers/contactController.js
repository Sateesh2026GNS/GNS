const { sendContactFormEmail } = require('../utils/emailService');

/**
 * Handle contact form submission
 */
const submitContactForm = async (req, res) => {
  try {
    const { name, email, organization, phone, inquiryType, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Prepare form data
    const formData = {
      name: name.trim(),
      email: email.trim(),
      organization: organization ? organization.trim() : '',
      phone: phone ? phone.trim() : '',
      inquiryType: inquiryType ? inquiryType.trim() : '',
      message: message.trim()
    };

    // Send email
    await sendContactFormEmail(formData);

    res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });
  } catch (error) {
    console.error('Error in contact form submission:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    // Provide more specific error messages in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || 'Failed to send email. Please check SMTP configuration.'
      : 'Failed to send email. Please try again later or contact us directly.';
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        hint: error.message.includes('SMTP') ? 'Check your .env file SMTP configuration. See README_EMAIL_SETUP.md for setup instructions.' : undefined
      } : undefined
    });
  }
};

module.exports = {
  submitContactForm
};
