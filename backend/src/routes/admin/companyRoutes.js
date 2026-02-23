const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/admin/companyController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/', companyController.get);
router.put('/', companyController.update);

module.exports = router;
