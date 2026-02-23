const Training = require('../../models/Training');
const Enrollment = require('../../models/Enrollment');

// @desc    Get all trainings (for admin, includes inactive) with filters + pagination
// @route   GET /api/admin/trainings
// @access  Private
exports.getAll = async (req, res, next) => {
    try {
        const { category, mode, level, isPublished, search, page = 1, limit = 50 } = req.query;

        const filter = {};

        if (category) filter.category = category;
        if (mode) filter.mode = mode;
        if (level) filter.level = level;
        if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Training.countDocuments(filter);
        const trainings = await Training.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: trainings.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            data: trainings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get training stats
// @route   GET /api/admin/trainings/stats
// @access  Private
exports.getStats = async (req, res, next) => {
    try {
        const [totalTrainings, activeTrainings, totalEnrollments, pendingEnrollments] = await Promise.all([
            Training.countDocuments(),
            Training.countDocuments({ isActive: true }),
            Enrollment.countDocuments(),
            Enrollment.countDocuments({ status: 'pending' })
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalTrainings,
                activeTrainings,
                totalEnrollments,
                pendingEnrollments
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single training (for admin)
// @route   GET /api/admin/trainings/:id
// @access  Private
exports.getOne = async (req, res, next) => {
    try {
        const training = await Training.findById(req.params.id);

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
// @route   POST /api/admin/trainings
// @access  Private
exports.create = async (req, res, next) => {
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
// @route   PUT /api/admin/trainings/:id
// @access  Private
exports.update = async (req, res, next) => {
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
// @route   DELETE /api/admin/trainings/:id
// @access  Private
exports.delete = async (req, res, next) => {
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
