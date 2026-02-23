const Training = require('../../models/Training');

// @desc    Get all active & published trainings
// @route   GET /api/trainings
// @access  Public
exports.getAll = async (req, res, next) => {
    try {
        const { category, mode, level } = req.query;

        const filter = { isActive: true, isPublished: true };
        if (category) filter.category = category;
        if (mode) filter.mode = mode;
        if (level) filter.level = level;

        const trainings = await Training.find(filter).sort({ price: 1 });

        res.status(200).json({
            success: true,
            count: trainings.length,
            data: trainings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single training by ID
// @route   GET /api/trainings/id/:id
// @access  Public
exports.getById = async (req, res, next) => {
    try {
        const training = await Training.findOne({
            _id: req.params.id,
            isActive: true,
            isPublished: true
        });

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

// @desc    Get single training by slug
// @route   GET /api/trainings/:slug
// @access  Public
exports.getBySlug = async (req, res, next) => {
    try {
        const training = await Training.findOne({
            slug: req.params.slug,
            isActive: true,
            isPublished: true
        });

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
