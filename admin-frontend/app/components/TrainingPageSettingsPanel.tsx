"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
    Save, Eye, EyeOff, Plus, Trash2, GripVertical,
    LayoutTemplate, Loader2, ChevronUp, ChevronDown,
    Star, CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
    trainingPageApi,
    type TrainingPageSettings,
} from "@/lib/api";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const ICON_OPTIONS = [
    "Sprout", "GraduationCap", "FlaskConical", "Award", "Leaf", "TrendingUp",
    "Home", "BookOpen", "Trophy", "Users", "Target", "Droplets", "Bug",
    "Scissors", "Shield", "Lightbulb", "Star", "Heart", "Clock", "Globe",
];

const COLOR_PRESETS = [
    { name: "White", value: "#ffffff" },
    { name: "Light Cream", value: "#faf8f5" },
    { name: "Light Gray", value: "#f3f4f6" },
    { name: "Warm Beige", value: "#f5f0e8" },
    { name: "Soft Green", value: "#f0fdf4" },
    { name: "Soft Blue", value: "#eff6ff" },
    { name: "Soft Amber", value: "#fffbeb" },
    { name: "Dark", value: "#0a0a0a" },
    { name: "Deep Maroon", value: "#3d0a0a" },
    { name: "Forest Green", value: "#14532d" },
    { name: "Navy", value: "#1e3a5f" },
];

const TEMPLATES = [
    { id: "classic", name: "Classic", description: "Traditional layout with clean sections" },
    { id: "modern", name: "Modern", description: "Bold typography with gradient accents" },
    { id: "minimal", name: "Minimal", description: "Clean whitespace-focused design" },
    { id: "bold", name: "Bold", description: "High-contrast with large headings" },
];

const SECTION_TEMPLATES = [
    { id: "text-block", name: "Text Block", description: "Rich text content section" },
    { id: "two-column", name: "Two Columns", description: "Side-by-side layout" },
    { id: "features-grid", name: "Features Grid", description: "Grid of feature cards" },
    { id: "cta-banner", name: "CTA Banner", description: "Call-to-action banner" },
];

const INNER_TABS = [
    { id: "hero", label: "Hero" },
    { id: "featured", label: "Featured Course" },
    { id: "standout", label: "Why Stand Out" },
    { id: "modules", label: "Modules" },
    { id: "testimonials", label: "Testimonials" },
    { id: "impact", label: "Impact Stats" },
    { id: "cta", label: "CTA" },
    { id: "sections", label: "Custom Sections" },
    { id: "template", label: "Page Template" },
];

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"], ["clean"],
    ],
};

