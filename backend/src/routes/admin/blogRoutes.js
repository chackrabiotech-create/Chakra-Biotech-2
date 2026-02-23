const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/admin/blogController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/', blogController.getAll);
router.post('/', blogController.create);
router.get('/:id', blogController.getOne);
router.put('/:id', blogController.update);
router.delete('/:id', blogController.delete);
router.post('/:id/publish', blogController.togglePublish);

module.exports = router;
