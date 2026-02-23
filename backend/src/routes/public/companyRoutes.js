const express = require('express');
const router = express.Router();
const CompanyDetails = require('../../models/CompanyDetails');

router.get('/', async (req, res) => {
  try {
    const company = await CompanyDetails.findOne();
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company details not found' });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
