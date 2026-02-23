"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Trash2,
  CheckCircle,
  Clock,
  MessageSquare,
  User,
  Mail,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import { commentsApi, Comment } from "@/lib/api";
import { formatDate } from "@/lib/utils/formatters";

const CommentManagement = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [commentType, setCommentType] = useState<"blog" | "product">("blog");

  useEffect(() => {
    loadData();
  }, [selectedStatus, commentType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, limit: 100, type: commentType };
      if (selectedStatus === "Approved") params.isApproved = true;
      if (selectedStatus === "Pending") params.isApproved = false;

      const res = await commentsApi.getAll(params);
      setComments(res.data.comments);
    } catch (error) {
      toast.error("Failed to load comments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await commentsApi.approve(id, commentType);
      toast.success("Comment approved successfully!");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve comment");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await commentsApi.delete(id, commentType);
      toast.success("Comment deleted successfully!");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete comment");
    }
  };

  return (
    <DashboardLayout title="Comment Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-admin-800">
              Manage {commentType === "blog" ? "Blog" : "Product"} Comments
            </h2>
            <p className="text-admin-600">
              Review and moderate comments on your{" "}
              {commentType === "blog" ? "blog posts" : "products"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex bg-white rounded-lg border border-admin-200 p-1">
              <button
                onClick={() => setCommentType("blog")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  commentType === "blog"
                    ? "bg-admin-800 text-white shadow-sm"
                    : "text-admin-600 hover:text-admin-800 hover:bg-admin-50"
                }`}
              >
                Blogs
              </button>
              <button
                onClick={() => setCommentType("product")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  commentType === "product"
                    ? "bg-admin-800 text-white shadow-sm"
                    : "text-admin-600 hover:text-admin-800 hover:bg-admin-50"
                }`}
              >
                Products
              </button>
            </div>
            <div className="flex bg-white rounded-lg border border-admin-200 p-1">
              {["All", "Pending", "Approved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    selectedStatus === status
                      ? "bg-saffron-500 text-white shadow-sm"
                      : "text-admin-600 hover:text-admin-800 hover:bg-admin-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-admin-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-admin-300" />
            </div>
            <h3 className="text-lg font-medium text-admin-800">
              No comments found
            </h3>
            <p className="text-admin-500">
              Try changing your filters or wait for new feedback.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {comments.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="card p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    {/* User Info & Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-admin-800 font-semibold">
                        <User className="w-4 h-4 text-admin-400" />
                        <span>{comment.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-admin-500">
                        <Mail className="w-4 h-4" />
                        <span>{comment.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-admin-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-saffron-600 font-medium font-sans">
                        <LinkIcon className="w-4 h-4" />
                        <span className="line-clamp-1">
                          {commentType === "blog"
                            ? typeof comment.blog === "object"
                              ? comment.blog.title
                              : "Unknown Blog"
                            : typeof comment.product === "object"
                              ? comment.product.name
                              : "Unknown Product"}
                        </span>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="bg-admin-50 p-4 rounded-xl border border-admin-100">
                      <p className="text-admin-700 whitespace-pre-wrap leading-relaxed font-sans">
                        {comment.comment}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center space-x-2">
                      {comment.isApproved ? (
                        <span className="flex items-center space-x-1 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                          <CheckCircle className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                          <Clock className="w-3 h-3" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                      {comment.parentComment && (
                        <span className="text-xs font-medium text-admin-500 bg-admin-100 px-2.5 py-1 rounded-full font-serif">
                          Reply
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col justify-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-admin-100 lg:pl-6">
                    {!comment.isApproved && (
                      <button
                        onClick={() => handleApprove(comment._id)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium min-w-[120px]"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium min-w-[120px]"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CommentManagement;
