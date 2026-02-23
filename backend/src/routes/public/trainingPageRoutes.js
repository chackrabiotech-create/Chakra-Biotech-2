const express = require('express');
const router = express.Router();
const trainingPageController = require('../../controllers/public/trainingPageController');

router.get('/', trainingPageController.get);

module.exports = router;
