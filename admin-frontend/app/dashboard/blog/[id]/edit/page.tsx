"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "../../../../components/DashboardLayout";
import ImageUpload from "../../../../components/ImageUpload";
import { ArrowLeft, X } from "lucide-react";
import toast from "react-hot-toast";
import { blogsApi, blogCategoriesApi, Blog, Category } from "@/lib/api";

const EditBlogPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    featuredImage: "",
    tags: [] as string[],
    readTime: "",
    isPublished: false,
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [blogRes, categoriesRes] = await Promise.all([
        blogsApi.getOne(id),
        blogCategoriesApi.getAll(),
      ]);
      const blog: Blog = blogRes.data;
      setCategories(categoriesRes.data);
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        category: typeof blog.category === "object" ? blog.category._id : blog.category,
        author: blog.author,
        featuredImage: blog.featuredImage,
        tags: blog.tags || [],
        readTime: blog.readTime || "",
        isPublished: blog.isPublished,
      });
    } catch {
      toast.error("Failed to load blog post");
      router.push("/dashboard/blog");
    } finally {
      setLoading(false);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Title is required"); return; }
    if (!formData.content.trim()) { toast.error("Content is required"); return; }
    if (!formData.author.trim()) { toast.error("Author is required"); return; }
    if (!formData.category) { toast.error("Please select a category"); return; }

    setSubmitting(true);
    try {
      await blogsApi.update(id, formData);
      toast.success("Blog post updated successfully!");
      router.push(`/dashboard/blog/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update blog post");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Blog Post">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Blog Post">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/dashboard/blog/${id}`)}
            className="p-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-admin-800">Edit Blog Post</h2>
            <p className="text-admin-600">Update the blog post details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Enter blog post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">Excerpt</label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="input-field"
                placeholder="Brief description of the blog post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">Content *</label>
              <textarea
                rows={12}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input-field"
                placeholder="Write your blog post content here..."
              />
            </div>
          </div>

          {/* Post Details */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Post Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Author *</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="input-field"
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-2">Read Time</label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 5 min read"
                />
              </div>
            </div>
          </div>

          {/* Media & Tags */}
          <div className="card p-6 space-y-4">
            <h3 className="font-medium text-admin-800 border-b border-admin-200 pb-2">Media & Tags</h3>

            <ImageUpload
              value={formData.featuredImage}
              onChange={(value) => setFormData({ ...formData, featuredImage: value as string })}
              label="Featured Image"
              required={false}
              multiple={false}
            />

            <div>
              <label className="block text-sm font-medium text-admin-700 mb-2">Tags (press Enter to add)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="input-field"
                placeholder="Type a tag and press Enter"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-saffron-50 text-saffron-700 border border-saffron-200 rounded-full text-sm">
                      {tag}
                      <button type="button" onClick={() => removeTag(i)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 text-saffron-600 border-gray-300 rounded focus:ring-saffron-500"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-admin-700">Published</label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/blog/${id}`)}
              className="px-6 py-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Update Blog Post"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditBlogPage;
