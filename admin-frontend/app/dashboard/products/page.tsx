"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/DashboardLayout";
import { Plus, Edit, Trash2, Eye, Search, Star, Package } from "lucide-react";
import toast from "react-hot-toast";
import { productsApi, productCategoriesApi, Product, Category } from "@/lib/api";

const ProductsManagement = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productsApi.getAll({ page: 1, limit: 100 }),
        productCategoriesApi.getAll(),
      ]);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      (typeof product.category === "object" && product.category._id === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productsApi.delete(id);
      toast.success("Product deleted successfully!");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const togglePublish = async (id: string) => {
    try {
      await productsApi.togglePublish(id);
      toast.success("Publish status updated!");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      await productsApi.toggleFeatured(id);
      toast.success("Featured status updated!");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Products Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Products Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-admin-800">Manage Products</h2>
            <p className="text-admin-600">Create and manage your saffron products</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/products/add")}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-admin-800">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-saffron-500" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Published</p>
                <p className="text-2xl font-bold text-green-600">{products.filter((p) => p.isPublished).length}</p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{products.filter((p) => !p.inStock).length}</p>
              </div>
              <Package className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Featured</p>
                <p className="text-2xl font-bold text-yellow-600">{products.filter((p) => p.isFeatured).length}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field md:w-48"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Product</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Price</th>
                  <th className="table-header">Stock</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-saffron-100 to-saffron-200 rounded-lg flex-shrink-0">
                          {product.featuredImage && (
                            <img src={product.featuredImage} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-admin-800">{product.name}</h3>
                          <p className="text-sm text-admin-500">{product.grade} • {product.weight}</p>
                          {product.isFeatured && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-admin-100 text-admin-700 rounded-full text-sm">
                        {typeof product.category === "object" ? product.category.name : "N/A"}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <span className="font-semibold text-admin-800">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-sm text-admin-500 line-through">₹{product.originalPrice.toLocaleString()}</div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                        {product.inStock ? product.stockQuantity || "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${product.isPublished ? "status-active" : "status-draft"}`}>
                        {product.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleFeatured(product._id)}
                          className={`p-2 rounded-lg transition-colors ${product.isFeatured ? "text-yellow-600 hover:bg-yellow-50" : "text-admin-400 hover:bg-admin-50"}`}
                          title="Toggle Featured"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => togglePublish(product._id)}
                          className={`p-2 rounded-lg transition-colors ${product.isPublished ? "text-green-600 hover:bg-green-50" : "text-admin-400 hover:bg-admin-50"}`}
                          title="Toggle Publish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/products/${product._id}`)}
                          className="p-2 text-admin-600 hover:bg-admin-50 rounded-lg transition-colors"
                          title="View Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/products/${product._id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-admin-300 mx-auto mb-4" />
            <p className="text-admin-500">No products found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductsManagement;
