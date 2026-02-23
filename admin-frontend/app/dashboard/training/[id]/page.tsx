"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import {
  ArrowLeft,
  Edit,
  Trash2,
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Star,
  BookOpen,
  Award,
  Globe,
  FileText,
  Video,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import { trainingApi, Training } from "@/lib/api";
import { formatDate } from "@/lib/utils/formatters";

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const renderStars = (rating: number) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= full
              ? "fill-yellow-400 text-yellow-400"
              : i === full + 1 && half
              ? "fill-yellow-200 text-yellow-400"
              : "text-admin-200"
          }`}
        />
      ))}
    </div>
  );
};

// -------------------------------------------------------------------
// Accordion for curriculum modules
// -------------------------------------------------------------------

const CurriculumAccordion = ({ modules }: { modules: NonNullable<Training["curriculum"]> }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {modules.map((mod, idx) => (
        <div key={idx} className="border border-admin-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-admin-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-saffron-100 text-saffron-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {idx + 1}
              </span>
              <div>
                <p className="font-medium text-admin-800 text-sm">{mod.title || `Module ${idx + 1}`}</p>
                {mod.duration && (
                  <p className="text-xs text-admin-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {mod.duration}
                  </p>
                )}
              </div>
            </div>
            {openIndex === idx ? (
              <ChevronUp className="w-4 h-4 text-admin-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-admin-400 flex-shrink-0" />
            )}
          </button>
          {openIndex === idx && (
            <div className="px-4 pb-4 pt-2 bg-admin-50/50 border-t border-admin-100">
              {mod.description && (
                <p className="text-sm text-admin-600 mb-3">{mod.description}</p>
              )}
              {mod.topics && mod.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {mod.topics.map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-admin-200 text-admin-700 rounded text-xs"
                    >
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// =====================================================================
// Main Component
// =====================================================================

const TrainingDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) loadTraining();
  }, [id]);

  const loadTraining = async () => {
    try {
      setLoading(true);
      const res = await trainingApi.getOne(id);
      setTraining(res.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load training");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this training program? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      await trainingApi.delete(id);
      toast.success("Training deleted successfully!");
      router.push("/dashboard/training");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete training");
      setDeleting(false);
    }
  };

  // -----------------------------------------------------------------
  // Loading
  // -----------------------------------------------------------------

  if (loading) {
    return (
      <DashboardLayout title="Training Detail">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!training) {
    return (
      <DashboardLayout title="Training Detail">
        <div className="text-center py-16">
          <GraduationCap className="w-16 h-16 text-admin-300 mx-auto mb-4" />
          <p className="text-admin-500 text-lg">Training not found</p>
          <button
            onClick={() => router.push("/dashboard/training")}
            className="mt-4 btn-primary"
          >
            Back to Training
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------

  return (
    <DashboardLayout title={training.title}>
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/training")}
            className="flex items-center gap-2 text-admin-600 hover:text-admin-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Training
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/dashboard/training/${id}/edit`)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Cover Image */}
        {training.coverImage && training.coverImage !== "no-photo.jpg" && (
          <div className="card overflow-hidden">
            <div className="w-full h-64 sm:h-80 lg:h-96 relative">
              <img
                src={training.coverImage}
                alt={training.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Title & Status */}
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-admin-900 mb-1">{training.title}</h1>
              <p className="text-admin-400 font-mono text-sm mb-4">/{training.slug}</p>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                    training.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-admin-100 text-admin-600"
                  }`}
                >
                  {training.isPublished ? "Published" : "Draft"}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                    training.isActive
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {training.isActive ? "Active" : "Inactive"}
                </span>
                {training.popular && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700">
                    Popular
                  </span>
                )}
              </div>
            </div>
            {training.rating && training.rating > 0 ? (
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  {renderStars(training.rating)}
                  <span className="text-lg font-bold text-admin-800">{training.rating.toFixed(1)}</span>
                </div>
                {training.totalReviews && (
                  <p className="text-sm text-admin-400">{training.totalReviews} reviews</p>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <BookOpen className="w-5 h-5 text-saffron-500" />, label: "Level", value: training.level },
            { icon: <Tag className="w-5 h-5 text-purple-500" />, label: "Category", value: training.category },
            { icon: <Globe className="w-5 h-5 text-blue-500" />, label: "Mode", value: training.mode },
            { icon: <Globe className="w-5 h-5 text-teal-500" />, label: "Language", value: training.language },
            { icon: <Clock className="w-5 h-5 text-orange-500" />, label: "Duration", value: training.duration },
            {
              icon: <DollarSign className="w-5 h-5 text-green-500" />,
              label: "Price",
              value: (
                <div>
                  <span className="font-semibold text-admin-800">{formatPrice(training.price)}</span>
                  {training.originalPrice && training.originalPrice > training.price && (
                    <span className="ml-2 text-sm text-admin-400 line-through">
                      {formatPrice(training.originalPrice)}
                    </span>
                  )}
                </div>
              ),
            },
            { icon: <MapPin className="w-5 h-5 text-red-500" />, label: "Location", value: training.location },
            {
              icon: <Calendar className="w-5 h-5 text-indigo-500" />,
              label: "Start Date",
              value: training.startDate ? formatDate(training.startDate) : null,
            },
            {
              icon: <Calendar className="w-5 h-5 text-pink-500" />,
              label: "End Date",
              value: training.endDate ? formatDate(training.endDate) : null,
            },
            {
              icon: <Users className="w-5 h-5 text-cyan-500" />,
              label: "Participants",
              value: training.maxParticipants
                ? `${training.currentEnrollments || 0} / ${training.maxParticipants}`
                : "Unlimited",
            },
          ]
            .filter((item) => item.value)
            .map((item, idx) => (
              <div key={idx} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-xs text-admin-400 font-medium uppercase tracking-wide mb-0.5">
                      {item.label}
                    </p>
                    <div className="text-sm text-admin-800">
                      {typeof item.value === "string" ? item.value : item.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Description */}
        {training.description && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-admin-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-saffron-500" />
              Description
            </h2>
            <p className="text-admin-600 leading-relaxed">{training.description}</p>
          </div>
        )}

        {/* About Program */}
        {training.aboutProgram && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-admin-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-saffron-500" />
              About Program
            </h2>
            <div
              className="prose prose-sm max-w-none text-admin-600"
              dangerouslySetInnerHTML={{ __html: training.aboutProgram }}
            />
          </div>
        )}

        {/* Instructor */}
        {training.instructor && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-admin-800 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-saffron-500" />
              Instructor
            </h2>
            <div className="flex items-start gap-4">
              {training.instructorImage && training.instructorImage !== "no-photo.jpg" && (
                <img
                  src={training.instructorImage}
                  alt={training.instructor}
                  className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-2 border-admin-100"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-admin-800 text-base">{training.instructor}</h3>
                {training.instructorDesignation && (
                  <p className="text-saffron-600 text-sm mt-0.5">{training.instructorDesignation}</p>
                )}
                {training.instructorBio && (
                  <p className="text-admin-600 text-sm mt-2 leading-relaxed">{training.instructorBio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Features & Topics */}
        {((training.features && training.features.length > 0) ||
          (training.topics && training.topics.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {training.features && training.features.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-admin-800 mb-3">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {training.features.map((f, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron-50 text-saffron-700 border border-saffron-200 rounded-full text-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {training.topics && training.topics.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-admin-800 mb-3">Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {training.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Curriculum */}
        {training.curriculum && training.curriculum.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-admin-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-saffron-500" />
              Curriculum ({training.curriculum.length} modules)
            </h2>
            <CurriculumAccordion modules={training.curriculum} />
          </div>
        )}

        {/* Gallery Images */}
        {training.galleryImages && training.galleryImages.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-admin-800 mb-4">
              Gallery ({training.galleryImages.length} images)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {training.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-lg overflow-hidden bg-admin-100 border border-admin-200"
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practical Exposure */}
        {training.practicalExposure &&
          (training.practicalExposure.title || training.practicalExposure.points?.length > 0) && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-admin-800 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-saffron-500" />
                Practical Exposure
              </h2>
              {training.practicalExposure.title && (
                <h3 className="font-medium text-admin-700 mb-2">{training.practicalExposure.title}</h3>
              )}
              {training.practicalExposure.description && (
                <p className="text-admin-600 text-sm mb-4">{training.practicalExposure.description}</p>
              )}
              {training.practicalExposure.points && training.practicalExposure.points.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {training.practicalExposure.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-admin-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              {training.practicalExposure.images && training.practicalExposure.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {training.practicalExposure.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden bg-admin-100 border border-admin-200"
                    >
                      <img src={img} alt={`Practical ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        {/* Testimonials */}
        {training.testimonials && training.testimonials.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-admin-800 mb-4">
              Testimonials ({training.testimonials.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {training.testimonials.map((t, idx) => (
                <div key={idx} className="border border-admin-200 rounded-lg p-4 bg-admin-50/30">
                  <div className="flex items-start gap-3 mb-3">
                    {t.image && t.image !== "no-photo.jpg" ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-saffron-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-saffron-600 font-bold text-lg">
                          {t.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-admin-800">{t.name}</p>
                      {t.city && <p className="text-sm text-admin-400">{t.city}</p>}
                      {t.rating && renderStars(t.rating)}
                    </div>
                  </div>
                  {t.review && <p className="text-sm text-admin-600 italic">&ldquo;{t.review}&rdquo;</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {training.faq && training.faq.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-admin-800 mb-4">
              FAQ ({training.faq.length} questions)
            </h2>
            <div className="space-y-4">
              {training.faq.map((item, idx) => (
                <div key={idx} className="border border-admin-200 rounded-lg p-4">
                  <p className="font-medium text-admin-800 mb-2">Q: {item.question}</p>
                  <p className="text-admin-600 text-sm">A: {item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO */}
        {(training.seoTitle || training.seoDescription || (training.seoKeywords?.length ?? 0) > 0) && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-admin-800 mb-4">SEO</h2>
            <div className="space-y-3">
              {training.seoTitle && (
                <div>
                  <p className="text-xs font-medium text-admin-400 uppercase tracking-wide mb-1">
                    SEO Title
                  </p>
                  <p className="text-admin-700">{training.seoTitle}</p>
                </div>
              )}
              {training.seoDescription && (
                <div>
                  <p className="text-xs font-medium text-admin-400 uppercase tracking-wide mb-1">
                    Meta Description
                  </p>
                  <p className="text-admin-700 text-sm">{training.seoDescription}</p>
                </div>
              )}
              {training.seoKeywords && training.seoKeywords.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-admin-400 uppercase tracking-wide mb-2">
                    Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {training.seoKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-admin-100 text-admin-600 rounded-full text-xs"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Certification */}
        {(training.certificationTitle || training.certificationDescription) && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-admin-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-saffron-500" />
              Certification
            </h2>
            <div className="flex items-start gap-4">
              {training.certificationImage && (
                <img
                  src={training.certificationImage}
                  alt="Certification"
                  className="w-24 h-24 object-contain rounded-lg border border-admin-200 flex-shrink-0"
                />
              )}
              <div>
                {training.certificationTitle && (
                  <h3 className="font-semibold text-admin-800 mb-1">{training.certificationTitle}</h3>
                )}
                {training.certificationDescription && (
                  <p className="text-admin-600 text-sm">{training.certificationDescription}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Media Links */}
        {(training.brochureUrl || training.facilityVideoUrl) && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-admin-800 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-saffron-500" />
              Media & Links
            </h2>
            <div className="flex flex-wrap gap-4">
              {training.brochureUrl && (
                <a
                  href={training.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-admin-100 hover:bg-admin-200 text-admin-700 rounded-lg transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  View Brochure
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {training.facilityVideoUrl && (
                <a
                  href={training.facilityVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-sm"
                >
                  <Video className="w-4 h-4" />
                  Watch Facility Video
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="card p-4">
          <p className="text-xs text-admin-400">
            Created: {training.createdAt ? formatDate(training.createdAt) : "—"}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrainingDetailPage;
