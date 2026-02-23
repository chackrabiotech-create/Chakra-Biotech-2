const CompanyDetails = require('../../models/CompanyDetails');

exports.get = async (req, res) => {
  try {
    let company = await CompanyDetails.findOne();
    if (!company) {
      company = await CompanyDetails.create({
        companyName: 'Chakra Bio',
        email: 'info@chakrabio.com',
        phone: '+91 1234567890',
        whatsappNumber: '+91 1234567890'
      });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    let company = await CompanyDetails.findOne();
    if (!company) {
      company = await CompanyDetails.create(req.body);
    } else {
      company = await CompanyDetails.findByIdAndUpdate(company._id, req.body, { new: true, runValidators: true });
    }
    res.json({ success: true, data: company, message: 'Company details updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
