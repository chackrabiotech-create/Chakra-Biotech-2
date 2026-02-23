const createCategoryController = (Model) => ({
  getAll: async (req, res) => {
    try {
      const categories = await Model.find().sort({ displayOrder: 1, createdAt: -1 });
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const category = await Model.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      // Ensure slug is generated from name if not provided
      const slugify = require('../../utils/slugify');
      const categoryData = { ...req.body };

      if (!categoryData.slug && categoryData.name) {
        categoryData.slug = slugify(categoryData.name);
      }

      const category = await Model.create(categoryData);
      res.status(201).json({ success: true, data: category, message: 'Category created successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      // Regenerate slug if name is being updated
      const slugify = require('../../utils/slugify');
      const updateData = { ...req.body };

      if (updateData.name) {
        updateData.slug = slugify(updateData.name);
      }

      const category = await Model.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, data: category, message: 'Category updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const category = await Model.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

module.exports = createCategoryController;
