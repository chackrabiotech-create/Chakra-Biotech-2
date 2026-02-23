"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "../../../../components/DashboardLayout";
import ImageUpload from "../../../../components/ImageUpload";
import RichTextEditor from "../../../../components/RichTextEditor";
import {
  Plus, Trash2, ChevronRight, FileText,
  Image as ImageIcon, Settings, GraduationCap, Video,
  MessageSquare, HelpCircle, Award, X, Loader2,
  Info, CheckCircle2, Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  trainingApi, Training, CurriculumModule, TrainingFAQ,
  TrainingTestimonial,
} from "@/lib/api";

// ─────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────

type TabKey = "basic" | "media" | "settings";
interface Errors { [key: string]: string; }

interface FormData {
  title: string; slug: string; description: string; content: string; aboutProgram: string;
  category: string; mode: string; language: string; duration: string;
  price: number; discountType: string; discountValue: number;
  features: string[]; coverImage: string; icon: string;
  popular: boolean; isActive: boolean; isPublished: boolean; maxParticipants: number;
  startDate: string; endDate: string; instructor: string; instructorBio: string;
  instructorImage: string; instructorDesignation: string; location: string; topics: string[];
  curriculum: CurriculumModule[]; rating: number; totalReviews: number;
  certificationTitle: string; certificationDescription: string; certificationImage: string;
  faq: TrainingFAQ[]; testimonials: TrainingTestimonial[];
  brochureUrl: string; facilityVideoUrl: string;
}

