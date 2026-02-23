"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Plus, RefreshCw } from "lucide-react";
import { uploadApi } from "@/lib/api";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  label?: string;
  required?: boolean;
  maxFiles?: number;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  label,
  required = false,
  maxFiles = 10,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value) ? value : value ? [value] : [];
  const hasSingle = !multiple && images.length >= 1;

  // ── Upload handler ─────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple && images.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`);
      return;
    }

    setUploading(true);
    try {
      const results = await Promise.all(
        Array.from(files).map((f) => uploadApi.uploadImage(f))
      );
      const urls = results.map((r) => r.data.url);
      multiple ? onChange([...images, ...urls]) : onChange(urls[0]);
      toast.success(`${files.length} image${files.length > 1 ? "s" : ""} uploaded!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Remove handler ─────────────────────────────────────────────────
  const removeImage = async (index: number) => {
    try {
      const urlParts = images[index].split("/");
      const publicId = `chakra-bio/uploads/${urlParts[urlParts.length - 1].split(".")[0]}`;
      await uploadApi.deleteImage(publicId);
    } catch {
      /* silently ignore Cloudinary delete errors */
    }
    multiple ? onChange(images.filter((_, i) => i !== index)) : onChange("");
  };

  const triggerPick = () => fileInputRef.current?.click();

  // ── Hidden input (shared) ──────────────────────────────────────────
  const hiddenInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      multiple={multiple}
      onChange={handleFileSelect}
      className="hidden"
      disabled={uploading}
    />
  );

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-admin-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {hiddenInput}

      {/* ── SINGLE MODE ──────────────────────────────────────────────── */}
      {!multiple && (
        hasSingle ? (
          /* Uploaded: compact image card replacing the dropzone */
          <div className="relative inline-flex rounded-xl overflow-hidden border border-admin-200 shadow-sm group"
            style={{ maxWidth: 160 }}>
            <img
              src={images[0]}
              alt="Uploaded"
              className="w-40 h-28 object-cover block"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="112"%3E%3Crect fill="%23f0f0f0" width="160" height="112"/%3E%3C/svg%3E';
              }}
            />
            {/* Hover overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={triggerPick}
                title="Replace image"
                className="p-1.5 bg-white/90 text-admin-700 rounded-full hover:bg-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeImage(0)}
                title="Remove image"
                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Always-visible small remove badge */}
            <button
              type="button"
              onClick={() => removeImage(0)}
              title="Remove"
              className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          /* Not yet uploaded: standard dropzone */
          <div
            onClick={triggerPick}
            className="border-2 border-dashed border-admin-300 rounded-xl p-5 hover:border-saffron-400 hover:bg-saffron-50/30 transition-colors cursor-pointer flex flex-col items-center gap-1.5"
          >
            {uploading ? (
              <>
                <Loader2 className="w-7 h-7 text-saffron-500 animate-spin" />
                <span className="text-xs text-admin-500 font-medium">Uploading…</span>
              </>
            ) : (
              <>
                <Upload className="w-7 h-7 text-admin-400" />
                <span className="text-xs text-admin-600 font-medium">Click to upload</span>
                <span className="text-xs text-admin-400">PNG, JPG, WEBP · max 5 MB</span>
              </>
            )}
          </div>
        )
      )}

      {/* ── MULTI MODE ───────────────────────────────────────────────── */}
      {multiple && (
        <div className="flex flex-wrap gap-3">
          {/* Existing thumbnails */}
          {images.map((url, i) => (
            <div key={i} className="relative group w-24 h-20 rounded-xl overflow-hidden border border-admin-200 shadow-sm flex-shrink-0">
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="80"%3E%3Crect fill="%23f0f0f0" width="96" height="80"/%3E%3C/svg%3E';
                }}
              />
              {/* Remove badge */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                title="Remove"
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
              {i === 0 && (
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-saffron-500 text-white text-[10px] font-medium rounded-full leading-tight">
                  Primary
                </div>
              )}
            </div>
          ))}

          {/* Add-more tile (shown when under maxFiles limit) */}
          {images.length < maxFiles && (
            <button
              type="button"
              onClick={triggerPick}
              disabled={uploading}
              className="w-24 h-20 rounded-xl border-2 border-dashed border-admin-300 hover:border-saffron-400 hover:bg-saffron-50/30 transition-colors flex flex-col items-center justify-center gap-1 text-admin-400 hover:text-saffron-600 flex-shrink-0 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Add</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
