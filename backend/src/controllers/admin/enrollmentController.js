const Enrollment = require('../../models/Enrollment');
const Training = require('../../models/Training');

// @desc    Get all enrollments with filters + pagination
// @route   GET /api/admin/enrollments
// @access  Private
exports.getAll = async (req, res, next) => {
    try {
        const { status, trainingId, source, search, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (trainingId) filter.trainingId = trainingId;
        if (source) filter.source = source;
        if (search) {
            filter.$or = [
                { studentName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Enrollment.countDocuments(filter);
        const enrollments = await Enrollment.find(filter)
            .populate('trainingId', 'title slug')
            .populate('enrolledBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get counts by status
        const [totalCount, pendingCount, approvedCount, completedCount] = await Promise.all([
            Enrollment.countDocuments(),
            Enrollment.countDocuments({ status: 'pending' }),
            Enrollment.countDocuments({ status: 'approved' }),
            Enrollment.countDocuments({ status: 'completed' })
        ]);

        res.status(200).json({
            success: true,
            count: enrollments.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            stats: {
                total: totalCount,
                pending: pendingCount,
                approved: approvedCount,
                completed: completedCount
            },
            data: enrollments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single enrollment
// @route   GET /api/admin/enrollments/:id
// @access  Private
exports.getOne = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id)
            .populate('trainingId', 'title slug price duration')
            .populate('enrolledBy', 'name email');

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Enrollment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create enrollment (manual by admin)
// @route   POST /api/admin/enrollments
// @access  Private
exports.create = async (req, res, next) => {
    try {
        const { trainingId } = req.body;

        // Validate training exists
        const training = await Training.findById(trainingId);
        if (!training) {
            return res.status(404).json({
                success: false,
                error: 'Training program not found'
            });
        }

        // Check capacity
        if (training.maxParticipants && training.currentEnrollments >= training.maxParticipants) {
            return res.status(400).json({
                success: false,
                error: 'Training program is full'
            });
        }

        const enrollment = await Enrollment.create({
            ...req.body,
            enrolledBy: req.admin.id
        });

        const populated = await Enrollment.findById(enrollment._id)
            .populate('trainingId', 'title slug')
            .populate('enrolledBy', 'name email');

        res.status(201).json({
            success: true,
            data: populated
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update enrollment
// @route   PUT /api/admin/enrollments/:id
// @access  Private
exports.update = async (req, res, next) => {
    try {
        let enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Enrollment not found'
            });
        }

        enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('trainingId', 'title slug')
            .populate('enrolledBy', 'name email');

        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Approve enrollment
// @route   PUT /api/admin/enrollments/:id/approve
// @access  Private
exports.approve = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Enrollment not found'
            });
        }

        if (enrollment.status === 'approved') {
            return res.status(400).json({
                success: false,
                error: 'Enrollment is already approved'
            });
        }

        const wasPending = enrollment.status === 'pending' || enrollment.status === 'rejected';

        enrollment.status = 'approved';
        enrollment.approvedAt = new Date();
        if (req.body.adminNotes) enrollment.adminNotes = req.body.adminNotes;
        await enrollment.save();

        // Increment currentEnrollments on training
        if (wasPending) {
            await Training.findByIdAndUpdate(enrollment.trainingId, {
                $inc: { currentEnrollments: 1 }
            });
        }

        const populated = await Enrollment.findById(enrollment._id)
            .populate('trainingId', 'title slug')
            .populate('enrolledBy', 'name email');

        res.status(200).json({
            success: true,
            data: populated
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Reject enrollment
// @route   PUT /api/admin/enrollments/:id/reject
// @access  Private
exports.reject = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Enrollment not found'
            });
        }

        const wasApproved = enrollment.status === 'approved';

        enrollment.status = 'rejected';
        if (req.body.adminNotes) enrollment.adminNotes = req.body.adminNotes;
        await enrollment.save();

        // Decrement if was approved
        if (wasApproved) {
            await Training.findByIdAndUpdate(enrollment.trainingId, {
                $inc: { currentEnrollments: -1 }
            });
        }

        const populated = await Enrollment.findById(enrollment._id)
            .populate('trainingId', 'title slug')
            .populate('enrolledBy', 'name email');

        res.status(200).json({
            success: true,
            data: populated
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Complete enrollment
// @route   PUT /api/admin/enrollments/:id/complete
// @access  Private
exports.complete = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Enrollment not found'
            });
        }

        enrollment.status = 'completed';
        enrollment.completedAt = new Date();
        if (req.body.adminNotes) enrollment.adminNotes = req.body.adminNotes;
        await enrollment.save();

        const populated = await Enrollment.findById(enrollment._id)
            .populate('trainingId', 'title slug')
            .populate('enrolledBy', 'name email');

        res.status(200).json({
            success: true,
            data: populated
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete enrollment
// @route   DELETE /api/admin/enrollments/:id
// @access  Private
exports.delete = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Enrollment not found'
            });
        }

        // Decrement if was approved
        if (enrollment.status === 'approved') {
            await Training.findByIdAndUpdate(enrollment.trainingId, {
                $inc: { currentEnrollments: -1 }
            });
        }

        await enrollment.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Download enrollments as CSV
// @route   GET /api/admin/enrollments/download
// @access  Private
exports.downloadCSV = async (req, res, next) => {
    try {
        const { status, trainingId, source, search } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (trainingId) filter.trainingId = trainingId;
        if (source) filter.source = source;
        if (search) {
            filter.$or = [
                { studentName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const enrollments = await Enrollment.find(filter)
            .populate('trainingId', 'title')
            .populate('enrolledBy', 'name')
            .sort({ createdAt: -1 });

        const headers = ['Student Name', 'Email', 'Phone', 'WhatsApp', 'Training', 'Status', 'Source', 'Notes', 'Admin Notes', 'Enrolled By', 'Created At', 'Approved At', 'Completed At'];

        const escapeCSV = (val) => {
            if (val === null || val === undefined) return '';
            const str = String(val);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const rows = enrollments.map(e => [
            escapeCSV(e.studentName),
            escapeCSV(e.email),
            escapeCSV(e.phone),
            escapeCSV(e.whatsappNumber),
            escapeCSV(e.trainingId?.title || ''),
            escapeCSV(e.status),
            escapeCSV(e.source),
            escapeCSV(e.notes),
            escapeCSV(e.adminNotes),
            escapeCSV(e.enrolledBy?.name || ''),
            escapeCSV(e.createdAt ? new Date(e.createdAt).toLocaleDateString() : ''),
            escapeCSV(e.approvedAt ? new Date(e.approvedAt).toLocaleDateString() : ''),
            escapeCSV(e.completedAt ? new Date(e.completedAt).toLocaleDateString() : '')
        ].join(','));

        const csv = [headers.join(','), ...rows].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=enrollments-${Date.now()}.csv`);
        res.status(200).send(csv);
    } catch (err) {
        next(err);
    }
};

// @desc    Get all students (aggregated by email)
// @route   GET /api/admin/enrollments/students
// @access  Private
exports.getAllStudents = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;

        const matchStage = {};
        if (search) {
            matchStage.$or = [
                { studentName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const pipeline = [
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
            {
                $group: {
                    _id: '$email',
                    studentName: { $first: '$studentName' },
                    email: { $first: '$email' },
                    phone: { $first: '$phone' },
                    whatsappNumber: { $first: '$whatsappNumber' },
                    totalEnrollments: { $sum: 1 },
                    approved: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                    },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    lastEnrolled: { $max: '$createdAt' },
                    enrollments: {
                        $push: {
                            _id: '$_id',
                            trainingId: '$trainingId',
                            status: '$status',
                            source: '$source',
                            createdAt: '$createdAt'
                        }
                    }
                }
            },
            { $sort: { lastEnrolled: -1 } }
        ];

        // Get total count
        const countPipeline = [...pipeline, { $count: 'total' }];
        const countResult = await Enrollment.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        // Paginate
        const skip = (parseInt(page) - 1) * parseInt(limit);
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: parseInt(limit) });

        const students = await Enrollment.aggregate(pipeline);

        // Populate training titles in enrollments
        await Enrollment.populate(students, {
            path: 'enrollments.trainingId',
            select: 'title slug',
            model: 'Training'
        });

        res.status(200).json({
            success: true,
            count: students.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            data: students
        });
    } catch (err) {
        next(err);
    }
};