const TABS = [
  { key: "basic" as TabKey, label: "Basic Info", icon: <FileText className="w-4 h-4" /> },
  { key: "media" as TabKey, label: "Media & Content", icon: <ImageIcon className="w-4 h-4" /> },
  { key: "settings" as TabKey, label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

const CATEGORIES = ["Saffron Cultivation", "Advanced Techniques", "Business & Marketing", "R&D", "Custom"];
const MODES = ["Offline", "Online", "Hybrid"];
const DISCOUNT_TYPES = ["Percentage (%)", "Fixed Amount (₹)"];

const toSlug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
const todayStr = () => new Date().toISOString().split("T")[0];
const calcFinal = (price: number, type: string, val: number) => {
  if (!val || val <= 0) return price;
  return type === "Percentage (%)" ? Math.max(0, price - price * (val / 100)) : Math.max(0, price - val);
};

const buildFormData = (t: Training): FormData => ({
  title: t.title || "", slug: t.slug || "", description: t.description || "",
  content: t.content || "", aboutProgram: t.aboutProgram || "",
  category: t.category || "", mode: t.mode || "",
  language: t.language || "", duration: t.duration || "",
  price: t.price || 0, discountType: "Percentage (%)", discountValue: 0,
  features: t.features || [], coverImage: t.coverImage || "", icon: t.icon || "",
  popular: t.popular || false, isActive: t.isActive ?? true,
  isPublished: t.isPublished || false, maxParticipants: t.maxParticipants || 0,
  startDate: t.startDate ? t.startDate.split("T")[0] : "",
  endDate: t.endDate ? t.endDate.split("T")[0] : "",
  instructor: t.instructor || "", instructorBio: t.instructorBio || "",
  instructorImage: t.instructorImage || "", instructorDesignation: t.instructorDesignation || "",
  location: t.location || "", topics: t.topics || [], curriculum: t.curriculum || [],
  rating: t.rating || 0, totalReviews: t.totalReviews || 0,
  certificationTitle: t.certificationTitle || "", certificationDescription: t.certificationDescription || "",
  certificationImage: t.certificationImage || "", faq: t.faq || [],
  testimonials: t.testimonials || [],
  brochureUrl: t.brochureUrl || "", facilityVideoUrl: t.facilityVideoUrl || "",
});

// ─────────────────────────────────────────────────────────────────────
// Shared UI primitives
// ─────────────────────────────────────────────────────────────────────

const Tooltip = ({ text }: { text: string }) => (
  <span className="group relative inline-flex items-center ml-1.5 cursor-help">
    <Info className="w-3.5 h-3.5 text-admin-400" />
    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 w-52 rounded-lg bg-admin-800 text-white text-xs p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">{text}</span>
  </span>
);

const Toggle = ({ checked, onChange, label, color = "saffron" }: { checked: boolean; onChange: (v: boolean) => void; label: string; color?: string }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? `bg-${color}-500` : "bg-admin-200"}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </div>
    <span className="text-sm font-medium text-admin-700 group-hover:text-admin-900 transition-colors">{label}</span>
  </label>
);

const Section = ({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-admin-200 overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-3 bg-admin-50 border-b border-admin-200">
      {icon && <span className="text-saffron-600">{icon}</span>}
      <h4 className="text-sm font-semibold text-admin-800">{title}</h4>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

const Label = ({ children, required, tooltip }: { children: React.ReactNode; required?: boolean; tooltip?: string }) => (
  <label className="block text-sm font-medium text-admin-700 mb-1.5 flex items-center">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    {tooltip && <Tooltip text={tooltip} />}
  </label>
);

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X className="w-3 h-3" />{msg}</p> : null;


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

const EditTrainingPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<FormData | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Tag inputs
  const [featureInput, setFeatureInput] = useState("");
  const [topicInput, setTopicInput] = useState("");

  // ── Load ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (id) {
      trainingApi.getOne(id)
        .then(res => setFormData(buildFormData(res.data)))
        .catch(e => toast.error(e.message || "Failed to load training"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // ── Helpers ──────────────────────────────────────────────────────

  const set = useCallback(<K extends keyof FormData>(key: K, val: FormData[K]) => {
    setFormData(prev => prev ? { ...prev, [key]: val } : prev);
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  }, [errors]);

  const validate = () => {
    if (!formData) return false;
    const e: Errors = {};
    if (!formData.title.trim()) e.title = "Title is required";
    const descText = formData.description.replace(/<[^>]*>/g, "").trim();
    if (!descText) e.description = "Description is required";
    if (!formData.duration.trim()) e.duration = "Duration is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addTag = (val: string, tags: string[], setFn: (t: string[]) => void, setter: (v: string) => void) => { if (!val.trim()) return; setFn([...tags, val.trim()]); setter(""); };
  const removeTag = (tags: string[], idx: number, setFn: (t: string[]) => void) => setFn(tags.filter((_, i) => i !== idx));

  const addFaq = () => set("faq", [...(formData?.faq || []), { question: "", answer: "" }]);
  const removeFaq = (i: number) => set("faq", (formData?.faq || []).filter((_, idx) => idx !== i));
  const updateFaq = (i: number, f: keyof TrainingFAQ, v: string) =>
    set("faq", (formData?.faq || []).map((item, idx) => idx === i ? { ...item, [f]: v } : item));

  const addTestimonial = () => set("testimonials", [...(formData?.testimonials || []), { name: "", city: "", image: "", review: "", rating: 5 }]);
  const removeTestimonial = (i: number) => set("testimonials", (formData?.testimonials || []).filter((_, idx) => idx !== i));
  const updateTestimonial = (i: number, f: keyof TrainingTestimonial, v: string | number) =>
    set("testimonials", (formData?.testimonials || []).map((t, idx) => idx === i ? { ...t, [f]: v } : t));

  // ── Submit ────────────────────────────────────────────────────────

  const handleSubmit = async (publish: boolean) => {
    if (!validate() || !formData) { setActiveTab("basic"); toast.error("Please fix the errors"); return; }
    const finalPrice = calcFinal(formData.price, formData.discountType, formData.discountValue);
    const payload = { ...formData, isPublished: publish, originalPrice: formData.price, price: finalPrice, content: formData.aboutProgram || formData.description };
    setSubmitting(true);
    try {
      await trainingApi.update(id, payload);
      toast.success(publish ? "Training published!" : "Draft saved!");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      toast.error(e.message || "Failed to update training");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading / not found ───────────────────────────────────────────

  if (loading) return (
    <DashboardLayout title="Edit Training">
      <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-saffron-500" /></div>
    </DashboardLayout>
  );
  if (!formData) return (
    <DashboardLayout title="Edit Training">
      <div className="text-center py-20 text-admin-500">Training not found.</div>
    </DashboardLayout>
  );

  // ── Tab Renderers ─────────────────────────────────────────────────

  const renderBasicInfoTab = () => (
    <div className="space-y-5">
      <Section title="Program Details" icon={<FileText className="w-4 h-4" />}>
        {/* Title + Slug on same row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required tooltip="Public-facing name of this training program">Training Title</Label>
            <input type="text" value={formData.title} onChange={e => set("title", e.target.value)}
              className={`input-field ${errors.title ? "border-red-400" : ""}`} placeholder="e.g. Indoor Saffron Farming Masterclass" />
            <FieldError msg={errors.title} />
          </div>
          <div>
            <Label tooltip="Used in the page URL">Slug (URL)</Label>
            <div className="flex items-center">
              <span className="text-xs text-admin-400 whitespace-nowrap bg-admin-50 border border-admin-200 rounded-l-lg px-3 py-2 h-10 flex items-center">/training/</span>
              <input type="text" value={formData.slug} onChange={e => set("slug", toSlug(e.target.value))}
                className="input-field rounded-l-none flex-1 font-mono text-sm" placeholder="slug" />
            </div>
          </div>
        </div>

        <div>
          <Label required tooltip="Short summary shown in listings">Description</Label>
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
          <Label>About Program</Label>
          <RichTextEditor
            value={formData.aboutProgram}
            onChange={v => set("aboutProgram", v)}
            placeholder="Detailed description, outcomes, prerequisites..."
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
          <Toggle checked={formData.isPublished} onChange={v => set("isPublished", v)} label="Published" />
          <Toggle checked={formData.popular} onChange={v => set("popular", v)} label="Mark as Popular" color="yellow" />
        </div>
      </Section>

      <Section title="Instructor" icon={<GraduationCap className="w-4 h-4" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label>Instructor Name</Label><input type="text" value={formData.instructor} onChange={e => set("instructor", e.target.value)} className="input-field" placeholder="Full name" /></div>
          <div><Label>Designation</Label><input type="text" value={formData.instructorDesignation} onChange={e => set("instructorDesignation", e.target.value)} className="input-field" placeholder="e.g. Senior Researcher" /></div>
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
        {/* Small circular photo preview */}
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
            <input type="text" value={item.question} onChange={e => updateFaq(i, "question", e.target.value)} className="input-field text-sm" placeholder="Question" />
            <textarea rows={2} value={item.answer} onChange={e => updateFaq(i, "answer", e.target.value)} className="input-field text-sm" placeholder="Answer" />
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
          <div><Label tooltip="PDF brochure link">Brochure URL</Label><input type="url" value={formData.brochureUrl} onChange={e => set("brochureUrl", e.target.value)} className="input-field" placeholder="https://..." /></div>
          <div><Label tooltip="YouTube / Vimeo facility tour">Facility Video URL</Label><input type="url" value={formData.facilityVideoUrl} onChange={e => set("facilityVideoUrl", e.target.value)} className="input-field" placeholder="https://youtube.com/..." /></div>
        </div>
      </Section>

      <Section title="Testimonials" icon={<MessageSquare className="w-4 h-4" />}>
        <div className="flex justify-end">
          <button type="button" onClick={addTestimonial} className="text-sm text-saffron-600 hover:text-saffron-700 font-medium flex items-center gap-1"><Plus className="w-4 h-4" /> Add Testimonial</button>
        </div>
        {formData.testimonials.length === 0
          ? <p className="text-admin-400 text-sm text-center py-4">No testimonials yet.</p>
          : formData.testimonials.map((t, i) => (
            <div key={i} className="border border-admin-200 rounded-lg p-4 space-y-3 bg-admin-50/30">
              <div className="flex justify-between">
                <span className="text-xs font-semibold text-admin-600 uppercase tracking-wide">#{i + 1}</span>
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
          ))
        }
      </Section>

      {/* FAQ in Media tab */}
      {renderFaqSection()}
    </div>
  );

  const renderSettingsTab = () => {
    const finalPrice = calcFinal(formData.price, formData.discountType, formData.discountValue);
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
              <Label tooltip="Percentage or fixed amount">Discount Type</Label>
              <select value={formData.discountType} onChange={e => set("discountType", e.target.value)} className="input-field">
                {DISCOUNT_TYPES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <Label tooltip="0 = no discount">Discount Value</Label>
              <input type="number" min="0" value={formData.discountValue}
                onChange={e => set("discountValue", parseFloat(e.target.value) || 0)}
                className="input-field" placeholder="0" />
            </div>
            <div>
              <Label tooltip="Auto-calculated final amount">Final Price (₹)</Label>
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
              <Label required tooltip="e.g. 2 Weeks, 3 Days">Duration</Label>
              <input type="text" value={formData.duration} onChange={e => set("duration", e.target.value)}
                className={`input-field ${errors.duration ? "border-red-400" : ""}`} placeholder="e.g. 2 Weeks" />
              <FieldError msg={errors.duration} />
            </div>
            <div>
              <Label tooltip="0 = unlimited">Max Participants</Label>
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
              <input type="date" value={formData.endDate} min={formData.startDate || today}
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
              <TagInput label="Key Features" placeholder="e.g. Certificate included (Enter)" tooltip="Bullet points on the program card"
                tags={formData.features} value={featureInput} setValue={setFeatureInput}
                setTags={t => set("features", t)}
                onAddTag={addTag} onRemoveTag={removeTag} />
            </div>
            <div>
              <TagInput label="Topics Covered" placeholder="e.g. Harvesting (Enter)"
                tags={formData.topics} value={topicInput} setValue={setTopicInput}
                setTags={t => set("topics", t)}
                onAddTag={addTag} onRemoveTag={removeTag} />
            </div>
          </div>
        </Section>

        <Section title="Certification" icon={<Award className="w-4 h-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Certificate Title</Label><input type="text" value={formData.certificationTitle} onChange={e => set("certificationTitle", e.target.value)} className="input-field" placeholder="e.g. Certificate of Completion" /></div>
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
            <div><Label tooltip="Displayed rating (0–5)">Rating</Label><input type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={e => set("rating", parseFloat(e.target.value) || 0)} className="input-field" /></div>
            <div><Label>Total Reviews</Label><input type="number" min="0" value={formData.totalReviews} onChange={e => set("totalReviews", parseInt(e.target.value) || 0)} className="input-field" /></div>
          </div>
        </Section>
      </div>
    );
  };

  const currentTabIdx = TABS.findIndex(t => t.key === activeTab);

  // ── Render ────────────────────────────────────────────────────────

  return (
    <DashboardLayout title="Edit Training Program">
      <form onSubmit={e => { e.preventDefault(); handleSubmit(formData.isPublished); }} className="space-y-0">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-admin-800">Edit Training Program</h2>
            <p className="text-admin-400 text-sm mt-0.5 font-mono truncate max-w-xs">{formData.slug}</p>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
            <a href={`/training/${formData.slug}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-admin-500 hover:text-saffron-600 transition-colors">
              <Eye className="w-4 h-4" /> Preview
            </a>
            <button type="button" onClick={() => router.push("/dashboard/training")} className="text-sm text-admin-500 hover:text-admin-700 flex items-center gap-1">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white border border-admin-200 rounded-xl overflow-hidden">
          <div className="flex overflow-x-auto border-b border-admin-200">
            {TABS.map((tab, idx) => (
              <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? "border-saffron-500 text-saffron-700 bg-saffron-50/40" : "border-transparent text-admin-500 hover:text-admin-700 hover:border-admin-300"
                  }`}>
                {tab.icon}{tab.label}
                {idx < currentTabIdx && <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-1" />}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === "basic" && renderBasicInfoTab()}
            {activeTab === "media" && renderMediaTab()}
            {activeTab === "settings" && renderSettingsTab()}
          </div>
        </div>

        {/* Sticky bottom action bar */}
        <div className="sticky bottom-0 left-0 right-0 z-30 mt-0">
          <div className="bg-white border-t border-admin-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
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
            <div className="flex items-center gap-3">
              <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${formData.isPublished ? "bg-green-100 text-green-700" : "bg-admin-100 text-admin-600"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${formData.isPublished ? "bg-green-500" : "bg-admin-400"}`} />
                {formData.isPublished ? "Published" : "Draft"}
              </span>
              <button type="button" disabled={submitting} onClick={() => handleSubmit(false)}
                className="px-5 py-2 text-sm font-medium border border-admin-300 text-admin-700 rounded-xl hover:bg-admin-50 disabled:opacity-50 transition-colors">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Draft"}
              </button>
              <button type="button" disabled={submitting} onClick={() => handleSubmit(true)}
                className="btn-primary px-6 py-2 text-sm font-medium rounded-xl disabled:opacity-50 flex items-center gap-2">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save & Publish"}
              </button>
            </div>
          </div>
        </div>

      </form>
    </DashboardLayout>
  );
};

export default EditTrainingPage;
