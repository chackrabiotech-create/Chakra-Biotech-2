const ContactSubmission = require('../../models/ContactSubmission');
const { getPagination, getPaginationData } = require('../../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    const { skip, limit: limitNum } = getPagination(page, limit);

    const filter = {};
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const contacts = await ContactSubmission.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await ContactSubmission.countDocuments(filter);

    res.json({
      success: true,
      data: { contacts, pagination: getPaginationData(total, page, limitNum) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const contact = await ContactSubmission.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const contact = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' });
    }
    res.json({ success: true, data: contact, message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsReplied = async (req, res) => {
  try {
    const contact = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { isReplied: true, adminNotes: req.body.adminNotes },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' });
    }
    res.json({ success: true, data: contact, message: 'Marked as replied' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const contact = await ContactSubmission.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' });
    }
    res.json({ success: true, message: 'Contact submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
