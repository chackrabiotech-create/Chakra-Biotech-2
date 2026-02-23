const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const auth = require('../../middleware/auth');

// All routes require authentication
router.use(auth);

// Admin profile management
router.get('/profile', adminController.getProfile);
router.put('/profile', adminController.updateProfile);
router.put('/change-password', adminController.changePassword);
router.put('/reset-password', adminController.resetPassword);

module.exports = router;
