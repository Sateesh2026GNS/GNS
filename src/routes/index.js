const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');
const { testEmail } = require('../controllers/testEmailController');

// Contact form route
router.post('/contact', submitContactForm);

// Test email route (for debugging)
router.post('/test-email', testEmail);

// API Routes
router.get('/', (req, res) => {
  res.json({ message: 'API Routes' });
});

module.exports = router;

