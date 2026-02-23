"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/DashboardLayout";
import { Plus, Edit, Trash2, Eye, Search, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { blogsApi, blogCategoriesApi, Blog, Category } from "@/lib/api";
import { formatDate } from "@/lib/utils/formatters";

const BlogManagement = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const statuses = ["All", "Published", "Draft"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [blogsRes, categoriesRes] = await Promise.all([
        blogsApi.getAll({ page: 1, limit: 100 }),
        blogCategoriesApi.getAll(),
      ]);
      setBlogs(blogsRes.data.blogs);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      (typeof blog.category === "object" &&
        blog.category._id === selectedCategory);
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Published" ? blog.isPublished : !blog.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await blogsApi.delete(id);
      toast.success("Blog post deleted successfully!");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog");
    }
  };

  const togglePublish = async (id: string) => {
    try {
      await blogsApi.togglePublish(id);
      toast.success("Publish status updated!");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Blog Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Blog Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-admin-800">Manage Blog Posts</h2>
            <p className="text-admin-600">Create and manage your blog content</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/blog/add")}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Blog Post</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-admin-500 text-sm">Total Posts</p>
            <p className="text-2xl font-bold text-admin-800">{blogs.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-admin-500 text-sm">Published</p>
            <p className="text-2xl font-bold text-green-600">{blogs.filter((b) => b.isPublished).length}</p>
          </div>
          <div className="card p-4">
            <p className="text-admin-500 text-sm">Drafts</p>
            <p className="text-2xl font-bold text-amber-600">{blogs.filter((b) => !b.isPublished).length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search blog posts..."
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
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field md:w-48"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Posts Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Title</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Author</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Views</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog, index) => (
                  <motion.tr
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-saffron-100 to-saffron-200 rounded-lg flex-shrink-0 overflow-hidden">
                          {blog.featuredImage && (
                            <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-admin-800 line-clamp-1">{blog.title}</h3>
                          <p className="text-sm text-admin-500 line-clamp-1">{blog.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-admin-100 text-admin-700 rounded-full text-sm">
                        {typeof blog.category === "object" ? blog.category.name : "N/A"}
                      </span>
                    </td>
                    <td className="table-cell">{blog.author}</td>
                    <td className="table-cell">
                      <span className={`status-badge ${blog.isPublished ? "status-active" : "status-draft"}`}>
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-admin-400" />
                        <span>{blog.views}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-1 text-sm text-admin-500">
                        <Calendar className="w-4 h-4" />
                        <span>{blog.publishedAt ? formatDate(blog.publishedAt) : "Not published"}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => togglePublish(blog._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            blog.isPublished
                              ? "text-green-600 hover:bg-green-50"
                              : "text-admin-400 hover:bg-admin-50"
                          }`}
                          title="Toggle Publish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/blog/${blog._id}`)}
                          className="p-2 text-admin-600 hover:bg-admin-50 rounded-lg transition-colors"
                          title="View Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/blog/${blog._id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
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

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-admin-500">No blog posts found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BlogManagement;
