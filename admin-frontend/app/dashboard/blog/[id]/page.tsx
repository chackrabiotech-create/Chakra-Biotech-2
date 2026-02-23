"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Calendar, Clock, Tag, User } from "lucide-react";
import toast from "react-hot-toast";
import { blogsApi, Blog } from "@/lib/api";
import { formatDate } from "@/lib/utils/formatters";

const BlogDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const res = await blogsApi.getOne(id);
      setBlog(res.data);
    } catch {
      toast.error("Failed to load blog post");
      router.push("/dashboard/blog");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!blog) return;
    setToggling(true);
    try {
      await blogsApi.togglePublish(id);
      toast.success("Publish status updated!");
      loadBlog();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      await blogsApi.delete(id);
      toast.success("Blog post deleted successfully!");
      router.push("/dashboard/blog");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog post");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Blog Post Detail">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!blog) return null;

  const categoryName = typeof blog.category === "object" ? blog.category.name : "N/A";

  return (
    <DashboardLayout title="Blog Post Detail">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push("/dashboard/blog")}
            className="flex items-center gap-2 text-admin-600 hover:text-admin-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePublish}
              disabled={toggling}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                blog.isPublished
                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              {blog.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {blog.isPublished ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={() => router.push(`/dashboard/blog/${id}/edit`)}
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

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="card overflow-hidden">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Title & Meta */}
        <div className="card p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-admin-800 flex-1">{blog.title}</h1>
            <span className={`status-badge ${blog.isPublished ? "status-active" : "status-draft"}`}>
              {blog.isPublished ? "Published" : "Draft"}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-admin-500">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 bg-admin-100 text-admin-700 rounded-full">{categoryName}</span>
            </div>
            {blog.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views} views</span>
            </div>
            {blog.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
            )}
          </div>

          {blog.excerpt && (
            <blockquote className="border-l-4 border-saffron-400 pl-4 text-admin-600 italic">
              {blog.excerpt}
            </blockquote>
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="card p-6">
            <h3 className="font-medium text-admin-800 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-saffron-50 text-saffron-700 border border-saffron-200 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {blog.content && (
          <div className="card p-6">
            <h3 className="font-medium text-admin-800 mb-4">Content</h3>
            <div className="prose max-w-none text-admin-700 whitespace-pre-wrap leading-relaxed">
              {blog.content}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-admin-800">{blog.views}</p>
            <p className="text-sm text-admin-500">Total Views</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-admin-800">{blog.likes}</p>
            <p className="text-sm text-admin-500">Total Likes</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlogDetailPage;
