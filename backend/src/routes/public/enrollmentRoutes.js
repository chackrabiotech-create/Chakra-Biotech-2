const express = require('express');
const router = express.Router();
const enrollmentController = require('../../controllers/public/enrollmentController');

router.post('/', enrollmentController.submit);

module.exports = router;
