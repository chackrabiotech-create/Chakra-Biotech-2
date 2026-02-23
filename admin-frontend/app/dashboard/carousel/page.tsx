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
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { heroApi } from "@/lib/api";

interface HeroSection {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  mobileImage?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  isActive: boolean;
  displayOrder: number;
  textPosition?: "left" | "center" | "right";
  overlayOpacity?: number;
}

const CarouselManagement = () => {
  const [carouselItems, setCarouselItems] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<HeroSection | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    mobileImage: "",
    ctaText: "",
    ctaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    isActive: true,
    displayOrder: 1,
    textPosition: "center" as "left" | "center" | "right",
    overlayOpacity: 0.5,
  });

  useEffect(() => {
    loadCarouselItems();
  }, []);

  const loadCarouselItems = async () => {
    try {
      setLoading(true);
      const response = await heroApi.getAll();
      setCarouselItems(response.data);
    } catch (error) {
      toast.error("Failed to load carousel items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingItem) {
        await heroApi.update(editingItem._id, formData);
        toast.success("Carousel item updated successfully!");
      } else {
        await heroApi.create(formData);
        toast.success("Carousel item added successfully!");
      }

      setShowForm(false);
      setEditingItem(null);
      resetForm();
      loadCarouselItems();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image: "",
      mobileImage: "",
      ctaText: "",
      ctaLink: "",
      secondaryCtaText: "",
      secondaryCtaLink: "",
      isActive: true,
      displayOrder: 1,
      textPosition: "center",
      overlayOpacity: 0.5,
    });
  };

  const handleEdit = (item: HeroSection) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      subtitle: item.subtitle || "",
      description: item.description || "",
      image: item.image,
      mobileImage: item.mobileImage || "",
      ctaText: item.ctaText || "",
      ctaLink: item.ctaLink || "",
      secondaryCtaText: item.secondaryCtaText || "",
      secondaryCtaLink: item.secondaryCtaLink || "",
      isActive: item.isActive,
      displayOrder: item.displayOrder,
      textPosition: item.textPosition || "center",
      overlayOpacity: item.overlayOpacity || 0.5,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this carousel item?")) return;

    try {
      await heroApi.delete(id);
      toast.success("Carousel item deleted successfully!");
      loadCarouselItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete item");
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await heroApi.toggleActive(id);
      toast.success("Status updated successfully!");
      loadCarouselItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Carousel Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Carousel Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-admin-800">
              Manage Carousel Slides
            </h2>
            <p className="text-admin-600">
              Create and manage homepage carousel slides
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Slide</span>
          </button>
        </div>

        {/* Carousel Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carouselItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-saffron-100 to-saffron-200">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-admin-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => toggleActive(item._id)}
                    className={`p-1 rounded-full ${
                      item.isActive ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {item.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-admin-800 text-white px-2 py-1 rounded text-xs">
                    Order: {item.displayOrder}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-serif text-lg font-semibold text-admin-800 mb-2">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-saffron-600 font-medium text-sm mb-2">
                    {item.subtitle}
                  </p>
                )}
                {item.description && (
                  <p className="text-admin-600 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`status-badge ${
                      item.isActive ? "status-active" : "status-inactive"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {carouselItems.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-admin-300 mx-auto mb-4" />
            <p className="text-admin-500">No carousel items found</p>
          </div>
        )}

        {/* Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
            resetForm();
          }}
          title={editingItem ? "Edit Carousel Item" : "Add New Carousel Item"}
          size="xl"
        >
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 space-y-4 sm:space-y-6"
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-admin-800 text-sm sm:text-base">
                Basic Information
              </h4>
              <div className="form-grid">
                <div>
                  <label className="block text-sm font-medium text-admin-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter slide title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter subtitle"
                  />
                </div>
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
                  placeholder="Enter slide description"
                />
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(value) =>
                  setFormData({ ...formData, image: value as string })
                }
                label="Desktop Image"
                required={true}
                multiple={false}
              />

              <ImageUpload
                value={formData.mobileImage}
                onChange={(value) =>
                  setFormData({ ...formData, mobileImage: value as string })
                }
                label="Mobile Image (Optional)"
                required={false}
                multiple={false}
              />
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <h4 className="font-medium text-admin-800 text-sm sm:text-base">
                Call to Action
              </h4>
              <div className="form-grid">
                <div>
                  <label className="block text-sm font-medium text-admin-700 mb-2">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaText: e.target.value })
                    }
                    className="input-field"
                    placeholder="e.g., Shop Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-700 mb-2">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaLink: e.target.value })
                    }
                    className="input-field"
                    placeholder="e.g., /products"
                  />
                </div>
              </div>
              <div className="form-grid">
                <div>
                  <label className="block text-sm font-medium text-admin-700 mb-2">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryCtaText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secondaryCtaText: e.target.value,
                      })
                    }
                    className="input-field"
                    placeholder="e.g., Learn More"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-700 mb-2">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryCtaLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secondaryCtaLink: e.target.value,
                      })
                    }
                    className="input-field"
                    placeholder="e.g., /about"
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h4 className="font-medium text-admin-800 text-sm sm:text-base">
                Settings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-admin-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
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
                <div>
                  <label className="block text-sm font-medium text-admin-700 mb-2">
                    Text Position
                  </label>
                  <select
                    value={formData.textPosition}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        textPosition: e.target.value as
                          | "left"
                          | "center"
                          | "right",
                      })
                    }
                    className="input-field"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-700 mb-2">
                    Overlay Opacity
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.overlayOpacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        overlayOpacity: parseFloat(e.target.value),
                      })
                    }
                    className="input-field"
                  />
                </div>
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
                  Active Slide
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-admin-200">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="btn-mobile px-6 py-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors order-2 sm:order-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary btn-mobile order-1 sm:order-2"
                disabled={submitting}
              >
                {submitting ? "Saving..." : editingItem ? "Update" : "Create"}{" "}
                Slide
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default CarouselManagement;
