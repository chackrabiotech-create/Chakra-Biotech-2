const express = require('express');
const router = express.Router();
const trainingController = require('../../controllers/admin/trainingController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/stats', trainingController.getStats);
router.get('/', trainingController.getAll);
router.post('/', trainingController.create);
router.get('/:id', trainingController.getOne);
router.put('/:id', trainingController.update);
router.delete('/:id', trainingController.delete);

module.exports = router;
