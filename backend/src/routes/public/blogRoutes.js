const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/public/blogController');

router.get('/', blogController.getAll);
router.get('/:slug', blogController.getBySlug);
router.post('/:slug/like', blogController.like);
router.post('/:slug/view', blogController.incrementView);

module.exports = router;
