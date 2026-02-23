"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import ImageUpload from "../../../components/ImageUpload";
import RichTextEditor from "../../../components/RichTextEditor";
import {
  Plus, Trash2, ChevronRight, BookOpen, FileText,
  Image as ImageIcon, Settings, GraduationCap, Video,
  MessageSquare, HelpCircle, Award, X, Loader2,
  Info, CheckCircle2, Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  trainingApi, CurriculumModule, TrainingFAQ,
  TrainingTestimonial, PracticalExposure,
} from "@/lib/api";

// ─────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────

type TabKey = "basic" | "media" | "settings";
type SaveMode = "draft" | "publish";

interface TabDef { key: TabKey; label: string; icon: React.ReactNode; }
interface Errors { [key: string]: string; }

const TABS: TabDef[] = [
  { key: "basic", label: "Basic Info", icon: <FileText className="w-4 h-4" /> },
  { key: "media", label: "Media & Content", icon: <ImageIcon className="w-4 h-4" /> },
  { key: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

const CATEGORIES = ["Saffron Cultivation", "Advanced Techniques", "Business & Marketing", "R&D", "Custom"];
const MODES = ["Offline", "Online", "Hybrid"];
const DISCOUNT_TYPES = ["Percentage (%)", "Fixed Amount (₹)"];

// Today string for date min constraint
const todayStr = () => new Date().toISOString().split("T")[0];

// Auto-slug helper
const toSlug = (str: string) =>
  str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

// ─────────────────────────────────────────────────────────────────────
// Default Form State
// ─────────────────────────────────────────────────────────────────────

const defaultFormData = () => ({
  title: "", slug: "", description: "", content: "", aboutProgram: "",
  category: "", mode: "", language: "", duration: "",
  price: 0, discountType: "Percentage (%)", discountValue: 0,
  features: [] as string[], coverImage: "", icon: "",
  popular: false, isActive: true, isPublished: false, maxParticipants: 0,
  startDate: "", endDate: "", instructor: "", instructorBio: "", instructorImage: "",
  instructorDesignation: "", location: "", topics: [] as string[],
  curriculum: [] as CurriculumModule[], rating: 0, totalReviews: 0,
  certificationTitle: "", certificationDescription: "", certificationImage: "",
  faq: [] as TrainingFAQ[], testimonials: [] as TrainingTestimonial[],
  brochureUrl: "", facilityVideoUrl: "",
});

type FormData = ReturnType<typeof defaultFormData>;

// Final price calculator
const calcFinalPrice = (price: number, type: string, val: number) => {
  if (!val || val <= 0) return price;
  if (type === "Percentage (%)") return Math.max(0, price - price * (val / 100));
  return Math.max(0, price - val);
};

// ─────────────────────────────────────────────────────────────────────
// Tooltip helper
// ─────────────────────────────────────────────────────────────────────

const Tooltip = ({ text }: { text: string }) => (
  <span className="group relative inline-flex items-center ml-1.5 cursor-help">
    <Info className="w-3.5 h-3.5 text-admin-400" />
    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 w-52 rounded-lg bg-admin-800 text-white text-xs p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
      {text}
    </span>
  </span>
);

// ─────────────────────────────────────────────────────────────────────
// Toggle switch
// ─────────────────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange, label, color = "saffron" }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; color?: string;
}) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? `bg-${color}-500` : "bg-admin-200"}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </div>
    <span className="text-sm font-medium text-admin-700 group-hover:text-admin-900 transition-colors">{label}</span>
  </label>
);

// ─────────────────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────────────────

