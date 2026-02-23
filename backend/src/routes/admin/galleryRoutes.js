const express = require('express');
const router = express.Router();
const galleryController = require('../../controllers/admin/galleryController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/', galleryController.getAll);
router.post('/', galleryController.create);
router.get('/:id', galleryController.getOne);
router.put('/:id', galleryController.update);
router.delete('/:id', galleryController.delete);

module.exports = router;
