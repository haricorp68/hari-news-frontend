"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Upload, Check, FileIcon, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes?: number;
  created_at?: string;
  source?: string;
  file_name?: string; // Added for file resource type
}

export interface CloudinaryUploadProps {
  value?: UploadResult | null;
  onUploadSuccess?: (result: UploadResult) => void;
  onUploadError?: (error: any) => void;
  onRemove?: () => void;
  allowedFormats?: string[];
  maxFiles?: number;
  resourceType?: "image" | "video" | "raw";
  uploadPreset?: string;
  showPreview?: boolean;
  showRemove?: boolean;
  showCopy?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
}

export function CloudinaryUpload({
  value,
  onUploadSuccess,
  onUploadError,
  onRemove,
  allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"],
  maxFiles = 1,
  resourceType = "image",
  uploadPreset,
  showPreview = true,
  showRemove = true,
  showCopy = true,
  disabled = false,
  className = "",
  label = "Upload file",
  description = "Chọn hoặc kéo thả file để upload",
}: CloudinaryUploadProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUploadSuccess = (result: any) => {
    setLoading(false);
    const imageData: UploadResult = {
      public_id: result.info.public_id,
      secure_url: result.info.secure_url,
      url: result.info.url,
      width: result.info.width,
      height: result.info.height,
      format: result.info.format,
      resource_type: result.info.resource_type,
      bytes: result.info.bytes || 0,
      created_at: result.info.created_at || new Date().toISOString(),
      source: result.info.source || "unknown",
    };
    onUploadSuccess?.(imageData);
    toast.success("Upload thành công!");
  };

  const handleUploadError = (error: any) => {
    setLoading(false);
    onUploadError?.(error);
    toast.error("Có lỗi xảy ra khi upload file");
  };

  const handleOpen = (open: () => void) => {
    if (!disabled) {
      setLoading(false);
      open();
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Đã copy URL vào clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không thể copy URL");
    }
  };

  // UI for preview
  const renderPreview = () => {
    if (!value) return null;
    if (value.resource_type === "image") {
      return (
        <img
          src={value.secure_url}
          alt={value.public_id}
          className="w-full max-w-xs h-auto rounded-lg border object-contain"
        />
      );
    }
    if (value.resource_type === "video") {
      return (
        <video
          src={value.secure_url}
          controls
          className="w-full max-w-xs rounded-lg border bg-black"
        />
      );
    }
    // file
    return (
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted">
        <FileIcon className="w-5 h-5 text-muted-foreground" />
        <span className="truncate text-sm">
          {value.file_name || value.public_id}
        </span>
      </div>
    );
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`.trim()}>
      {label && <Label className="mb-1">{label}</Label>}
      {showPreview && value && (
        <div className="mb-2 w-full flex flex-col items-center">
          {renderPreview()}
        </div>
      )}
      <CldUploadWidget
        uploadPreset={
          uploadPreset ||
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
          "ml_default"
        }
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        onOpen={() => setLoading(true)}
        onClose={() => setLoading(false)} // Reset loading if dialog is closed without upload
        options={{
          maxFiles,
          resourceType,
          clientAllowedFormats: allowedFormats,
          maxFileSize: 100000000,
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            variant="outline"
            disabled={disabled || loading}
            className=" flex items-center gap-2 border-dashed border-2 border-muted-foreground px-4 py-3 justify-center"
            onClick={() => handleOpen(open)}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {value ? "Đổi file" : label}
          </Button>
        )}
      </CldUploadWidget>
      {description && !value && (
        <div className="text-xs text-muted-foreground text-center mt-1">
          {description}
        </div>
      )}
      {value && (
        <div className="flex gap-2 mt-2 w-full justify-center">
          {showCopy && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(value.secure_url)}
              className="gap-1"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="text-xs">Copy URL</span>
            </Button>
          )}
          {showRemove && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-xs">Xóa</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
