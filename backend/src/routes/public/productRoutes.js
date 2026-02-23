const express = require('express');
const router = express.Router();
const productController = require('../../controllers/public/productController');

router.get('/', productController.getAll);
router.get('/:slug', productController.getBySlug);
router.post('/:slug/view', productController.incrementView);

module.exports = router;
