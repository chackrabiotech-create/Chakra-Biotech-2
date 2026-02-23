const express = require('express');
const router = express.Router();
const ContactSubmission = require('../../models/ContactSubmission');

router.post('/', async (req, res) => {
  try {
    const contact = await ContactSubmission.create({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    res.status(201).json({
      success: true,
      data: contact,
      message: 'Thank you for contacting us. We\'ll get back to you soon!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
