const TrainingPageSettings = require('../../models/TrainingPageSettings');

// @desc    Get training page settings
// @route   GET /api/admin/training-page
// @access  Private
exports.get = async (req, res, next) => {
    try {
        let settings = await TrainingPageSettings.findOne();

        if (!settings) {
            // Create default settings if none exist
            settings = await TrainingPageSettings.create({
                hero: {
                    title: 'Master the Art of Saffron',
                    subtitle: 'From cultivation to quality testing, become an expert in the world\'s most precious spice with our comprehensive training programs.',
                    badge: 'Saffron Training Academy',
                    backgroundImage: '/saffron-field.jpg',
                    stats: [
                        { value: '500+', label: 'Students Trained' },
                        { value: '50+', label: 'Workshops Conducted' },
                        { value: '15+', label: 'Expert Instructors' },
                        { value: '98%', label: 'Success Rate' }
                    ]
                },
                featuredCourse: {
                    isVisible: true,
                    badge: 'Featured Course',
                    title: '3-Day Saffron Cultivation Course',
                    subtitle: 'Crack the code to successfully cultivating the world\'s most precious spice at the Institute of Horticulture Technology',
                    gains: [
                        'Learn modern methods and techniques for protected farming',
                        'Understand the best growing mediums and how to prepare them',
                        'Study precise nutrient and water management systems tailored for saffron',
                        'Master best practices for saffron growth and strategies for disease prevention',
                        'Gain valuable tips on efficient harvesting and processing for maximum quality and profit'
                    ],
                    benefits: [
                        { title: 'In-Campus Stay', description: 'Convenient access to classrooms, labs, and library. Save commute time and foster a deeper campus experience with full immersion in learning.', icon: 'Home' },
                        { title: 'Practical Training', description: 'Hands-on sessions demonstrating setup and maintenance of cultivation systems, nutrient solutions, and comprehensive plant care techniques.', icon: 'BookOpen' },
                        { title: 'Certification', description: 'Receive recognized credentials upon completion to validate your expertise and enhance your professional credibility in saffron cultivation.', icon: 'Trophy' }
                    ]
                },
                standout: {
                    isVisible: true,
                    title: 'Why This Course Stands Out',
                    description: 'Discover the science and success behind saffron cultivation through a program backed by our breakthrough achievement of successfully cultivating saffron at our state-of-the-art center near Shimla.',
                    additionalText: 'This course offers practical insights rooted in real-world results. You\'ll gain proven techniques, a deeper understanding of saffron\'s lifecycle, and explore its potential for commercial farming.',
                    highlights: [
                        { title: 'Aspiring Entrepreneurs', description: 'Eye the lucrative saffron market with confidence', icon: 'Users' },
                        { title: 'Traditional Farmers', description: 'Expand and adopt modern cultivation methods', icon: 'Sprout' },
                        { title: 'Students & Researchers', description: 'Passionate about innovative agriculture', icon: 'GraduationCap' }
                    ]
                },
                modules: [
                    { title: 'Protected Farming Methods', description: 'Learn modern techniques for controlled environment agriculture', icon: 'Home', topics: ['Greenhouse setup', 'Climate control', 'Light management', 'Ventilation systems'] },
                    { title: 'Growing Medium Preparation', description: 'Master the art of preparing optimal soil conditions', icon: 'Leaf', topics: ['Soil composition', 'pH management', 'Organic amendments', 'Drainage systems'] },
                    { title: 'Nutrient & Water Management', description: 'Precise systems tailored specifically for saffron', icon: 'Droplets', topics: ['Fertilization schedules', 'Irrigation techniques', 'Water quality', 'Nutrient monitoring'] },
                    { title: 'Disease Prevention', description: 'Strategies to protect your saffron crop', icon: 'Bug', topics: ['Common diseases', 'Pest control', 'Organic solutions', 'Preventive measures'] },
                    { title: 'Harvesting & Processing', description: 'Maximize quality and profit with efficient techniques', icon: 'Scissors', topics: ['Optimal harvest timing', 'Stigma separation', 'Drying methods', 'Quality preservation'] },
                    { title: 'Commercial Farming', description: 'Turn your knowledge into a profitable venture', icon: 'TrendingUp', topics: ['Market analysis', 'Pricing strategies', 'Scaling operations', 'Export opportunities'] }
                ],
                testimonials: [
                    { name: 'Rajesh Kumar', role: 'Saffron Farmer, Kashmir', rating: 5, text: 'The training program transformed my farming approach. I\'ve increased my yield by 40% and the quality has improved significantly.' },
                    { name: 'Priya Sharma', role: 'Agricultural Entrepreneur', rating: 5, text: 'As someone new to saffron cultivation, this course gave me the confidence to start my own farm. The instructors are knowledgeable.' },
                    { name: 'Dr. Amit Patel', role: 'Horticulture Researcher', rating: 5, text: 'The scientific approach and modern techniques taught here are cutting-edge. This is the most comprehensive saffron cultivation program.' }
                ],
                impactStats: [
                    { value: '95%', label: 'Student Success Rate', icon: 'Target' },
                    { value: '40%', label: 'Average Yield Increase', icon: 'TrendingUp' },
                    { value: '500+', label: 'Farmers Trained', icon: 'Users' },
                    { value: '15+', label: 'Years of Expertise', icon: 'Award' }
                ],
                cta: {
                    isVisible: true,
                    title: 'Corporate & Group Training',
                    description: 'Customized training programs for businesses, agricultural cooperatives, and educational institutions. Contact us for group discounts.',
                    buttonText: 'Contact for Group Training'
                },
                sections: [],
                selectedTemplate: 'classic'
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

// @desc    Update training page settings
// @route   PUT /api/admin/training-page
// @access  Private
exports.update = async (req, res, next) => {
    try {
        let settings = await TrainingPageSettings.findOne();

        if (!settings) {
            settings = await TrainingPageSettings.create(req.body);
        } else {
            settings = await TrainingPageSettings.findByIdAndUpdate(
                settings._id,
                req.body,
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({
            success: true,
            data: settings,
            message: 'Training page settings updated successfully'
        });
    } catch (err) {
        next(err);
    }
};
