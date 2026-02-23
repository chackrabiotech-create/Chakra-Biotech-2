"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Modal from "../../components/Modal";
import {
  enrollmentApi,
  Enrollment,
  EnrollmentStats,
  CreateEnrollmentData,
  trainingApi,
  Training,
} from "@/lib/api";
import { formatDate } from "@/lib/utils/formatters";
import toast from "react-hot-toast";
import {
  Search,
  Plus,
  Download,
  Eye,
  Trash2,
  Check,
  X,
  CheckCircle,
  Users,
  Clock,
  UserCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const sourceOptions = [
  { value: "", label: "All Sources" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "social_media", label: "Social Media" },
  { value: "website", label: "Website" },
  { value: "manual", label: "Manual" },
  { value: "phone", label: "Phone" },
  { value: "referral", label: "Referral" },
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "approved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatSource = (source: string) => {
  return source
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getTrainingTitle = (trainingId: Enrollment["trainingId"]): string => {
  if (typeof trainingId === "object" && trainingId !== null) {
    return trainingId.title;
  }
  return "N/A";
};

const EnrollmentManagement = () => {
  // Data state
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [stats, setStats] = useState<EnrollmentStats>({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [trainingFilter, setTrainingFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateEnrollmentData>({
    studentName: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    trainingId: "",
    source: "website",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch trainings on mount
  useEffect(() => {
    const loadTrainings = async () => {
      try {
        const response = await trainingApi.getAll({ limit: 100 });
        const data = response.data?.trainings || response.data || [];
        setTrainings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load trainings:", error);
      }
    };
    loadTrainings();
  }, []);

  // Fetch enrollments
  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        page: currentPage,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      if (trainingFilter) params.trainingId = trainingFilter;
      if (sourceFilter) params.source = sourceFilter;

      const response = await enrollmentApi.getAll(params);
      setEnrollments(response.data || []);
      setStats(
        response.stats || { total: 0, pending: 0, approved: 0, completed: 0 }
      );
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.currentPage || 1);
    } catch (error: any) {
      toast.error(error.message || "Failed to load enrollments");
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter, trainingFilter, sourceFilter]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  // Actions
  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);
      await enrollmentApi.approve(id);
      toast.success("Enrollment approved successfully");
      fetchEnrollments();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve enrollment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(id);
      await enrollmentApi.reject(id);
      toast.success("Enrollment rejected");
      fetchEnrollments();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject enrollment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      setActionLoading(id);
      await enrollmentApi.complete(id);
      toast.success("Enrollment marked as completed");
      fetchEnrollments();
    } catch (error: any) {
      toast.error(error.message || "Failed to complete enrollment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?"))
      return;

    try {
      setActionLoading(id);
      await enrollmentApi.delete(id);
      toast.success("Enrollment deleted successfully");
      fetchEnrollments();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete enrollment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      await enrollmentApi.downloadCSV({
        status: statusFilter || undefined,
        trainingId: trainingFilter || undefined,
        source: sourceFilter || undefined,
        search: debouncedSearch || undefined,
      });
      toast.success("CSV downloaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to download CSV");
    }
  };

  // Add enrollment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.studentName ||
      !formData.email ||
      !formData.phone ||
      !formData.trainingId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const payload: CreateEnrollmentData = {
        studentName: formData.studentName,
        email: formData.email,
        phone: formData.phone,
        trainingId: formData.trainingId,
        source: formData.source,
      };
      if (formData.whatsappNumber) payload.whatsappNumber = formData.whatsappNumber;
      if (formData.notes) payload.notes = formData.notes;

      await enrollmentApi.create(payload);
      toast.success("Enrollment created successfully");
      setShowAddModal(false);
      resetForm();
      fetchEnrollments();
    } catch (error: any) {
      toast.error(error.message || "Failed to create enrollment");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: "",
      email: "",
      phone: "",
      whatsappNumber: "",
      trainingId: "",
      source: "website",
      notes: "",
    });
  };

  const openViewModal = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowViewModal(true);
  };

  // Loading state
  if (loading && enrollments.length === 0) {
    return (
      <DashboardLayout title="Enrollment Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Enrollment Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-admin-800">
              Enrollment Management
            </h2>
            <p className="text-admin-600 text-sm">
              Manage student enrollments for training programs
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2 border border-admin-300 text-admin-700 rounded-lg hover:bg-admin-50 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Enrollment</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Total Enrollments</p>
                <p className="text-2xl font-bold text-admin-800">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 bg-saffron-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-saffron-500" />
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.completed}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={trainingFilter}
              onChange={(e) => {
                setTrainingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            >
              <option value="">All Trainings</option>
              {trainings.map((training) => (
                <option key={training._id} value={training._id}>
                  {training.title}
                </option>
              ))}
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            >
              {sourceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-admin-200 bg-admin-50">
                  <th className="text-left p-4 font-medium text-admin-600">
                    Student Name
                  </th>
                  <th className="text-left p-4 font-medium text-admin-600">
                    Email
                  </th>
                  <th className="text-left p-4 font-medium text-admin-600">
                    Phone
                  </th>
                  <th className="text-left p-4 font-medium text-admin-600">
                    Training
                  </th>
                  <th className="text-left p-4 font-medium text-admin-600">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-admin-600">
                    Source
                  </th>
                  <th className="text-left p-4 font-medium text-admin-600">
                    Date
                  </th>
                  <th className="text-right p-4 font-medium text-admin-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-admin-300 mx-auto mb-3" />
                      <p className="text-admin-500 font-medium">
                        No enrollments found
                      </p>
                      <p className="text-admin-400 text-sm mt-1">
                        Try adjusting your filters or add a new enrollment
                      </p>
                    </td>
                  </tr>
                ) : (
                  enrollments.map((enrollment) => (
                    <tr
                      key={enrollment._id}
                      className="border-b border-admin-100 hover:bg-admin-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-admin-800">
                        {enrollment.studentName}
                      </td>
                      <td className="p-4 text-admin-600">
                        {enrollment.email}
                      </td>
                      <td className="p-4 text-admin-600">
                        {enrollment.phone}
                      </td>
                      <td className="p-4 text-admin-600">
                        {getTrainingTitle(enrollment.trainingId)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(
                            enrollment.status
                          )}`}
                        >
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="p-4 text-admin-600">
                        {formatSource(enrollment.source)}
                      </td>
                      <td className="p-4 text-admin-600 whitespace-nowrap">
                        {formatDate(enrollment.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          {enrollment.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(enrollment._id)}
                                disabled={actionLoading === enrollment._id}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(enrollment._id)}
                                disabled={actionLoading === enrollment._id}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {enrollment.status === "approved" && (
                            <button
                              onClick={() => handleComplete(enrollment._id)}
                              disabled={actionLoading === enrollment._id}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Mark Complete"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => openViewModal(enrollment)}
                            className="p-1.5 text-admin-500 hover:bg-admin-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(enrollment._id)}
                            disabled={actionLoading === enrollment._id}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-admin-200">
              <p className="text-sm text-admin-600">
                Showing page {currentPage} of {totalPages} ({total} total
                enrollments)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-admin-300 rounded-lg hover:bg-admin-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-admin-300 rounded-lg hover:bg-admin-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Enrollment Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Enrollment"
          size="xl"
        >
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-1.5">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter student name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappNumber: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter WhatsApp number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-1.5">
                  Training <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.trainingId}
                  onChange={(e) =>
                    setFormData({ ...formData, trainingId: e.target.value })
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select a training</option>
                  {trainings.map((training) => (
                    <option key={training._id} value={training._id}>
                      {training.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-700 mb-1.5">
                  Source <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  className="input-field"
                  required
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="social_media">Social Media</option>
                  <option value="website">Website</option>
                  <option value="manual">Manual</option>
                  <option value="phone">Phone</option>
                  <option value="referral">Referral</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-700 mb-1.5">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="input-field"
                rows={3}
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-admin-200">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Enrollment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>

        {/* View Enrollment Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedEnrollment(null);
          }}
          title="Enrollment Details"
          size="lg"
        >
          {selectedEnrollment && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Student Info */}
              <div>
                <h4 className="text-sm font-semibold text-admin-400 uppercase tracking-wider mb-3">
                  Student Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-admin-500 mb-1">
                      Name
                    </label>
                    <p className="text-admin-800 font-medium">
                      {selectedEnrollment.studentName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-admin-500 mb-1">
                      Email
                    </label>
                    <p className="text-admin-800">{selectedEnrollment.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-admin-500 mb-1">
                      Phone
                    </label>
                    <p className="text-admin-800">{selectedEnrollment.phone}</p>
                  </div>
                  {selectedEnrollment.whatsappNumber && (
                    <div>
                      <label className="block text-sm font-medium text-admin-500 mb-1">
                        WhatsApp
                      </label>
                      <p className="text-admin-800">
                        {selectedEnrollment.whatsappNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Training Info */}
              <div className="border-t border-admin-200 pt-5">
                <h4 className="text-sm font-semibold text-admin-400 uppercase tracking-wider mb-3">
                  Training Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-admin-500 mb-1">
                      Training
                    </label>
                    <p className="text-admin-800 font-medium">
                      {getTrainingTitle(selectedEnrollment.trainingId)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-admin-500 mb-1">
                      Source
                    </label>
                    <p className="text-admin-800">
                      {formatSource(selectedEnrollment.source)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status & Dates */}
              <div className="border-t border-admin-200 pt-5">
                <h4 className="text-sm font-semibold text-admin-400 uppercase tracking-wider mb-3">
                  Status & Dates
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-admin-500 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(
                        selectedEnrollment.status
                      )}`}
                    >
                      {selectedEnrollment.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-admin-500 mb-1">
                      Enrolled On
                    </label>
                    <p className="text-admin-800">
                      {formatDate(selectedEnrollment.createdAt)}
                    </p>
                  </div>
                  {selectedEnrollment.approvedAt && (
                    <div>
                      <label className="block text-sm font-medium text-admin-500 mb-1">
                        Approved On
                      </label>
                      <p className="text-admin-800">
                        {formatDate(selectedEnrollment.approvedAt)}
                      </p>
                    </div>
                  )}
                  {selectedEnrollment.completedAt && (
                    <div>
                      <label className="block text-sm font-medium text-admin-500 mb-1">
                        Completed On
                      </label>
                      <p className="text-admin-800">
                        {formatDate(selectedEnrollment.completedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enrolled By */}
              {selectedEnrollment.enrolledBy &&
                typeof selectedEnrollment.enrolledBy === "object" && (
                  <div className="border-t border-admin-200 pt-5">
                    <h4 className="text-sm font-semibold text-admin-400 uppercase tracking-wider mb-3">
                      Enrolled By
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-admin-500 mb-1">
                          Admin Name
                        </label>
                        <p className="text-admin-800">
                          {selectedEnrollment.enrolledBy.name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-admin-500 mb-1">
                          Admin Email
                        </label>
                        <p className="text-admin-800">
                          {selectedEnrollment.enrolledBy.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Notes */}
              {(selectedEnrollment.notes || selectedEnrollment.adminNotes) && (
                <div className="border-t border-admin-200 pt-5">
                  <h4 className="text-sm font-semibold text-admin-400 uppercase tracking-wider mb-3">
                    Notes
                  </h4>
                  {selectedEnrollment.notes && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-admin-500 mb-1">
                        Student Notes
                      </label>
                      <div className="bg-admin-50 p-3 rounded-lg">
                        <p className="text-admin-800 whitespace-pre-wrap text-sm">
                          {selectedEnrollment.notes}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedEnrollment.adminNotes && (
                    <div>
                      <label className="block text-sm font-medium text-admin-500 mb-1">
                        Admin Notes
                      </label>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-admin-800 whitespace-pre-wrap text-sm">
                          {selectedEnrollment.adminNotes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-admin-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedEnrollment(null);
                  }}
                  className="px-4 py-2 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default EnrollmentManagement;
