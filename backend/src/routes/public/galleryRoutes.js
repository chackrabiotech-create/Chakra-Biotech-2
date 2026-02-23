const express = require('express');
const router = express.Router();
const galleryController = require('../../controllers/public/galleryController');

router.get('/', galleryController.getAll);
router.get('/:id', galleryController.getOne);
router.post('/:id/like', galleryController.like);
router.post('/:id/view', galleryController.incrementView);

module.exports = router;
