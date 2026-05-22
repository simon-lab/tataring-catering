"use client";

import { useState, useRef, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { ImagePlus, Loader2, X, ZoomIn, ZoomOut, CropIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ─── Konstanta ─────────────────────────────────────────────────────────────────

const MAX_IMAGES = 5;
const MAX_SOURCE_MB = 10;
const MAX_SOURCE_BYTES = MAX_SOURCE_MB * 1024 * 1024;
const ACCEPT_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPT_ATTR = ACCEPT_TYPES.join(",");
const OUTPUT_WIDTH = 1200;
const OUTPUT_HEIGHT = 900; // rasio 4:3
const ASPECT = 4 / 3;

// ─── Canvas crop helper ────────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = src;
  });
}

async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");

  ctx.drawImage(
    img,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0,
    OUTPUT_WIDTH, OUTPUT_HEIGHT
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Gagal memproses gambar"))),
      "image/jpeg",
      0.85
    );
  });
}

function validateFile(file: File): string | null {
  if (!ACCEPT_TYPES.includes(file.type))
    return "Format tidak didukung. Gunakan JPG, PNG, atau WebP";
  if (file.size > MAX_SOURCE_BYTES)
    return `File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal ${MAX_SOURCE_MB}MB`;
  return null;
}

// ─── Crop Modal ────────────────────────────────────────────────────────────────

interface CropModalProps {
  src: string;
  onConfirm: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

function CropModal({ src, onConfirm, onCancel }: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedArea) return;
    setProcessing(true);
    setProcessError(null);
    try {
      const blob = await getCroppedBlob(src, croppedArea);
      onConfirm(blob);
    } catch {
      setProcessError("Gagal memproses gambar, coba lagi");
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onCancel}
    >
      <div
        className="flex w-full max-w-md flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <CropIcon className="size-4 text-primary" />
            <h3 className="font-semibold text-foreground">Atur Foto Paket</h3>
          </div>
          <button
            onClick={onCancel}
            className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative bg-black" style={{ height: 280 }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={ASPECT}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid
            style={{
              containerStyle: { borderRadius: 0 },
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex shrink-0 items-center gap-3 border-t border-border px-5 py-3">
          <ZoomOut className="size-4 flex-shrink-0 text-muted-foreground" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-primary"
          />
          <ZoomIn className="size-4 flex-shrink-0 text-muted-foreground" />
        </div>

        {/* Info + error */}
        <div className="shrink-0 px-5 pb-1">
          <p className="text-xs text-muted-foreground">
            Geser foto untuk memilih area · Scroll/pinch untuk zoom · Output 1200×900 JPEG
          </p>
          {processError && (
            <p className="mt-1.5 text-xs text-destructive">{processError}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {processing ? (
              <><Loader2 className="size-4 animate-spin" /> Memproses...</>
            ) : (
              <><CropIcon className="size-4" /> Crop & Upload</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Uploader ─────────────────────────────────────────────────────────────

interface MenuImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export function MenuImageUploader({ images, onChange }: MenuImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const openFile = (file: File) => {
    setUploadError(null);

    if (images.length >= MAX_IMAGES) {
      setUploadError(`Maksimal ${MAX_IMAGES} foto per paket`);
      return;
    }

    const err = validateFile(file);
    if (err) { setUploadError(err); return; }

    const reader = new FileReader();
    reader.onload = (e) => setCropSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) openFile(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) openFile(file);
  };

  const handleCropConfirm = async (blob: Blob) => {
    setUploading(true);
    setUploadError(null);
    try {
      const supabase = createClient();
      const path = `menu/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

      const { error: storageErr } = await supabase.storage
        .from("tataring")
        .upload(path, blob, { contentType: "image/jpeg", upsert: false });

      if (storageErr) {
        if (storageErr.message.toLowerCase().includes("not found")) {
          throw new Error("Bucket 'tataring' belum dibuat di Supabase Storage");
        }
        throw new Error("Upload gagal: " + storageErr.message);
      }

      const { data } = supabase.storage.from("tataring").getPublicUrl(path);
      onChange([...images, data.publicUrl]);
      setCropSrc(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload gagal, coba lagi");
      setCropSrc(null);
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => setCropSrc(null);

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const canAddMore = images.length < MAX_IMAGES;

  return (
    <>
      <div className="space-y-3">
        {/* Thumbnail grid + add button */}
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div
              key={url + i}
              className="relative size-20 flex-shrink-0 overflow-hidden rounded-lg border border-border group"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-4 text-white" />
              </button>
            </div>
          ))}

          {/* Drop / click zone */}
          {canAddMore && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploading && fileRef.current?.click()}
              className={cn(
                "size-20 flex-shrink-0 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer select-none",
                isDragging
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                uploading && "opacity-50 pointer-events-none"
              )}
            >
              {uploading
                ? <Loader2 className="size-4 animate-spin" />
                : <ImagePlus className="size-4" />}
              <span className="text-[10px] font-medium leading-none text-center px-1">
                {uploading ? "Upload..." : isDragging ? "Lepaskan" : "Tambah"}
              </span>
            </div>
          )}
        </div>

        {/* Drag & drop hint + error */}
        <div className="space-y-1">
          {uploadError && (
            <p className="text-xs text-destructive">{uploadError}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Klik atau drag & drop foto · Maks. {MAX_IMAGES} foto · {MAX_SOURCE_MB}MB per foto · JPG, PNG, WebP
          </p>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT_ATTR}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Crop modal */}
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
}
