"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "../../../../components/DashboardLayout";
import ImageUpload from "../../../../components/ImageUpload";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { heroApi, HeroSection } from "@/lib/api";

const EditCarouselPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
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
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const res = await heroApi.getOne(id);
      const item: HeroSection = res.data;
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
    } catch {
      toast.error("Failed to load carousel item");
      router.push("/dashboard/carousel");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Title is required"); return; }
    if (!formData.image) { toast.error("Desktop image is required"); return; }

    setSubmitting(true);
    try {
      await heroApi.update(id, formData);
      toast.success("Carousel item updated successfully!");
      router.push(`/dashboard/carousel/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update carousel item");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Carousel Slide">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Carousel Slide">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/dashboard/carousel/${id}`)}
            className="p-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-admin-800">Edit Carousel Slide</h2>
            <p className="text-admin-600">Update the carousel slide details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Title *</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field" placeholder="Enter slide title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Subtitle</label>
                <input type="text" value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="input-field" placeholder="Enter subtitle" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">Description</label>
              <textarea rows={3} value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field" placeholder="Enter slide description" />
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(value) => setFormData({ ...formData, image: value as string })}
              label="Desktop Image *"
              required={false}
              multiple={false}
            />

            <ImageUpload
              value={formData.mobileImage}
              onChange={(value) => setFormData({ ...formData, mobileImage: value as string })}
              label="Mobile Image (Optional)"
              required={false}
              multiple={false}
            />
          </div>

          {/* Call to Action */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Call to Action</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Primary Button Text</label>
                <input type="text" value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  className="input-field" placeholder="e.g., Shop Now" />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Primary Button Link</label>
                <input type="text" value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  className="input-field" placeholder="e.g., /products" />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Secondary Button Text</label>
                <input type="text" value={formData.secondaryCtaText}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                  className="input-field" placeholder="e.g., Learn More" />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Secondary Button Link</label>
                <input type="text" value={formData.secondaryCtaLink}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                  className="input-field" placeholder="e.g., /about" />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Display Order</label>
                <input type="number" min="1" value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Text Position</label>
                <select value={formData.textPosition}
                  onChange={(e) => setFormData({ ...formData, textPosition: e.target.value as "left" | "center" | "right" })}
                  className="input-field">
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Overlay Opacity (0–1)</label>
                <input type="number" min="0" max="1" step="0.1" value={formData.overlayOpacity}
                  onChange={(e) => setFormData({ ...formData, overlayOpacity: parseFloat(e.target.value) || 0 })}
                  className="input-field" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-saffron-600 border-gray-300 rounded focus:ring-saffron-500" />
              <label htmlFor="isActive" className="text-sm font-medium text-admin-700">Active Slide</label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => router.push(`/dashboard/carousel/${id}`)}
              className="px-6 py-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors"
              disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Update Slide"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditCarouselPage;