const TrainingPageSettingsPanel = () => {
    const [settings, setSettings] = useState<TrainingPageSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("hero");
    const [showPreview, setShowPreview] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => { loadSettings(); }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const res = await trainingPageApi.get();
            if (res.data) setSettings(res.data);
        } catch { toast.error("Failed to load page settings"); }
        finally { setLoading(false); }
    };

    const update = useCallback((updater: (prev: TrainingPageSettings) => TrainingPageSettings) => {
        setSettings(prev => { if (!prev) return prev; setHasChanges(true); return updater(prev); });
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setSubmitting(true);
        try {
            await trainingPageApi.update(settings);
            toast.success("Page settings saved!");
            setHasChanges(false);
        } catch (e: any) { toast.error(e.message || "Save failed"); }
        finally { setSubmitting(false); }
    };

    // ── Colour Picker ──────────────────────────────────────────────────
    const ColorPicker = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-admin-700">{label}</label>
            <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map(c => (
                    <button key={c.value} type="button" onClick={() => onChange(c.value)}
                        className={`w-7 h-7 rounded-md border-2 transition-all ${value === c.value ? "border-saffron-500 ring-2 ring-saffron-200" : "border-admin-200 hover:border-admin-400"}`}
                        style={{ backgroundColor: c.value }} title={c.name} />
                ))}
                <input type="color" value={value} onChange={e => onChange(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border border-admin-200" title="Custom" />
            </div>
        </div>
    );

    // ── Hero ───────────────────────────────────────────────────────────
    const renderHero = () => {
        if (!settings) return null;
        const { hero } = settings;
        return (
            <div className="space-y-4">
                {[
                    { label: "Badge Text", key: "badge", multi: false },
                    { label: "Title", key: "title", multi: false },
                    { label: "Subtitle", key: "subtitle", multi: true },
                    { label: "Background Image URL", key: "backgroundImage", multi: false },
                ].map(({ label, key, multi }) => (
                    <div key={key}>
                        <label className="block text-sm font-medium text-admin-700 mb-1">{label}</label>
                        {multi
                            ? <textarea rows={3} value={(hero as any)[key] || ""} onChange={e => update(s => ({ ...s, hero: { ...s.hero, [key]: e.target.value } }))} className="input-field" />
                            : <input type="text" value={(hero as any)[key] || ""} onChange={e => update(s => ({ ...s, hero: { ...s.hero, [key]: e.target.value } }))} className="input-field" />
                        }
                    </div>
                ))}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-admin-700">Stats</label>
                        <button type="button" onClick={() => update(s => ({ ...s, hero: { ...s.hero, stats: [...s.hero.stats, { value: "", label: "" }] } }))}
                            className="text-sm text-saffron-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                    </div>
                    {hero.stats.map((st, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <input type="text" value={st.value} placeholder="Value" onChange={e => { const n = [...hero.stats]; n[i] = { ...n[i], value: e.target.value }; update(s => ({ ...s, hero: { ...s.hero, stats: n } })); }} className="input-field flex-1" />
                            <input type="text" value={st.label} placeholder="Label" onChange={e => { const n = [...hero.stats]; n[i] = { ...n[i], label: e.target.value }; update(s => ({ ...s, hero: { ...s.hero, stats: n } })); }} className="input-field flex-1" />
                            <button type="button" onClick={() => update(s => ({ ...s, hero: { ...s.hero, stats: s.hero.stats.filter((_, j) => j !== i) } }))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // ── Featured Course ────────────────────────────────────────────────
    const renderFeatured = () => {
        if (!settings) return null;
        const { featuredCourse: fc } = settings;
        return (
            <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={fc.isVisible} onChange={e => update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, isVisible: e.target.checked } }))} className="w-4 h-4 text-saffron-600 rounded" />
                    <span className="text-sm text-admin-700">Show this section</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-medium text-admin-700 mb-1">Badge</label><input type="text" value={fc.badge} onChange={e => update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, badge: e.target.value } }))} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-admin-700 mb-1">Title</label><input type="text" value={fc.title} onChange={e => update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, title: e.target.value } }))} className="input-field" /></div>
                </div>
                <div><label className="block text-sm font-medium text-admin-700 mb-1">Subtitle</label><textarea rows={2} value={fc.subtitle} onChange={e => update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, subtitle: e.target.value } }))} className="input-field" /></div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-admin-700">What You'll Gain</label>
                        <button type="button" onClick={() => update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, gains: [...s.featuredCourse.gains, ""] } }))} className="text-sm text-saffron-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                    </div>
                    {fc.gains.map((g, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <input type="text" value={g} placeholder="Gain item" onChange={e => { const n = [...fc.gains]; n[i] = e.target.value; update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, gains: n } })); }} className="input-field flex-1" />
                            <button type="button" onClick={() => update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, gains: s.featuredCourse.gains.filter((_, j) => j !== i) } }))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-admin-700">Benefits</label>
                        <button type="button" onClick={() => update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, benefits: [...s.featuredCourse.benefits, { title: "", description: "", icon: "BookOpen" }] } }))} className="text-sm text-saffron-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                    </div>
                    {fc.benefits.map((b, i) => (
                        <div key={i} className="border border-admin-200 rounded-lg p-3 mb-2 space-y-2">
                            <div className="flex gap-2">
                                <input type="text" value={b.title} placeholder="Title" onChange={e => { const n = [...fc.benefits]; n[i] = { ...n[i], title: e.target.value }; update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, benefits: n } })); }} className="input-field flex-1" />
                                <select value={b.icon} onChange={e => { const n = [...fc.benefits]; n[i] = { ...n[i], icon: e.target.value }; update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, benefits: n } })); }} className="input-field w-36">
                                    {ICON_OPTIONS.map(ic => <option key={ic}>{ic}</option>)}
                                </select>
                                <button type="button" onClick={() => update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, benefits: s.featuredCourse.benefits.filter((_, j) => j !== i) } }))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <textarea rows={2} value={b.description} placeholder="Description" onChange={e => { const n = [...fc.benefits]; n[i] = { ...n[i], description: e.target.value }; update(s => ({ ...s, featuredCourse: { ...s.featuredCourse, benefits: n } })); }} className="input-field" />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // ── Standout ───────────────────────────────────────────────────────
    const renderStandout = () => {
        if (!settings) return null;
        const { standout } = settings;
        return (
            <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={standout.isVisible} onChange={e => update(s => ({ ...s, standout: { ...s.standout, isVisible: e.target.checked } }))} className="w-4 h-4 text-saffron-600 rounded" />
                    <span className="text-sm text-admin-700">Show this section</span>
                </label>
                <div><label className="block text-sm font-medium text-admin-700 mb-1">Title</label><input type="text" value={standout.title} onChange={e => update(s => ({ ...s, standout: { ...s.standout, title: e.target.value } }))} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-admin-700 mb-1">Description</label><textarea rows={3} value={standout.description || ""} onChange={e => update(s => ({ ...s, standout: { ...s.standout, description: e.target.value } }))} className="input-field" /></div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-admin-700">Highlights</label>
                        <button type="button" onClick={() => update(s => ({ ...s, standout: { ...s.standout, highlights: [...s.standout.highlights, { title: "", description: "", icon: "Users" }] } }))} className="text-sm text-saffron-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                    </div>
                    {standout.highlights.map((h, i) => (
                        <div key={i} className="border border-admin-200 rounded-lg p-3 mb-2 space-y-2">
                            <div className="flex gap-2">
                                <input type="text" value={h.title} placeholder="Title" onChange={e => { const n = [...standout.highlights]; n[i] = { ...n[i], title: e.target.value }; update(s => ({ ...s, standout: { ...s.standout, highlights: n } })); }} className="input-field flex-1" />
                                <select value={h.icon} onChange={e => { const n = [...standout.highlights]; n[i] = { ...n[i], icon: e.target.value }; update(s => ({ ...s, standout: { ...s.standout, highlights: n } })); }} className="input-field w-36">
                                    {ICON_OPTIONS.map(ic => <option key={ic}>{ic}</option>)}
                                </select>
                                <button type="button" onClick={() => update(s => ({ ...s, standout: { ...s.standout, highlights: s.standout.highlights.filter((_, j) => j !== i) } }))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <input type="text" value={h.description} placeholder="Description" onChange={e => { const n = [...standout.highlights]; n[i] = { ...n[i], description: e.target.value }; update(s => ({ ...s, standout: { ...s.standout, highlights: n } })); }} className="input-field" />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // ── Modules ────────────────────────────────────────────────────────
    const renderModules = () => {
        if (!settings) return null;
        const { modules } = settings;
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-admin-700">Course Modules ({modules.length})</label>
                    <button type="button" onClick={() => update(s => ({ ...s, modules: [...s.modules, { title: "", description: "", icon: "Leaf", topics: [] }] }))} className="text-sm text-saffron-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                </div>
                {modules.map((mod, i) => (
                    <div key={i} className="border border-admin-200 rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-admin-600">Module {i + 1}</span>
                            <div className="flex gap-1">
                                {i > 0 && <button type="button" onClick={() => { const n = [...modules];[n[i - 1], n[i]] = [n[i], n[i - 1]]; update(s => ({ ...s, modules: n })); }} className="p-1 text-admin-400 hover:text-admin-600"><ChevronUp className="w-4 h-4" /></button>}
                                {i < modules.length - 1 && <button type="button" onClick={() => { const n = [...modules];[n[i], n[i + 1]] = [n[i + 1], n[i]]; update(s => ({ ...s, modules: n })); }} className="p-1 text-admin-400 hover:text-admin-600"><ChevronDown className="w-4 h-4" /></button>}
                                <button type="button" onClick={() => update(s => ({ ...s, modules: s.modules.filter((_, j) => j !== i) }))} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={mod.title} placeholder="Module title" onChange={e => { const n = [...modules]; n[i] = { ...n[i], title: e.target.value }; update(s => ({ ...s, modules: n })); }} className="input-field" />
                            <select value={mod.icon} onChange={e => { const n = [...modules]; n[i] = { ...n[i], icon: e.target.value }; update(s => ({ ...s, modules: n })); }} className="input-field">
                                {ICON_OPTIONS.map(ic => <option key={ic}>{ic}</option>)}
                            </select>
                        </div>
                        <textarea rows={2} value={mod.description} placeholder="Module description" onChange={e => { const n = [...modules]; n[i] = { ...n[i], description: e.target.value }; update(s => ({ ...s, modules: n })); }} className="input-field" />
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-admin-500">Topics</span>
                                <button type="button" onClick={() => { const n = [...modules]; n[i] = { ...n[i], topics: [...n[i].topics, ""] }; update(s => ({ ...s, modules: n })); }} className="text-xs text-saffron-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                            </div>
                            {mod.topics.map((tp, ti) => (
                                <div key={ti} className="flex gap-2 mb-1">
                                    <input type="text" value={tp} placeholder="Topic" onChange={e => { const n = [...modules]; const t = [...n[i].topics]; t[ti] = e.target.value; n[i] = { ...n[i], topics: t }; update(s => ({ ...s, modules: n })); }} className="input-field flex-1 text-sm" />
                                    <button type="button" onClick={() => { const n = [...modules]; n[i] = { ...n[i], topics: n[i].topics.filter((_, j) => j !== ti) }; update(s => ({ ...s, modules: n })); }} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // ── Testimonials ───────────────────────────────────────────────────
    const renderTestimonials = () => {
        if (!settings) return null;
        const { testimonials } = settings;
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-admin-700">Testimonials ({testimonials.length})</label>
                    <button type="button" onClick={() => update(s => ({ ...s, testimonials: [...s.testimonials, { name: "", role: "", rating: 5, text: "" }] }))} className="text-sm text-saffron-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                </div>
                {testimonials.map((t, i) => (
                    <div key={i} className="border border-admin-200 rounded-lg p-3 space-y-3">
                        <div className="flex gap-2">
                            <input type="text" value={t.name} placeholder="Name" onChange={e => { const n = [...testimonials]; n[i] = { ...n[i], name: e.target.value }; update(s => ({ ...s, testimonials: n })); }} className="input-field flex-1" />
                            <input type="text" value={t.role} placeholder="Role" onChange={e => { const n = [...testimonials]; n[i] = { ...n[i], role: e.target.value }; update(s => ({ ...s, testimonials: n })); }} className="input-field flex-1" />
                            <button type="button" onClick={() => update(s => ({ ...s, testimonials: s.testimonials.filter((_, j) => j !== i) }))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-admin-600">Rating:</span>
                            {[1, 2, 3, 4, 5].map(r => (
                                <button key={r} type="button" onClick={() => { const n = [...testimonials]; n[i] = { ...n[i], rating: r }; update(s => ({ ...s, testimonials: n })); }}>
                                    <Star className={`w-4 h-4 ${r <= t.rating ? "fill-yellow-400 text-yellow-400" : "text-admin-300"}`} />
                                </button>
                            ))}
                        </div>
                        <textarea rows={3} value={t.text} placeholder="Testimonial text" onChange={e => { const n = [...testimonials]; n[i] = { ...n[i], text: e.target.value }; update(s => ({ ...s, testimonials: n })); }} className="input-field" />
                    </div>
                ))}
            </div>
        );
    };

    // ── Impact Stats ───────────────────────────────────────────────────
    const renderImpact = () => {
        if (!settings) return null;
        const { impactStats } = settings;
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-admin-700">Impact Stats ({impactStats.length})</label>
                    <button type="button" onClick={() => update(s => ({ ...s, impactStats: [...s.impactStats, { value: "", label: "", icon: "Target" }] }))} className="text-sm text-saffron-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                </div>
                {impactStats.map((st, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <input type="text" value={st.value} placeholder="Value" onChange={e => { const n = [...impactStats]; n[i] = { ...n[i], value: e.target.value }; update(s => ({ ...s, impactStats: n })); }} className="input-field w-24" />
                        <input type="text" value={st.label} placeholder="Label" onChange={e => { const n = [...impactStats]; n[i] = { ...n[i], label: e.target.value }; update(s => ({ ...s, impactStats: n })); }} className="input-field flex-1" />
                        <select value={st.icon} onChange={e => { const n = [...impactStats]; n[i] = { ...n[i], icon: e.target.value }; update(s => ({ ...s, impactStats: n })); }} className="input-field w-32">
                            {ICON_OPTIONS.map(ic => <option key={ic}>{ic}</option>)}
                        </select>
                        <button type="button" onClick={() => update(s => ({ ...s, impactStats: s.impactStats.filter((_, j) => j !== i) }))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
            </div>
        );
    };

    // ── CTA ────────────────────────────────────────────────────────────
    const renderCTA = () => {
        if (!settings) return null;
        const { cta } = settings;
        return (
            <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={cta.isVisible} onChange={e => update(s => ({ ...s, cta: { ...s.cta, isVisible: e.target.checked } }))} className="w-4 h-4 text-saffron-600 rounded" />
                    <span className="text-sm text-admin-700">Show CTA section</span>
                </label>
                <div><label className="block text-sm font-medium text-admin-700 mb-1">Title</label><input type="text" value={cta.title} onChange={e => update(s => ({ ...s, cta: { ...s.cta, title: e.target.value } }))} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-admin-700 mb-1">Description</label><textarea rows={3} value={cta.description} onChange={e => update(s => ({ ...s, cta: { ...s.cta, description: e.target.value } }))} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-admin-700 mb-1">Button Text</label><input type="text" value={cta.buttonText} onChange={e => update(s => ({ ...s, cta: { ...s.cta, buttonText: e.target.value } }))} className="input-field" /></div>
            </div>
        );
    };

    // ── Custom Sections ────────────────────────────────────────────────
    const renderSections = () => {
        if (!settings) return null;
        const { sections } = settings;
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-sm font-medium text-admin-700">Custom Sections ({sections.length})</label>
                        <p className="text-xs text-admin-500">Add custom content to the training page</p>
                    </div>
                    <button type="button" onClick={() => update(s => ({ ...s, sections: [...s.sections, { title: "New Section", content: "", backgroundColor: "#ffffff", textColor: "#000000", order: s.sections.length, isVisible: true, template: "text-block" }] }))} className="btn-primary flex items-center gap-2 text-sm py-1.5"><Plus className="w-4 h-4" /> Add Section</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {SECTION_TEMPLATES.map(tmpl => (
                        <button key={tmpl.id} type="button" onClick={() => update(s => ({ ...s, sections: [...s.sections, { title: tmpl.name, content: "", backgroundColor: "#ffffff", textColor: "#000000", order: s.sections.length, isVisible: true, template: tmpl.id }] }))} className="p-3 bg-white rounded-lg border border-admin-200 hover:border-saffron-400 text-left transition-colors">
                            <LayoutTemplate className="w-4 h-4 text-saffron-500 mb-1" />
                            <p className="text-xs font-medium text-admin-700">{tmpl.name}</p>
                            <p className="text-xs text-admin-400">{tmpl.description}</p>
                        </button>
                    ))}
                </div>
                {sections.map((sec, i) => (
                    <div key={i} className="border border-admin-200 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-admin-50">
                            <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-admin-400" />
                                <span className="font-medium text-sm text-admin-700">{sec.title || "Untitled"}</span>
                                <span className="text-xs bg-admin-200 text-admin-600 px-2 py-0.5 rounded">{sec.template}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button type="button" onClick={() => { const n = [...sections]; n[i] = { ...n[i], isVisible: !n[i].isVisible }; update(s => ({ ...s, sections: n })); }}>
                                    {sec.isVisible ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-admin-400" />}
                                </button>
                                {i > 0 && <button type="button" onClick={() => { const n = [...sections];[n[i - 1], n[i]] = [n[i], n[i - 1]]; update(s => ({ ...s, sections: n })); }} className="p-1 text-admin-400 hover:text-admin-600"><ChevronUp className="w-4 h-4" /></button>}
                                {i < sections.length - 1 && <button type="button" onClick={() => { const n = [...sections];[n[i], n[i + 1]] = [n[i + 1], n[i]]; update(s => ({ ...s, sections: n })); }} className="p-1 text-admin-400 hover:text-admin-600"><ChevronDown className="w-4 h-4" /></button>}
                                <button type="button" onClick={() => update(s => ({ ...s, sections: s.sections.filter((_, j) => j !== i) }))} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium text-admin-700 mb-1">Section Title</label><input type="text" value={sec.title} onChange={e => { const n = [...sections]; n[i] = { ...n[i], title: e.target.value }; update(s => ({ ...s, sections: n })); }} className="input-field" /></div>
                                <div><label className="block text-sm font-medium text-admin-700 mb-1">Template</label>
                                    <select value={sec.template} onChange={e => { const n = [...sections]; n[i] = { ...n[i], template: e.target.value }; update(s => ({ ...s, sections: n })); }} className="input-field">
                                        {SECTION_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <ColorPicker label="Background" value={sec.backgroundColor} onChange={v => { const n = [...sections]; n[i] = { ...n[i], backgroundColor: v }; update(s => ({ ...s, sections: n })); }} />
                                <ColorPicker label="Text Color" value={sec.textColor} onChange={v => { const n = [...sections]; n[i] = { ...n[i], textColor: v }; update(s => ({ ...s, sections: n })); }} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-admin-700 mb-1">Content (Rich Text)</label>
                                <div className="h-56 mb-12">
                                    <ReactQuill theme="snow" value={sec.content} onChange={content => { const n = [...sections]; n[i] = { ...n[i], content }; update(s => ({ ...s, sections: n })); }} modules={quillModules} className="h-44" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // ── Page Template ──────────────────────────────────────────────────
    const renderTemplate = () => {
        if (!settings) return null;
        return (
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-admin-700">Global Page Template</label>
                    <p className="text-xs text-admin-500 mt-1">Choose the overall styling theme for the training page</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {TEMPLATES.map(tmpl => (
                        <button key={tmpl.id} type="button" onClick={() => update(s => ({ ...s, selectedTemplate: tmpl.id }))}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${settings.selectedTemplate === tmpl.id ? "border-saffron-500 bg-saffron-50 ring-2 ring-saffron-200" : "border-admin-200 hover:border-admin-400"}`}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-admin-800">{tmpl.name}</h3>
                                {settings.selectedTemplate === tmpl.id && <CheckCircle2 className="w-5 h-5 text-saffron-600" />}
                            </div>
                            <p className="text-sm text-admin-600">{tmpl.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "hero": return renderHero();
            case "featured": return renderFeatured();
            case "standout": return renderStandout();
            case "modules": return renderModules();
            case "testimonials": return renderTestimonials();
            case "impact": return renderImpact();
            case "cta": return renderCTA();
            case "sections": return renderSections();
            case "template": return renderTemplate();
            default: return renderHero();
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-saffron-500" />
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Sub-header with save */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-admin-500">Edit all sections displayed on the public training page</p>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowPreview(!showPreview)} className="px-3 py-1.5 text-sm text-admin-600 hover:bg-admin-100 rounded-lg transition-colors flex items-center gap-2">
                        {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showPreview ? "Hide Preview" : "Preview"}
                    </button>
                    <button onClick={handleSave} disabled={submitting || !hasChanges} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {submitting ? "Saving…" : hasChanges ? "Save Changes" : "Saved"}
                    </button>
                </div>
            </div>

            <div className={`grid gap-4 ${showPreview ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                {/* Editor */}
                <div className="card !p-0 overflow-hidden">
                    {/* Inner tabs */}
                    <div className="border-b border-admin-200 overflow-x-auto">
                        <nav className="flex px-3 min-w-max">
                            {INNER_TABS.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-saffron-500 text-saffron-600" : "border-transparent text-admin-400 hover:text-admin-700 hover:border-admin-300"}`}>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="p-5">{renderTabContent()}</div>
                </div>

                {/* Preview */}
                {showPreview && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-admin-600">
                            <Eye className="w-4 h-4" /><span className="font-medium">Live Preview</span>
                        </div>
                        <div className="bg-white rounded-xl border border-admin-200 overflow-hidden max-h-[80vh] overflow-y-auto text-sm">
                            <div className="bg-[#3d0a0a] text-white p-6 text-center">
                                <span className="text-amber-400 text-xs">{settings?.hero.badge}</span>
                                <h1 className="text-xl font-bold mt-2">{settings?.hero.title}</h1>
                                <p className="text-white/70 mt-2 text-xs max-w-lg mx-auto">{settings?.hero.subtitle}</p>
                                <div className="flex justify-center gap-6 mt-4">
                                    {settings?.hero.stats.map((s, i) => (
                                        <div key={i} className="text-center">
                                            <div className="text-base font-bold text-amber-400">{s.value}</div>
                                            <div className="text-xs text-white/60">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {settings?.featuredCourse.isVisible && (
                                <div className="p-5 border-b">
                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{settings.featuredCourse.badge}</span>
                                    <h2 className="text-base font-bold mt-2">{settings.featuredCourse.title}</h2>
                                    <ul className="mt-3 space-y-1">
                                        {settings.featuredCourse.gains.map((g, i) => <li key={i} className="flex items-center gap-2 text-xs text-gray-600"><CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />{g}</li>)}
                                    </ul>
                                </div>
                            )}
                            {(settings?.modules?.length ?? 0) > 0 && (
                                <div className="p-5 border-b bg-gray-50">
                                    <h2 className="text-base font-bold mb-3">Course Modules</h2>
                                    <div className="grid grid-cols-2 gap-2">
                                        {settings?.modules?.map((m, i) => <div key={i} className="bg-white p-3 rounded border"><p className="text-xs font-semibold">{m.title}</p><p className="text-xs text-gray-500 mt-0.5">{m.description}</p></div>)}
                                    </div>
                                </div>
                            )}
                            {settings?.cta.isVisible && (
                                <div className="p-5 bg-[#3d0a0a] text-white text-center">
                                    <h2 className="text-base font-bold">{settings.cta.title}</h2>
                                    <p className="text-xs text-white/70 mt-1">{settings.cta.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainingPageSettingsPanel;
