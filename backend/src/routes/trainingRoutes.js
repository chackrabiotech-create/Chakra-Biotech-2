const express = require('express');
const {
    getTrainings,
    getTraining,
    createTraining,
    updateTraining,
    deleteTraining
} = require('../controllers/trainingController');

const router = express.Router();

// Define routes
router
    .route('/')
    .get(getTrainings)
    .post(createTraining);

router
    .route('/:slug')
    .get(getTraining);

router
    .route('/:id')
    .put(updateTraining)
    .delete(deleteTraining);

module.exports = router;
