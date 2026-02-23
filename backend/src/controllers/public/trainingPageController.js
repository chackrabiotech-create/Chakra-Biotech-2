const TrainingPageSettings = require('../../models/TrainingPageSettings');

// @desc    Get training page settings (public)
// @route   GET /api/training-page
// @access  Public
exports.get = async (req, res, next) => {
    try {
        const settings = await TrainingPageSettings.findOne();

        if (!settings) {
            return res.status(200).json({
                success: true,
                data: null
            });
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (err) {
        next(err);
    }
};
