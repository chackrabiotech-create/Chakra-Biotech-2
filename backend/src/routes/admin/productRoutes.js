const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/', productController.getAll);
router.post('/', productController.create);
router.get('/:id', productController.getOne);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);
router.post('/:id/publish', productController.togglePublish);
router.put('/:id/featured', productController.toggleFeatured);

module.exports = router;
