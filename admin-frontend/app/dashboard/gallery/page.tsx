"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/DashboardLayout";
import Modal from "../../components/Modal";
import ImageUpload from "../../components/ImageUpload";
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { galleryApi, galleryCategoriesApi } from "@/lib/api";

interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  image: string;
  thumbnail?: string;
  category: string | { _id: string; name: string };
  tags?: string[];
  location?: string;
  date?: string;
  photographer?: string;
  views: number;
  likes: number;
  isPublished: boolean;
  displayOrder: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const GalleryManagement = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    tags: [] as string[],
    location: "",
    date: "",
    photographer: "",
    isPublished: true,
    displayOrder: 0,
  });

  useEffect(() => {
    loadImages();
    loadCategories();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await galleryApi.getAll({});
      setImages(response.data.images || []);
    } catch (error) {
      toast.error("Failed to load gallery images");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await galleryCategoriesApi.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingImage) {
        await galleryApi.update(editingImage._id, formData);
        toast.success("Image updated successfully!");
      } else {
        await galleryApi.create(formData);
        toast.success("Image uploaded successfully!");
      }

      setShowForm(false);
      setEditingImage(null);
      resetForm();
      loadImages();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      category: "",
      tags: [],
      location: "",
      date: "",
      photographer: "",
      isPublished: true,
      displayOrder: 0,
    });
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      image: image.image,
      category:
        typeof image.category === "string"
          ? image.category
          : image.category._id,
      tags: image.tags || [],
      location: image.location || "",
      date: image.date || "",
      photographer: image.photographer || "",
      isPublished: image.isPublished,
      displayOrder: image.displayOrder,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await galleryApi.delete(id);
      toast.success("Image deleted successfully!");
      loadImages();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete image");
    }
  };

  const filteredImages = images.filter((image) => {
    if (selectedCategory === "All") return true;
    const categoryId =
      typeof image.category === "string" ? image.category : image.category._id;
    return categoryId === selectedCategory;
  });

  if (loading) {
    return (
      <DashboardLayout title="Gallery Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gallery Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-admin-800">
              Gallery Images
            </h2>
            <p className="text-admin-600">Manage your gallery images</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Filter */}
        <div className="card p-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card overflow-hidden group"
            >
              <div className="relative aspect-square">
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(image)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                {!image.isPublished && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    Unpublished
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-admin-800 truncate">
                  {image.title}
                </h3>
                <p className="text-sm text-admin-600 truncate">
                  {typeof image.category === "object"
                    ? image.category.name
                    : ""}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-admin-300 mx-auto mb-4" />
            <p className="text-admin-500">No images found</p>
          </div>
        )}

        {/* Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingImage(null);
            resetForm();
          }}
          title={editingImage ? "Edit Image" : "Upload New Image"}
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">
                Image Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="input-field"
                placeholder="Enter image title"
              />
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(value) =>
                setFormData({ ...formData, image: value as string })
              }
              label="Gallery Image"
              required={true}
              multiple={false}
            />

            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="input-field"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
                placeholder="Image description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="input-field"
                  placeholder="Location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="input-field"
                  placeholder="Date"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">
                Photographer
              </label>
              <input
                type="text"
                value={formData.photographer}
                onChange={(e) =>
                  setFormData({ ...formData, photographer: e.target.value })
                }
                className="input-field"
                placeholder="Photographer name"
              />
            </div>

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
                    displayOrder: parseInt(e.target.value) || 0,
                  })
                }
                className="input-field"
                placeholder="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.checked })
                }
                className="w-4 h-4 text-saffron-600 border-gray-300 rounded focus:ring-saffron-500"
              />
              <label
                htmlFor="isPublished"
                className="text-sm font-medium text-admin-700"
              >
                Published
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-admin-200">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingImage(null);
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
                {submitting ? "Saving..." : editingImage ? "Update" : "Upload"}{" "}
                Image
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default GalleryManagement;
