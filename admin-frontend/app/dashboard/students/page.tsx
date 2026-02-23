"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Modal from "../../components/Modal";
import { enrollmentApi, Student } from "@/lib/api";
import { formatDate } from "@/lib/utils/formatters";
import toast from "react-hot-toast";
import {
  Search,
  Eye,
  Users,
  UserCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  GraduationCap,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

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

const StudentsPage = () => {
  // Data state
  const [students, setStudents] = useState<Student[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch students
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        page: currentPage,
      };
      if (debouncedSearch) params.search = debouncedSearch;

      const response = await enrollmentApi.getAllStudents(params);
      setStudents(response.data || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.currentPage || 1);
    } catch (error: any) {
      toast.error(error.message || "Failed to load students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const openDetailModal = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  // Loading state
  if (loading && students.length === 0) {
    return (
      <DashboardLayout title="Students">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Students">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-admin-800">Students</h2>
            <p className="text-admin-600 text-sm">
              View all students across training programs
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-admin-200 bg-admin-50">
                  <th className="text-left p-4 font-medium text-admin-600">
                    Name
                  </th>
                  <th className="text-left p-4 font-medium text-admin-600">
                    Email
                  </th>
                  <th className="text-left p-4 font-medium text-admin-600">
                    Phone
                  </th>
                  <th className="text-left p-4 font-medium text-admin-600">
                    WhatsApp
                  </th>
                  <th className="text-center p-4 font-medium text-admin-600">
                    Total Enrollments
                  </th>
                  <th className="text-center p-4 font-medium text-admin-600">
                    Approved
                  </th>
                  <th className="text-center p-4 font-medium text-admin-600">
                    Completed
                  </th>
                  <th className="text-left p-4 font-medium text-admin-600">
                    Last Enrolled
                  </th>
                  <th className="text-right p-4 font-medium text-admin-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-admin-300 mx-auto mb-3" />
                      <p className="text-admin-500 font-medium">
                        No students found
                      </p>
                      <p className="text-admin-400 text-sm mt-1">
                        Try adjusting your search query
                      </p>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b border-admin-100 hover:bg-admin-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-admin-800">
                        {student.studentName}
                      </td>
                      <td className="p-4 text-admin-600">{student.email}</td>
                      <td className="p-4 text-admin-600">{student.phone}</td>
                      <td className="p-4 text-admin-600">
                        {student.whatsappNumber || "-"}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-saffron-100 text-saffron-700">
                          {student.totalEnrollments}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          {student.approved}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {student.completed}
                        </span>
                      </td>
                      <td className="p-4 text-admin-600 whitespace-nowrap">
                        {formatDate(student.lastEnrolled)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => openDetailModal(student)}
                            className="p-1.5 text-admin-500 hover:bg-admin-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
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
                students)
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

        {/* Student Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedStudent(null);
          }}
          title="Student Details"
          size="xl"
        >
          {selectedStudent && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Student Info Header */}
              <div>
                <h4 className="text-sm font-semibold text-admin-400 uppercase tracking-wider mb-3">
                  Student Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                    <div>
                      <label className="block text-sm font-medium text-admin-500 mb-0.5">
                        Name
                      </label>
                      <p className="text-admin-800 font-medium">
                        {selectedStudent.studentName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                    <div>
                      <label className="block text-sm font-medium text-admin-500 mb-0.5">
                        Email
                      </label>
                      <p className="text-admin-800">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                    <div>
                      <label className="block text-sm font-medium text-admin-500 mb-0.5">
                        Phone
                      </label>
                      <p className="text-admin-800">{selectedStudent.phone}</p>
                    </div>
                  </div>
                  {selectedStudent.whatsappNumber && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                      <div>
                        <label className="block text-sm font-medium text-admin-500 mb-0.5">
                          WhatsApp
                        </label>
                        <p className="text-admin-800">
                          {selectedStudent.whatsappNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="border-t border-admin-200 pt-5">
                <h4 className="text-sm font-semibold text-admin-400 uppercase tracking-wider mb-3">
                  Enrollment Summary
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-saffron-50 rounded-lg p-3 text-center">
                    <div className="w-8 h-8 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                      <Users className="w-4 h-4 text-saffron-600" />
                    </div>
                    <p className="text-lg font-bold text-saffron-700">
                      {selectedStudent.totalEnrollments}
                    </p>
                    <p className="text-xs text-saffron-600">Total</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                      <UserCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-green-700">
                      {selectedStudent.approved}
                    </p>
                    <p className="text-xs text-green-600">Approved</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                      <Award className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-blue-700">
                      {selectedStudent.completed}
                    </p>
                    <p className="text-xs text-blue-600">Completed</p>
                  </div>
                </div>
              </div>

              {/* Enrollments Table */}
              <div className="border-t border-admin-200 pt-5">
                <h4 className="text-sm font-semibold text-admin-400 uppercase tracking-wider mb-3">
                  Enrollments
                </h4>
                <div className="overflow-x-auto rounded-lg border border-admin-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-admin-200 bg-admin-50">
                        <th className="text-left p-3 font-medium text-admin-600">
                          Training
                        </th>
                        <th className="text-left p-3 font-medium text-admin-600">
                          Status
                        </th>
                        <th className="text-left p-3 font-medium text-admin-600">
                          Source
                        </th>
                        <th className="text-left p-3 font-medium text-admin-600">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.enrollments.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-6 text-admin-400"
                          >
                            No enrollments found
                          </td>
                        </tr>
                      ) : (
                        selectedStudent.enrollments.map((enrollment) => (
                          <tr
                            key={enrollment._id}
                            className="border-b border-admin-100 last:border-b-0"
                          >
                            <td className="p-3 font-medium text-admin-800">
                              {enrollment.trainingId
                                ? enrollment.trainingId.title
                                : (
                                    <span className="text-admin-400 italic">
                                      Deleted Training
                                    </span>
                                  )}
                            </td>
                            <td className="p-3">
                              <span
                                className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(
                                  enrollment.status
                                )}`}
                              >
                                {enrollment.status}
                              </span>
                            </td>
                            <td className="p-3 text-admin-600">
                              {formatSource(enrollment.source)}
                            </td>
                            <td className="p-3 text-admin-600 whitespace-nowrap">
                              {formatDate(enrollment.createdAt)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-admin-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedStudent(null);
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

export default StudentsPage;
