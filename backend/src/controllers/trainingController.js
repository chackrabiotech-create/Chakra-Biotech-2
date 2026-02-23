const Training = require('../models/Training');

// @desc    Get all trainings
// @route   GET /api/trainings
// @access  Public
exports.getTrainings = async (req, res, next) => {
    try {
        const trainings = await Training.find({ isActive: true }).sort({ price: 1 });

        res.status(200).json({
            success: true,
            count: trainings.length,
            data: trainings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single training
// @route   GET /api/trainings/:slug
// @access  Public
exports.getTraining = async (req, res, next) => {
    try {
        const training = await Training.findOne({ slug: req.params.slug });

        if (!training) {
            return res.status(404).json({
                success: false,
                error: 'Training program not found'
            });
        }

        res.status(200).json({
            success: true,
            data: training
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new training
// @route   POST /api/trainings
// @access  Private (Admin)
exports.createTraining = async (req, res, next) => {
    try {
        const training = await Training.create(req.body);

        res.status(201).json({
            success: true,
            data: training
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update training
// @route   PUT /api/trainings/:id
// @access  Private (Admin)
exports.updateTraining = async (req, res, next) => {
    try {
        let training = await Training.findById(req.params.id);

        if (!training) {
            return res.status(404).json({
                success: false,
                error: 'Training program not found'
            });
        }

        training = await Training.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: training
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete training
// @route   DELETE /api/trainings/:id
// @access  Private (Admin)
exports.deleteTraining = async (req, res, next) => {
    try {
        const training = await Training.findById(req.params.id);

        if (!training) {
            return res.status(404).json({
                success: false,
                error: 'Training program not found'
            });
        }

        await training.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
