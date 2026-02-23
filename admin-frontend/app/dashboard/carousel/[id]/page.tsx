"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { heroApi, HeroSection } from "@/lib/api";

const CarouselDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const res = await heroApi.getOne(id);
      setItem(res.data);
    } catch {
      toast.error("Failed to load carousel item");
      router.push("/dashboard/carousel");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    setToggling(true);
    try {
      await heroApi.toggleActive(id);
      toast.success("Status updated successfully!");
      loadItem();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this carousel item?")) return;
    setDeleting(true);
    try {
      await heroApi.delete(id);
      toast.success("Carousel item deleted successfully!");
      router.push("/dashboard/carousel");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete item");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Carousel Slide Detail">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!item) return null;

  return (
    <DashboardLayout title="Carousel Slide Detail">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push("/dashboard/carousel")}
            className="flex items-center gap-2 text-admin-600 hover:text-admin-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Carousel
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleActive}
              disabled={toggling}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                item.isActive ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {item.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => router.push(`/dashboard/carousel/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Preview Image */}
        <div className="card overflow-hidden">
          {item.image ? (
            <div className="relative">
              <img src={item.image} alt={item.title} className="w-full h-72 object-cover" />
              <div
                className="absolute inset-0"
                style={{ backgroundColor: `rgba(0,0,0,${item.overlayOpacity || 0})` }}
              />
              <div className={`absolute inset-0 flex flex-col justify-center px-8 ${
                item.textPosition === "center" ? "items-center text-center" :
                item.textPosition === "right" ? "items-end text-right" : "items-start text-left"
              }`}>
                <h2 className="text-white text-2xl font-bold drop-shadow">{item.title}</h2>
                {item.subtitle && <p className="text-white/90 text-lg mt-1 drop-shadow">{item.subtitle}</p>}
              </div>
            </div>
          ) : (
            <div className="w-full h-72 bg-admin-100 flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-admin-300" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Slide Content</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-admin-500 uppercase tracking-wide">Title</p>
                <p className="font-medium text-admin-800">{item.title}</p>
              </div>
              {item.subtitle && (
                <div>
                  <p className="text-xs text-admin-500 uppercase tracking-wide">Subtitle</p>
                  <p className="text-admin-700">{item.subtitle}</p>
                </div>
              )}
              {item.description && (
                <div>
                  <p className="text-xs text-admin-500 uppercase tracking-wide">Description</p>
                  <p className="text-admin-700">{item.description}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-admin-500 uppercase tracking-wide">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Settings</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-admin-500 uppercase tracking-wide">Display Order</p>
                <p className="font-medium text-admin-800">{item.displayOrder}</p>
              </div>
              <div>
                <p className="text-xs text-admin-500 uppercase tracking-wide">Text Position</p>
                <p className="font-medium text-admin-800 capitalize">{item.textPosition || "Center"}</p>
              </div>
              <div>
                <p className="text-xs text-admin-500 uppercase tracking-wide">Overlay Opacity</p>
                <p className="font-medium text-admin-800">{item.overlayOpacity || 0}</p>
              </div>
              {(item.ctaText || item.ctaLink) && (
                <div>
                  <p className="text-xs text-admin-500 uppercase tracking-wide">Primary CTA</p>
                  <p className="font-medium text-admin-800">{item.ctaText} → {item.ctaLink}</p>
                </div>
              )}
              {(item.secondaryCtaText || item.secondaryCtaLink) && (
                <div>
                  <p className="text-xs text-admin-500 uppercase tracking-wide">Secondary CTA</p>
                  <p className="font-medium text-admin-800">{item.secondaryCtaText} → {item.secondaryCtaLink}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Image */}
        {item.mobileImage && (
          <div className="card p-6">
            <h3 className="font-medium text-admin-800 mb-3">Mobile Image</h3>
            <img src={item.mobileImage} alt="Mobile" className="h-48 object-cover rounded-lg" />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CarouselDetailPage;
