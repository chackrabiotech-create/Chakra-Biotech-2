const express = require('express');
const router = express.Router();
const trainingController = require('../../controllers/public/trainingController');

router.get('/', trainingController.getAll);
router.get('/id/:id', trainingController.getById);
router.get('/:slug', trainingController.getBySlug);

module.exports = router;
