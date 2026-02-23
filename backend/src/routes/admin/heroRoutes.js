const express = require('express');
const router = express.Router();
const heroController = require('../../controllers/admin/heroController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/', heroController.getAll);
router.post('/', heroController.create);
router.get('/:id', heroController.getOne);
router.put('/:id', heroController.update);
router.delete('/:id', heroController.delete);
router.put('/:id/toggle', heroController.toggleActive);

module.exports = router;
