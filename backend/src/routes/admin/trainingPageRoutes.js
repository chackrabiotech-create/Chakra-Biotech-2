const express = require('express');
const router = express.Router();
const trainingPageController = require('../../controllers/admin/trainingPageController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/', trainingPageController.get);
router.put('/', trainingPageController.update);

module.exports = router;
