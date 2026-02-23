"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/DashboardLayout";
import Modal from "../../components/Modal";
import ImageUpload from "../../components/ImageUpload";
import { Plus, Edit, Trash2, Search, Package, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { productCategoriesApi, Category } from "@/lib/api";

const ProductCategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await productCategoriesApi.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to load categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCategory) {
        await productCategoriesApi.update(editingCategory._id, formData);
        toast.success("Category updated successfully!");
      } else {
        await productCategoriesApi.create(formData);
        toast.success("Category created successfully!");
      }

      setShowForm(false);
      setEditingCategory(null);
      resetForm();
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      isActive: true,
      displayOrder: 0,
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      isActive: category.isActive,
      displayOrder: category.displayOrder || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await productCategoriesApi.delete(id);
      toast.success("Category deleted successfully!");
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Product Categories">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Product Categories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-admin-800">
              Manage Categories
            </h2>
            <p className="text-admin-600">
              Organize your products into categories
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Total Categories</p>
                <p className="text-2xl font-bold text-admin-800">
                  {categories.length}
                </p>
              </div>
              <Tag className="w-8 h-8 text-saffron-500" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Active Categories</p>
                <p className="text-2xl font-bold text-green-600">
                  {categories.filter((c) => c.isActive).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Inactive Categories</p>
                <p className="text-2xl font-bold text-red-600">
                  {categories.filter((c) => !c.isActive).length}
                </p>
              </div>
              <Tag className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-saffron-100 to-saffron-200 relative">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      category.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-admin-800">
                    {category.name}
                  </h3>
                  <span className="text-sm text-admin-500">
                    #{category.displayOrder || 0}
                  </span>
                </div>

                <p className="text-admin-600 text-sm mb-3 line-clamp-2">
                  {category.description || "No description"}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-admin-400">
                    /{category.slug}
                  </span>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-admin-300 mx-auto mb-4" />
            <p className="text-admin-500">No categories found</p>
          </div>
        )}

        {/* Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
            resetForm();
          }}
          title={editingCategory ? "Edit Category" : "Add New Category"}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-field"
                  placeholder="Category description"
                />
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(value) =>
                  setFormData({ ...formData, image: value as string })
                }
                label="Category Image"
                multiple={false}
              />

              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: parseInt(e.target.value),
                    })
                  }
                  className="input-field"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-saffron-600 border-gray-300 rounded focus:ring-saffron-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-admin-700"
                >
                  Active Category
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-admin-200">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                  resetForm();
                }}
                className="px-6 py-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : editingCategory
                  ? "Update"
                  : "Create"}{" "}
                Category
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ProductCategoriesManagement;
