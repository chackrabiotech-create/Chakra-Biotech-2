"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "../../../../components/DashboardLayout";
import { ArrowLeft, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { productsApi, productCategoriesApi, uploadApi, Product, Category } from "@/lib/api";

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const [formData, setFormData] = useState({
    name: "", description: "", shortDescription: "", category: "",
    price: 0, originalPrice: 0, grade: "", origin: "", weight: "",
    images: [] as string[], features: [] as string[], benefits: [] as string[],
    inStock: true, stockQuantity: 0, badge: "", isPublished: false, isFeatured: false, displayOrder: 0,
    specifications: {
      origin: "", grade: "", moistureContent: "", crocin: "",
      safranal: "", picrocrocin: "", shelfLife: "", storage: "",
    },
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productRes, categoriesRes] = await Promise.all([
        productsApi.getOne(id),
        productCategoriesApi.getAll(),
      ]);
      const p: Product = productRes.data;
      setCategories(categoriesRes.data);
      setFormData({
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription || "",
        category: typeof p.category === "object" ? p.category._id : p.category,
        price: p.price,
        originalPrice: p.originalPrice || 0,
        grade: p.grade || "",
        origin: p.origin || "",
        weight: p.weight || "",
        images: p.images,
        features: p.features || [],
        benefits: p.benefits || [],
        inStock: p.inStock,
        stockQuantity: p.stockQuantity || 0,
        badge: p.badge || "",
        isPublished: p.isPublished,
        isFeatured: p.isFeatured,
        displayOrder: p.displayOrder,
        specifications: {
          origin: p.specifications?.origin || "",
          grade: p.specifications?.grade || "",
          moistureContent: p.specifications?.moistureContent || "",
          crocin: p.specifications?.crocin || "",
          safranal: p.specifications?.safranal || "",
          picrocrocin: p.specifications?.picrocrocin || "",
          shelfLife: p.specifications?.shelfLife || "",
          storage: p.specifications?.storage || "",
        },
      });
    } catch {
      toast.error("Failed to load product");
      router.push("/dashboard/products");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadApi.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const urls = results.map((r) => r.data.url);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      toast.success("Images uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addTag = (field: "features" | "benefits", value: string, setValue: (v: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    }
    setValue("");
  };

  const removeTag = (field: "features" | "benefits", index: number) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "features" | "benefits",
    value: string,
    setValue: (v: string) => void
  ) => {
    if (e.key === "Enter") { e.preventDefault(); addTag(field, value, setValue); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) { toast.error("Please upload at least one product image"); return; }
    if (!formData.category) { toast.error("Please select a category"); return; }

    setSubmitting(true);
    try {
      await productsApi.update(id, formData);
      toast.success("Product updated successfully!");
      router.push(`/dashboard/products/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Product">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Product">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/dashboard/products/${id}`)}
            className="p-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-admin-800">Edit Product</h2>
            <p className="text-admin-600">Update product details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Basic Information</h3>
            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">Product Name *</label>
              <input type="text" required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field" placeholder="Enter product name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">Category *</label>
              <select required value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field">
                <option value="">Select category</option>
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">Short Description</label>
              <input type="text" value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="input-field" placeholder="Brief product description" />
            </div>
            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">Description *</label>
              <textarea required rows={5} value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field" placeholder="Detailed product description" />
            </div>
          </div>

          {/* Product Images */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Product Images</h3>
            <div className="border-2 border-dashed border-admin-300 rounded-lg p-6">
              <input type="file" accept="image/*" multiple onChange={handleImageUpload}
                className="hidden" id="image-upload" disabled={uploading} />
              <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer">
                <Upload className="w-8 h-8 text-admin-400 mb-2" />
                <span className="text-sm text-admin-600">{uploading ? "Uploading..." : "Click to add more images"}</span>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Pricing & Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Price (₹) *</label>
                <input type="number" required min="0" value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Original Price (₹)</label>
                <input type="number" min="0" value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Grade</label>
                <input type="text" value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="input-field" placeholder="e.g., Grade A+" />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Weight</label>
                <input type="text" value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="input-field" placeholder="e.g., 1g" />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Origin</label>
                <input type="text" value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="input-field" placeholder="e.g., Kashmir" />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Stock Quantity</label>
                <input type="number" min="0" value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                  className="input-field" />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              {(["moistureContent", "crocin", "safranal", "picrocrocin", "shelfLife", "storage"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-admin-700 mb-2 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input type="text"
                    value={formData.specifications[field]}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, [field]: e.target.value }
                    })}
                    className="input-field" />
                </div>
              ))}
            </div>
          </div>

          {/* Features & Benefits */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Features & Benefits</h3>
            {(["features", "benefits"] as const).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-admin-700 mb-2 capitalize">
                  {field} (press Enter to add)
                </label>
                <input type="text"
                  value={field === "features" ? featureInput : benefitInput}
                  onChange={(e) => field === "features" ? setFeatureInput(e.target.value) : setBenefitInput(e.target.value)}
                  onKeyDown={(e) => handleTagKeyDown(e, field, field === "features" ? featureInput : benefitInput, field === "features" ? setFeatureInput : setBenefitInput)}
                  className="input-field"
                  placeholder={`Type a ${field.slice(0, -1)} and press Enter`} />
                {formData[field].length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData[field].map((item, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-saffron-50 text-saffron-700 border border-saffron-200 rounded-full text-sm">
                        {item}
                        <button type="button" onClick={() => removeTag(field, i)} className="hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Settings</h3>
            <div className="flex flex-wrap gap-6">
              {([
                { key: "inStock", label: "In Stock" },
                { key: "isPublished", label: "Published" },
                { key: "isFeatured", label: "Featured Product" },
              ] as const).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                    className="w-4 h-4 text-saffron-600 border-gray-300 rounded focus:ring-saffron-500" />
                  <span className="text-sm font-medium text-admin-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => router.push(`/dashboard/products/${id}`)}
              className="px-6 py-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors"
              disabled={submitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting || uploading}>
              {submitting ? "Saving..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditProductPage;
