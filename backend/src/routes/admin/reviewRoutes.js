const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/admin/reviewController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/', reviewController.getAll);
router.put('/:id/approve', reviewController.approve);
router.delete('/:id', reviewController.delete);

module.exports = router;