const Section = ({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-admin-200 overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-3 bg-admin-50 border-b border-admin-200">
      {icon && <span className="text-saffron-600">{icon}</span>}
      <h4 className="text-sm font-semibold text-admin-800">{title}</h4>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────
// Field label helper
// ─────────────────────────────────────────────────────────────────────

const Label = ({ children, required, tooltip }: { children: React.ReactNode; required?: boolean; tooltip?: string }) => (
  <label className="block text-sm font-medium text-admin-700 mb-1.5 flex items-center">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
    {tooltip && <Tooltip text={tooltip} />}
  </label>
);

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X className="w-3 h-3" />{msg}</p> : null;

// ─────────────────────────────────────────────────────────────────────
// CurriculumModuleCard
// ─────────────────────────────────────────────────────────────────────

const CurriculumModuleCard = ({ module, index, onUpdate, onRemove }: {
  module: CurriculumModule; index: number;
  onUpdate: (i: number, f: keyof CurriculumModule, v: string | string[]) => void;
  onRemove: (i: number) => void;
}) => {
  const [topicInput, setTopicInput] = useState("");
  return (
    <div className="border border-admin-200 rounded-xl p-4 space-y-4 bg-admin-50/30">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold text-admin-800 flex items-center gap-2">
          <span className="w-6 h-6 bg-saffron-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
          Module {index + 1}
        </h5>
        <button type="button" onClick={() => onRemove(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-admin-600 mb-1">Module Title</label>
          <input type="text" value={module.title} onChange={e => onUpdate(index, "title", e.target.value)} className="input-field text-sm" placeholder="e.g. Introduction to Saffron" />
        </div>
        <div>
          <label className="block text-xs font-medium text-admin-600 mb-1">Duration</label>
          <input type="text" value={module.duration} onChange={e => onUpdate(index, "duration", e.target.value)} className="input-field text-sm" placeholder="e.g. 2 hours" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-admin-600 mb-1">Description</label>
        <textarea rows={2} value={module.description} onChange={e => onUpdate(index, "description", e.target.value)} className="input-field text-sm" placeholder="What will be covered?" />
      </div>
      <div>
        <label className="block text-xs font-medium text-admin-600 mb-1">Topics <span className="text-admin-400 font-normal">(press Enter to add)</span></label>
        <input
          type="text" value={topicInput} onChange={e => setTopicInput(e.target.value)} className="input-field text-sm"
          placeholder="Type a topic and press Enter"
          onKeyDown={e => { if (e.key === "Enter" && topicInput.trim()) { e.preventDefault(); onUpdate(index, "topics", [...module.topics, topicInput.trim()]); setTopicInput(""); } }}
        />
        {module.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {module.topics.map((t, ti) => (
              <span key={ti} className="inline-flex items-center gap-1 px-2 py-0.5 bg-saffron-50 text-saffron-700 border border-saffron-200 rounded-full text-xs">
                {t}
                <button type="button" onClick={() => onUpdate(index, "topics", module.topics.filter((_, i) => i !== ti))} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// TagInput — must be at MODULE level so React never remounts it
// ─────────────────────────────────────────────────────────────────────

const TagInput = ({
  label, placeholder, tags, value, setValue, setTags, tooltip,
  onAddTag, onRemoveTag,
}: {
  label: string; placeholder: string; tags: string[]; value: string;
  setValue: (v: string) => void; setTags: (t: string[]) => void;
  tooltip?: string;
  onAddTag: (val: string, tags: string[], setFn: (t: string[]) => void, inputSetter: (v: string) => void) => void;
  onRemoveTag: (tags: string[], idx: number, setFn: (t: string[]) => void) => void;
}) => (
  <div>
    <Label tooltip={tooltip}>{label}</Label>
    <input
      type="text" value={value}
      onChange={e => setValue(e.target.value)}
      className="input-field"
      placeholder={placeholder}
      onKeyDown={e => {
        if (e.key === "Enter") {
          e.preventDefault();
          onAddTag(value, tags, setTags, setValue);
        }
      }}
    />
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-saffron-50 text-saffron-700 border border-saffron-200 rounded-full text-sm">
            {t}
            <button type="button" onClick={() => onRemoveTag(tags, i, setTags)} className="hover:text-red-500">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────

const AddTrainingPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(defaultFormData());
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [submitting, setSubmitting] = useState(false);
  const [saveMode, setSaveMode] = useState<SaveMode>("draft");
  const [errors, setErrors] = useState<Errors>({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string; slug: string } | null>(null);

  // Tag input values
  const [featureInput, setFeatureInput] = useState("");
  const [topicInput, setTopicInput] = useState("");

  // ── Helpers ──────────────────────────────────────────────────────

  const set = useCallback(<K extends keyof FormData>(key: K, val: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  }, [errors]);

  const handleTitleChange = (val: string) => {
    set("title", val);
    if (!slugManuallyEdited) set("slug", toSlug(val));
  };

  const handleSlugChange = (val: string) => {
    setSlugManuallyEdited(true);
    set("slug", toSlug(val));
  };

  const addTag = (val: string, tags: string[], setFn: (t: string[]) => void, inputSetter: (v: string) => void) => {
    if (!val.trim()) return;
    setFn([...tags, val.trim()]);
    inputSetter("");
  };

  const removeTag = (tags: string[], idx: number, setFn: (t: string[]) => void) =>
    setFn(tags.filter((_, i) => i !== idx));


  // FAQ helpers
  const addFaq = () => set("faq", [...formData.faq, { question: "", answer: "" }]);
  const removeFaq = (i: number) => set("faq", formData.faq.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, f: keyof TrainingFAQ, v: string) =>
    set("faq", formData.faq.map((item, idx) => idx === i ? { ...item, [f]: v } : item));

  // Testimonial helpers
  const addTestimonial = () => set("testimonials", [...formData.testimonials, { name: "", city: "", image: "", review: "", rating: 5 }]);
  const removeTestimonial = (i: number) => set("testimonials", formData.testimonials.filter((_, idx) => idx !== i));
  const updateTestimonial = (i: number, f: keyof TrainingTestimonial, v: string | number) =>
    set("testimonials", formData.testimonials.map((t, idx) => idx === i ? { ...t, [f]: v } : t));

  // ── Validation ────────────────────────────────────────────────────

  const validate = () => {
    const e: Errors = {};
    if (!formData.title.trim()) e.title = "Title is required";
    // strip HTML tags to check description isn't purely empty markup
    const descText = formData.description.replace(/<[^>]*>/g, "").trim();
    if (!descText) e.description = "Description is required";
    if (!formData.duration.trim()) e.duration = "Duration is required";
    if (!formData.price && formData.price !== 0 || formData.price < 0) e.price = "Price must be a valid number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────

  const handleSubmit = async (mode: SaveMode) => {
    if (!validate()) {
      setActiveTab("basic");
      toast.error("Please fix the errors before saving");
      return;
    }
    setSaveMode(mode);
    const payload = { ...formData, isPublished: mode === "publish", content: formData.aboutProgram || formData.description };
    setSubmitting(true);
    try {
      const res = await trainingApi.create(payload);
      setSuccessData({ id: res.data._id, slug: res.data.slug });
    } catch (error: any) {
      toast.error(error.message || "Failed to create training");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Tab Renderers ─────────────────────────────────────────────────

  const renderBasicInfoTab = () => (
    <div className="space-y-5">

      <Section title="Program Details" icon={<FileText className="w-4 h-4" />}>
        {/* Title + Slug — same row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required tooltip="The public-facing name of this training program">Training Title</Label>
            <input
              type="text" value={formData.title} onChange={e => handleTitleChange(e.target.value)}
              className={`input-field ${errors.title ? "border-red-400 focus:ring-red-300" : ""}`}
              placeholder="e.g. Indoor Saffron Farming Masterclass"
            />
            <FieldError msg={errors.title} />
          </div>

          <div>
            <Label tooltip="Auto-generated from title. Used in the page URL.">Slug (URL)</Label>
            <div className="flex items-center">
              <span className="text-xs text-admin-400 whitespace-nowrap bg-admin-50 border border-admin-200 rounded-l-lg px-3 py-2 h-10 flex items-center">/training/</span>
              <input
                type="text" value={formData.slug} onChange={e => handleSlugChange(e.target.value)}
                className="input-field rounded-l-none flex-1 font-mono text-sm"
                placeholder="auto-generated-slug"
              />
            </div>
            {!slugManuallyEdited && formData.title && (
              <p className="text-xs text-admin-400 mt-1">Auto-generated from title.</p>
            )}
          </div>
        </div>

        <div>
          <Label required tooltip="A short summary shown in listings">Description</Label>
          <RichTextEditor
            value={formData.description}
            onChange={v => set("description", v)}
            placeholder="Brief summary of the training program..."
            minHeight={100}
            className={errors.description ? "ring-1 ring-red-400" : ""}
          />
          <FieldError msg={errors.description} />
        </div>

        <div>
          <Label tooltip="Detailed program description shown on the training detail page">About Program</Label>
          <RichTextEditor
            value={formData.aboutProgram}
            onChange={v => set("aboutProgram", v)}
            placeholder="Explain what students will learn, outcomes, prerequisites..."
            minHeight={150}
          />
        </div>
      </Section>

      <Section title="Classification" icon={<Settings className="w-4 h-4" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <Label tooltip="Topic area this training belongs to">Category</Label>
            <select value={formData.category} onChange={e => set("category", e.target.value)} className="input-field">
              <option value="">Select</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label tooltip="How the training is delivered">Mode</Label>
            <select value={formData.mode} onChange={e => set("mode", e.target.value)} className="input-field">
              <option value="">Select</option>
              {MODES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <Label tooltip="Primary language of instruction">Language</Label>
            <input type="text" value={formData.language} onChange={e => set("language", e.target.value)} className="input-field" placeholder="e.g. Hindi" />
          </div>
        </div>
      </Section>

      <Section title="Status & Visibility" icon={<Eye className="w-4 h-4" />}>
        <div className="flex flex-wrap gap-6">
          <Toggle checked={formData.isActive} onChange={v => set("isActive", v)} label="Active" />
          <Toggle checked={formData.popular} onChange={v => set("popular", v)} label="Mark as Popular" color="yellow" />
        </div>
        <p className="text-xs text-admin-400">Published status is set when you click "Save Draft" or "Publish" below.</p>
      </Section>

      <Section title="Instructor" icon={<GraduationCap className="w-4 h-4" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Instructor Name</Label>
            <input type="text" value={formData.instructor} onChange={e => set("instructor", e.target.value)} className="input-field" placeholder="Full name" />
          </div>
          <div>
            <Label tooltip="e.g. Senior Saffron Researcher">Designation</Label>
            <input type="text" value={formData.instructorDesignation} onChange={e => set("instructorDesignation", e.target.value)} className="input-field" placeholder="e.g. Senior Saffron Researcher" />
          </div>
          <div className="sm:col-span-2">
            <Label>Instructor Bio</Label>
            <RichTextEditor
              value={formData.instructorBio}
              onChange={v => set("instructorBio", v)}
              placeholder="Short biography about the instructor..."
              minHeight={80}
            />
          </div>
        </div>
        {/* Small instructor photo upload */}
        <div>
          <Label>Instructor Photo</Label>
          <div className="flex items-center gap-4">
            {formData.instructorImage ? (
              <div className="relative flex-shrink-0">
                <img src={formData.instructorImage} alt="Instructor" className="w-16 h-16 rounded-full object-cover border-2 border-admin-200" />
                <button type="button" onClick={() => set("instructorImage", "")}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-admin-100 border-2 border-dashed border-admin-300 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-admin-400" />
              </div>
            )}
            <ImageUpload value={formData.instructorImage} onChange={v => set("instructorImage", v as string)} label="" multiple={false} className="flex-1" />
          </div>
        </div>
      </Section>
    </div>
  );

  // FAQ section renderer (used in Media tab)
  const renderFaqSection = () => (
    <div className="bg-white border border-admin-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-admin-50 border-b border-admin-200">
        <div className="flex items-center gap-2 text-admin-800">
          <HelpCircle className="w-4 h-4 text-saffron-600" />
          <h4 className="text-sm font-semibold">FAQ ({formData.faq.length})</h4>
        </div>
        <button type="button" onClick={addFaq} className="text-sm text-saffron-600 hover:text-saffron-700 font-medium flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>
      <div className="p-5 space-y-3">
        {formData.faq.length === 0 ? (
          <p className="text-admin-400 text-sm text-center py-4">No FAQ items added yet.</p>
        ) : formData.faq.map((item, i) => (
          <div key={i} className="border border-admin-200 rounded-lg p-4 space-y-3 bg-admin-50/30">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-admin-600 uppercase tracking-wide">FAQ #{i + 1}</span>
              <button type="button" onClick={() => removeFaq(i)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <input type="text" value={item.question} onChange={e => updateFaq(i, "question", e.target.value)} className="input-field text-sm" placeholder="Question" />
              <textarea rows={2} value={item.answer} onChange={e => updateFaq(i, "answer", e.target.value)} className="input-field text-sm" placeholder="Answer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMediaTab = () => (
    <div className="space-y-5">
      <Section title="Cover Image" icon={<ImageIcon className="w-4 h-4" />}>
        <p className="text-xs text-admin-400 -mt-1">Main thumbnail shown in listings. Recommended: 16:9, min 800×450px.</p>
        <ImageUpload value={formData.coverImage} onChange={v => set("coverImage", v as string)} label="" multiple={false} />
      </Section>

      <Section title="External Links" icon={<Video className="w-4 h-4" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label tooltip="PDF brochure link for download">Brochure URL</Label>
            <input type="url" value={formData.brochureUrl} onChange={e => set("brochureUrl", e.target.value)} className="input-field" placeholder="https://example.com/brochure.pdf" />
          </div>
          <div>
            <Label tooltip="YouTube or Vimeo link for a facility tour">Facility Video URL</Label>
            <input type="url" value={formData.facilityVideoUrl} onChange={e => set("facilityVideoUrl", e.target.value)} className="input-field" placeholder="https://youtube.com/watch?v=..." />
          </div>
        </div>
      </Section>

      <Section title="Testimonials" icon={<MessageSquare className="w-4 h-4" />}>
        <div className="flex justify-end">
          <button type="button" onClick={addTestimonial} className="text-sm text-saffron-600 hover:text-saffron-700 font-medium flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>
        {formData.testimonials.length === 0 ? (
          <p className="text-admin-400 text-sm text-center py-4">No testimonials added yet.</p>
        ) : formData.testimonials.map((t, i) => (
          <div key={i} className="border border-admin-200 rounded-lg p-4 space-y-3 bg-admin-50/30">
            <div className="flex justify-between">
              <span className="text-xs font-semibold text-admin-600 uppercase tracking-wide">Testimonial #{i + 1}</span>
              <button type="button" onClick={() => removeTestimonial(i)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input type="text" value={t.name} onChange={e => updateTestimonial(i, "name", e.target.value)} className="input-field text-sm" placeholder="Name" />
              <input type="text" value={t.city} onChange={e => updateTestimonial(i, "city", e.target.value)} className="input-field text-sm" placeholder="City" />
              <select value={t.rating} onChange={e => updateTestimonial(i, "rating", parseInt(e.target.value))} className="input-field text-sm">
                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <textarea rows={2} value={t.review} onChange={e => updateTestimonial(i, "review", e.target.value)} className="input-field text-sm" placeholder="Review text" />
            <ImageUpload value={t.image} onChange={v => updateTestimonial(i, "image", v as string)} label="Person Photo" multiple={false} />
          </div>
        ))}
      </Section>

      {/* FAQ moved here from Curriculum tab */}
      {renderFaqSection()}
    </div>
  );

  const renderSettingsTab = () => {
    const finalPrice = calcFinalPrice(formData.price, formData.discountType, formData.discountValue);
    const today = todayStr();
    return (
      <div className="space-y-5">
        <Section title="Pricing" icon={<Settings className="w-4 h-4" />}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label required tooltip="Base price in Indian Rupees (₹)">Price (₹)</Label>
              <input type="number" min="0" value={formData.price}
                onChange={e => set("price", parseFloat(e.target.value) || 0)}
                className={`input-field ${errors.price ? "border-red-400" : ""}`} />
              <FieldError msg={errors.price} />
            </div>
            <div>
              <Label tooltip="Choose percentage or fixed amount off">Discount Type</Label>
              <select value={formData.discountType} onChange={e => set("discountType", e.target.value)} className="input-field">
                {DISCOUNT_TYPES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <Label tooltip="Enter 0 to disable discount">Discount Value</Label>
              <input type="number" min="0" value={formData.discountValue}
                onChange={e => set("discountValue", parseFloat(e.target.value) || 0)}
                className="input-field" placeholder="0" />
            </div>
            <div>
              <Label tooltip="Auto-calculated based on price and discount">Final Price (₹)</Label>
              <div className="input-field bg-green-50 border-green-200 text-green-800 font-semibold flex items-center">
                ₹{finalPrice.toFixed(2)}
                {formData.discountValue > 0 && (
                  <span className="ml-2 text-xs text-green-600 font-normal">
                    ({formData.discountType === "Percentage (%)" ? `${formData.discountValue}% off` : `₹${formData.discountValue} off`})
                  </span>
                )}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Schedule" icon={<Settings className="w-4 h-4" />}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label required tooltip="e.g. 2 Weeks, 3 Days, 6 Hours">Duration</Label>
              <input type="text" value={formData.duration} onChange={e => set("duration", e.target.value)}
                className={`input-field ${errors.duration ? "border-red-400" : ""}`} placeholder="e.g. 2 Weeks" />
              <FieldError msg={errors.duration} />
            </div>
            <div>
              <Label tooltip="Leave 0 for unlimited seats">Max Participants</Label>
              <input type="number" min="0" value={formData.maxParticipants} onChange={e => set("maxParticipants", parseInt(e.target.value) || 0)} className="input-field" />
            </div>
            <div>
              <Label>Start Date</Label>
              <input type="date" value={formData.startDate} min={today}
                onChange={e => {
                  set("startDate", e.target.value);
                  if (formData.endDate && e.target.value > formData.endDate) set("endDate", "");
                }} className="input-field" />
            </div>
            <div>
              <Label>End Date</Label>
              <input type="date" value={formData.endDate}
                min={formData.startDate || today}
                onChange={e => set("endDate", e.target.value)} className="input-field" />
              {formData.startDate && formData.endDate && formData.endDate < formData.startDate && (
                <p className="text-xs text-red-500 mt-1">End date cannot be before start date</p>
              )}
            </div>
          </div>
          <div>
            <Label tooltip="Physical location for offline/hybrid trainings">Location</Label>
            <input type="text" value={formData.location} onChange={e => set("location", e.target.value)} className="input-field" placeholder="e.g. Pampore, Kashmir" />
          </div>
        </Section>

        <Section title="Features & Topics" icon={<Award className="w-4 h-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <TagInput label="Key Features" placeholder="e.g. Certificate included (press Enter)" tooltip="Bullet points shown on the program card"
                tags={formData.features} value={featureInput} setValue={setFeatureInput}
                setTags={t => set("features", t)}
                onAddTag={addTag} onRemoveTag={removeTag} />
            </div>
            <div>
              <TagInput label="Topics Covered" placeholder="e.g. Harvesting techniques (press Enter)"
                tags={formData.topics} value={topicInput} setValue={setTopicInput}
                setTags={t => set("topics", t)}
                onAddTag={addTag} onRemoveTag={removeTag} />
            </div>
          </div>
        </Section>

        <Section title="Certification" icon={<Award className="w-4 h-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Certificate Title</Label>
              <input type="text" value={formData.certificationTitle} onChange={e => set("certificationTitle", e.target.value)} className="input-field" placeholder="e.g. Certificate of Completion" />
            </div>
            <div className="sm:col-span-2">
              <Label>Certificate Description</Label>
              <RichTextEditor
                value={formData.certificationDescription}
                onChange={v => set("certificationDescription", v)}
                placeholder="Describe what this certificate represents..."
                minHeight={80}
              />
            </div>
            <div className="sm:col-span-2">
              <ImageUpload value={formData.certificationImage} onChange={v => set("certificationImage", v as string)} label="Certificate Image" multiple={false} />
            </div>
          </div>
        </Section>

        <Section title="Ratings (Manual seed)" icon={<Settings className="w-4 h-4" />}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label tooltip="Displayed rating (0–5)">Rating</Label>
              <input type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={e => set("rating", parseFloat(e.target.value) || 0)} className="input-field" />
            </div>
            <div>
              <Label>Total Reviews</Label>
              <input type="number" min="0" value={formData.totalReviews} onChange={e => set("totalReviews", parseInt(e.target.value) || 0)} className="input-field" />
            </div>
          </div>
        </Section>
      </div>
    );
  };

  const currentTabIdx = TABS.findIndex(t => t.key === activeTab);

  // ── Success Overlay ───────────────────────────────────────────────

  if (successData) {
    return (
      <DashboardLayout title="Training Created">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl border border-admin-200 shadow-xl p-10 max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-admin-800">Training {saveMode === "publish" ? "Published" : "Saved as Draft"}!</h2>
              <p className="text-admin-500 text-sm mt-1">
                {saveMode === "publish"
                  ? "Your training program is now live on the website."
                  : "Your training has been saved as a draft. Publish it when ready."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`/training/${successData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-saffron-300 text-saffron-700 rounded-xl hover:bg-saffron-50 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" /> View Page
              </a>
              <button
                onClick={() => { setFormData(defaultFormData()); setSlugManuallyEdited(false); setSuccessData(null); setActiveTab("basic"); }}
                className="flex-1 px-4 py-2.5 bg-saffron-500 text-white rounded-xl hover:bg-saffron-600 transition-colors text-sm font-medium"
              >
                + Add Another
              </button>
            </div>
            <button onClick={() => router.push("/dashboard/training")} className="text-sm text-admin-400 hover:text-admin-600 transition-colors">
              ← Back to Training List
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Main Render ───────────────────────────────────────────────────

  return (
    <DashboardLayout title="Add Training Program">
      <form onSubmit={e => { e.preventDefault(); handleSubmit(saveMode); }} className="space-y-0">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-admin-800">New Training Program</h2>
            <p className="text-admin-400 text-sm mt-0.5">Fill in the details below and publish when ready</p>
          </div>
          <button type="button" onClick={() => router.push("/dashboard/training")} className="text-sm text-admin-500 hover:text-admin-700 flex items-center gap-1">
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>

        {/* Tab bar */}
        <div className="bg-white border border-admin-200 rounded-xl overflow-hidden">
          <div className="flex overflow-x-auto border-b border-admin-200">
            {TABS.map((tab, idx) => (
              <button
                key={tab.key} type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
                  ? "border-saffron-500 text-saffron-700 bg-saffron-50/40"
                  : "border-transparent text-admin-500 hover:text-admin-700 hover:border-admin-300"
                  }`}
              >
                {tab.icon}{tab.label}
                {idx < currentTabIdx && <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-1" />}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === "basic" && renderBasicInfoTab()}
            {activeTab === "media" && renderMediaTab()}
            {activeTab === "settings" && renderSettingsTab()}
          </div>
        </div>

        {/* Sticky bottom action bar */}
        <div className="sticky bottom-0 left-0 right-0 z-30 mt-0">
          <div className="bg-white border-t border-admin-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Prev / Next navigation */}
            <div className="flex items-center gap-2">
              {currentTabIdx > 0 && (
                <button type="button" onClick={() => setActiveTab(TABS[currentTabIdx - 1].key)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-admin-600 hover:bg-admin-100 rounded-lg transition-colors">
                  <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                </button>
              )}
              {currentTabIdx < TABS.length - 1 && (
                <button type="button" onClick={() => setActiveTab(TABS[currentTabIdx + 1].key)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-admin-600 hover:bg-admin-100 rounded-lg transition-colors">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {/* Status badge */}
              <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${formData.isPublished ? "bg-green-100 text-green-700" : "bg-admin-100 text-admin-600"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${formData.isPublished ? "bg-green-500" : "bg-admin-400"}`} />
                {formData.isPublished ? "Published" : "Draft"}
              </span>

              <button
                type="button" disabled={submitting}
                onClick={() => handleSubmit("draft")}
                className="px-5 py-2 text-sm font-medium border border-admin-300 text-admin-700 rounded-xl hover:bg-admin-50 disabled:opacity-50 transition-colors"
              >
                {submitting && saveMode === "draft" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Draft"}
              </button>

              <button
                type="button" disabled={submitting}
                onClick={() => handleSubmit("publish")}
                className="btn-primary px-6 py-2 text-sm font-medium rounded-xl disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && saveMode === "publish" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                ) : "Publish"}
              </button>
            </div>
          </div>
        </div>

      </form>
    </DashboardLayout>
  );
};

export default AddTrainingPage;
