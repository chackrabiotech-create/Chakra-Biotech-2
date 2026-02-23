"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/DashboardLayout";
import TrainingPageSettingsPanel from "../../components/TrainingPageSettingsPanel";
import {
  Plus, Edit, Trash2, Search, Users, BookOpen, Clock,
  GraduationCap, TrendingUp, Eye, List, Settings2,
} from "lucide-react";
import toast from "react-hot-toast";
import { trainingApi, Training } from "@/lib/api";
import { formatDate } from "@/lib/utils/formatters";

const CATEGORIES = ["Saffron Cultivation", "Advanced Techniques", "Business & Marketing", "R&D", "Custom"];
const MODES = ["Offline", "Online", "Hybrid"];

interface Stats {
  totalTrainings: number;
  activeTrainings: number;
  totalEnrollments: number;
  pendingEnrollments: number;
}

type MainTab = "programs" | "page-settings";

const TrainingManagement = () => {
  const router = useRouter();
  const [mainTab, setMainTab] = useState<MainTab>("programs");

  // ── Programs state ────────────────────────────────────────────────
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalTrainings: 0, activeTrainings: 0,
    totalEnrollments: 0, pendingEnrollments: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMode, setFilterMode] = useState("All");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [trainingsRes, statsRes] = await Promise.all([
        trainingApi.getAll(), trainingApi.getStats(),
      ]);
      setTrainings(trainingsRes.data || []);
      if (statsRes.data) setStats(statsRes.data);
    } catch {
      toast.error("Failed to load trainings");
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = trainings.filter(t => {
    const q = searchTerm.toLowerCase();
    return (
      (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) &&
      (filterCategory === "All" || t.category === filterCategory) &&
      (filterMode === "All" || t.mode === filterMode)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this training program?")) return;
    try {
      await trainingApi.delete(id);
      toast.success("Deleted successfully!");
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  // ── Top tabs ──────────────────────────────────────────────────────
  const MAIN_TABS = [
    { id: "programs" as MainTab, label: "Programs", icon: List },
    { id: "page-settings" as MainTab, label: "Page Settings", icon: Settings2 },
  ];

  return (
    <DashboardLayout title="Training Management">
      <div className="space-y-5">

        {/* ── Top tab bar + Add button ────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex bg-admin-100 rounded-xl p-1 gap-1">
            {MAIN_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMainTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mainTab === tab.id
                    ? "bg-white text-saffron-600 shadow-sm"
                    : "text-admin-500 hover:text-admin-700"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {mainTab === "programs" && (
            <button onClick={() => router.push("/dashboard/training/add")} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /><span>Add Training</span>
            </button>
          )}
        </div>

        {/* ── Programs tab ────────────────────────────────────────── */}
        {mainTab === "programs" && (
          <div className="space-y-5">
            {/* Page sub-heading */}
            <div>
              <h2 className="text-xl font-semibold text-admin-800">Manage Training Programs</h2>
              <p className="text-admin-500 text-sm">Create and manage saffron cultivation training courses</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Programs", value: stats.totalTrainings, icon: BookOpen, color: "text-saffron-500" },
                { label: "Active", value: stats.activeTrainings, icon: TrendingUp, color: "text-green-500" },
                { label: "Enrollments", value: stats.totalEnrollments, icon: Users, color: "text-blue-500" },
                { label: "Pending", value: stats.pendingEnrollments, icon: Clock, color: "text-yellow-500" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-admin-500 text-sm">{label}</p>
                      <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${color}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="card p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-400 w-4 h-4" />
                  <input
                    type="text" placeholder="Search programs…" value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)} className="pl-10 input-field"
                  />
                </div>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="input-field md:w-44">
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={filterMode} onChange={e => setFilterMode(e.target.value)} className="input-field md:w-32">
                  <option value="All">All Modes</option>
                  {MODES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {/* Table / empty state */}
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-saffron-500" />
              </div>
            ) : filteredTrainings.length > 0 ? (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-admin-50 border-b border-admin-200">
                        {["Image", "Title", "Category", "Price", "Seats", "Status", "Created", "Actions"].map(h => (
                          <th key={h} className={`px-4 py-3 text-xs font-semibold text-admin-600 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-100">
                      {filteredTrainings.map((training, idx) => (
                        <motion.tr key={training._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="hover:bg-admin-50/50 transition-colors">
                          {/* Thumbnail */}
                          <td className="px-4 py-3">
                            <div className="w-14 h-10 rounded-lg overflow-hidden bg-admin-100 flex-shrink-0 cursor-pointer" onClick={() => router.push(`/dashboard/training/${training._id}`)}>
                              {training.coverImage && training.coverImage !== "no-photo.jpg"
                                ? <img src={training.coverImage} alt={training.title} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center"><GraduationCap className="w-4 h-4 text-admin-300" /></div>
                              }
                            </div>
                          </td>
                          {/* Title */}
                          <td className="px-4 py-3">
                            <p className="font-medium text-admin-800 text-sm truncate max-w-[180px] cursor-pointer hover:text-saffron-600 transition-colors" onClick={() => router.push(`/dashboard/training/${training._id}`)}>{training.title}</p>
                            <p className="text-xs text-admin-400 font-mono truncate max-w-[180px]">/{training.slug}</p>
                          </td>
                          {/* Category */}
                          <td className="px-4 py-3">
                            {training.category
                              ? <span className="px-2 py-0.5 bg-saffron-50 text-saffron-700 text-xs rounded-full whitespace-nowrap">{training.category}</span>
                              : <span className="text-xs text-admin-400">—</span>
                            }
                          </td>
                          {/* Price */}
                          <td className="px-4 py-3">
                            <div className="font-semibold text-admin-800 text-sm whitespace-nowrap">₹{training.price?.toLocaleString()}</div>
                            {training.originalPrice && training.originalPrice > training.price && (
                              <div className="text-xs text-admin-400 line-through">₹{training.originalPrice.toLocaleString()}</div>
                            )}
                          </td>
                          {/* Seats */}
                          <td className="px-4 py-3">
                            <span className="text-sm text-admin-600 whitespace-nowrap">
                              {training.maxParticipants ? `${training.currentEnrollments || 0}/${training.maxParticipants}` : "Unlimited"}
                            </span>
                          </td>
                          {/* Status */}
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full w-fit ${training.isPublished ? "bg-green-100 text-green-700" : "bg-admin-100 text-admin-600"}`}>
                                {training.isPublished ? "Published" : "Draft"}
                              </span>
                              {!training.isActive && <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full w-fit bg-red-100 text-red-700">Inactive</span>}
                              {training.popular && <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full w-fit bg-yellow-100 text-yellow-700">Popular</span>}
                            </div>
                          </td>
                          {/* Created */}
                          <td className="px-4 py-3"><span className="text-xs text-admin-400 whitespace-nowrap">{training.createdAt ? formatDate(training.createdAt) : "—"}</span></td>
                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => router.push(`/dashboard/training/${training._id}`)} className="p-1.5 text-admin-600 hover:bg-admin-100 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                              <button onClick={() => router.push(`/dashboard/training/${training._id}/edit`)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(training._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2 border-t border-admin-100 bg-admin-50/50">
                  <p className="text-xs text-admin-500">Showing {filteredTrainings.length} of {trainings.length} programs</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <GraduationCap className="w-14 h-14 text-admin-300 mx-auto mb-3" />
                <p className="text-admin-500 text-base mb-1">No training programs found</p>
                <p className="text-admin-400 text-sm">
                  {searchTerm || filterCategory !== "All" || filterMode !== "All"
                    ? "Try adjusting your filters"
                    : 'Click "Add Training" to create your first program'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Page Settings tab ───────────────────────────────────── */}
        {mainTab === "page-settings" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-admin-800">Training Page Content</h2>
              <p className="text-admin-500 text-sm">Manage hero section, modules, testimonials, and all public-facing content</p>
            </div>
            <TrainingPageSettingsPanel />
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default TrainingManagement;
