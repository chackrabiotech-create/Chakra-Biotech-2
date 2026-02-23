const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/admin/uploadController');
const { createUploadMiddleware } = require('../../middleware/upload');
const auth = require('../../middleware/auth');

router.use(auth);

router.post('/image', createUploadMiddleware('chakra-bio/uploads', 'image', false), uploadController.uploadImage);
router.post('/images', createUploadMiddleware('chakra-bio/uploads', 'images', true), uploadController.uploadImages);
router.delete('/image', uploadController.deleteImage);

module.exports = router;
