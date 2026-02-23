const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/admin/contactController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/', contactController.getAll);
router.get('/:id', contactController.getOne);
router.put('/:id/read', contactController.markAsRead);
router.put('/:id/reply', contactController.markAsReplied);
router.delete('/:id', contactController.delete);

module.exports = router;
