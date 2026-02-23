"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import { ArrowLeft, Edit, Trash2, Eye, Star, Package } from "lucide-react";
import toast from "react-hot-toast";
import { productsApi, Product } from "@/lib/api";

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await productsApi.getOne(id);
      setProduct(res.data);
    } catch {
      toast.error("Failed to load product");
      router.push("/dashboard/products");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await productsApi.togglePublish(id);
      toast.success("Publish status updated!");
      loadProduct();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleToggleFeatured = async () => {
    try {
      await productsApi.toggleFeatured(id);
      toast.success("Featured status updated!");
      loadProduct();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      await productsApi.delete(id);
      toast.success("Product deleted successfully!");
      router.push("/dashboard/products");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Product Detail">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) return null;

  const categoryName = typeof product.category === "object" ? product.category.name : "N/A";
  const specs = product.specifications;

  return (
    <DashboardLayout title="Product Detail">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push("/dashboard/products")}
            className="flex items-center gap-2 text-admin-600 hover:text-admin-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleTogglePublish}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                product.isPublished ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              <Eye className="w-4 h-4" />
              {product.isPublished ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={handleToggleFeatured}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                product.isFeatured ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-admin-50 text-admin-600 hover:bg-admin-100"
              }`}
            >
              <Star className="w-4 h-4" />
              {product.isFeatured ? "Unfeature" : "Feature"}
            </button>
            <button
              onClick={() => router.push(`/dashboard/products/${id}/edit`)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Images */}
          <div className="card p-4 space-y-3">
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-72 object-cover rounded-lg"
                />
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((img, i) => (
                      <button
                        key={i} onClick={() => setActiveImage(i)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          activeImage === i ? "border-saffron-500" : "border-transparent"
                        }`}
                      >
                        <img src={img} alt={`${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-72 bg-admin-100 rounded-lg flex items-center justify-center">
                <Package className="w-16 h-16 text-admin-300" />
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <h1 className="text-2xl font-bold text-admin-800">{product.name}</h1>
                <span className="px-2 py-1 bg-admin-100 text-admin-700 rounded-full text-sm">{categoryName}</span>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`status-badge ${product.isPublished ? "status-active" : "status-draft"}`}>
                  {product.isPublished ? "Published" : "Draft"}
                </span>
                <span className={`status-badge ${product.inStock ? "status-active" : "bg-red-100 text-red-700"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
                {product.isFeatured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Featured</span>
                )}
                {product.badge && (
                  <span className="px-2 py-1 bg-saffron-100 text-saffron-700 rounded-full text-xs font-medium">{product.badge}</span>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-admin-800">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="ml-2 text-lg text-admin-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {product.grade && <div><span className="text-admin-500">Grade:</span> <span className="font-medium text-admin-700">{product.grade}</span></div>}
                {product.weight && <div><span className="text-admin-500">Weight:</span> <span className="font-medium text-admin-700">{product.weight}</span></div>}
                {product.origin && <div><span className="text-admin-500">Origin:</span> <span className="font-medium text-admin-700">{product.origin}</span></div>}
                {product.stockQuantity !== undefined && <div><span className="text-admin-500">Stock:</span> <span className="font-medium text-admin-700">{product.stockQuantity} units</span></div>}
                <div><span className="text-admin-500">Views:</span> <span className="font-medium text-admin-700">{product.views}</span></div>
                <div><span className="text-admin-500">Rating:</span> <span className="font-medium text-admin-700">{product.rating} ★ ({product.reviewCount})</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.shortDescription && (
          <div className="card p-6">
            <h3 className="font-medium text-admin-800 mb-2">Short Description</h3>
            <p className="text-admin-600">{product.shortDescription}</p>
          </div>
        )}

        <div className="card p-6">
          <h3 className="font-medium text-admin-800 mb-2">Description</h3>
          <p className="text-admin-600 whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* Specifications */}
        {specs && Object.values(specs).some(Boolean) && (
          <div className="card p-6">
            <h3 className="font-medium text-admin-800 mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(specs).filter(([, v]) => v).map(([key, value]) => (
                <div key={key} className="flex justify-between p-2 bg-admin-50 rounded-lg">
                  <span className="text-sm text-admin-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="text-sm font-medium text-admin-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features & Benefits */}
        {((product.features && product.features.length > 0) || (product.benefits && product.benefits.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.features && product.features.length > 0 && (
              <div className="card p-6">
                <h3 className="font-medium text-admin-800 mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-admin-600">
                      <span className="w-1.5 h-1.5 bg-saffron-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.benefits && product.benefits.length > 0 && (
              <div className="card p-6">
                <h3 className="font-medium text-admin-800 mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-admin-600">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductDetailPage;
