const express = require('express');
const router = express.Router();
const enrollmentController = require('../../controllers/admin/enrollmentController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/', enrollmentController.getAll);
router.get('/download', enrollmentController.downloadCSV);
router.get('/students', enrollmentController.getAllStudents);
router.get('/:id', enrollmentController.getOne);
router.post('/', enrollmentController.create);
router.put('/:id', enrollmentController.update);
router.put('/:id/approve', enrollmentController.approve);
router.put('/:id/reject', enrollmentController.reject);
router.put('/:id/complete', enrollmentController.complete);
router.delete('/:id', enrollmentController.delete);

module.exports = router;
