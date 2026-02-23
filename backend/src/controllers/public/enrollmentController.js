const Enrollment = require('../../models/Enrollment');
const Training = require('../../models/Training');

// @desc    Submit enrollment request
// @route   POST /api/enrollments
// @access  Public
exports.submit = async (req, res, next) => {
    try {
        const { studentName, email, phone, whatsappNumber, trainingId, notes } = req.body;

        // Validate required fields
        if (!studentName || !email || !phone || !trainingId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide studentName, email, phone, and trainingId'
            });
        }

        // Check training exists and is active
        const training = await Training.findOne({
            _id: trainingId,
            isActive: true,
            isPublished: true
        });

        if (!training) {
            return res.status(404).json({
                success: false,
                error: 'Training program not found or not available'
            });
        }

        // Check seat availability
        if (training.maxParticipants && training.currentEnrollments >= training.maxParticipants) {
            return res.status(400).json({
                success: false,
                error: 'This training program is fully booked'
            });
        }

        const enrollment = await Enrollment.create({
            studentName,
            email,
            phone,
            whatsappNumber: whatsappNumber || phone,
            trainingId,
            notes,
            source: 'website',
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Enrollment request submitted successfully. We will contact you soon.',
            data: {
                _id: enrollment._id,
                studentName: enrollment.studentName,
                trainingTitle: training.title,
                status: enrollment.status
            }
        });
    } catch (err) {
        next(err);
    }
};
