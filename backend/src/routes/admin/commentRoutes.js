const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/admin/commentController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/', commentController.getAll);
router.put('/:id/approve', commentController.approve);
router.delete('/:id', commentController.delete);

module.exports = router;
