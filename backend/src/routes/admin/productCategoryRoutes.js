const express = require('express');
const router = express.Router();
const ProductCategory = require('../../models/ProductCategory');
const createCategoryController = require('../../controllers/admin/categoryController');
const auth = require('../../middleware/auth');

const controller = createCategoryController(ProductCategory);

router.use(auth);

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
