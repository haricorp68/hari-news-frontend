"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Upload, Check, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

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
}

export interface CloudinaryUploadProps {
  // Upload configuration
  maxFiles?: number;
  sources?: UploadSource[];
  resourceType?: "image" | "video" | "raw";
  allowedFormats?: string[];
  maxFileSize?: number;
  uploadPreset?: string;
  
  // Folder organization
  folder?: string;                    // Folder path in Cloudinary (e.g., "users", "products", "news")
  subFolder?: string;                 // Sub-folder (e.g., "avatars", "thumbnails")
  useTimestamp?: boolean;             // Add timestamp to filename
  useOriginalName?: boolean;          // Keep original filename
  customTransformation?: string;      // Custom transformation string
  
  // UI configuration
  title?: string;
  description?: string;
  showPreview?: boolean;
  showSource?: boolean;
  showDetails?: boolean;
  showCopyButtons?: boolean;
  showRemoveButtons?: boolean;
  
  // Callbacks
  onUploadSuccess?: (result: UploadResult) => void;
  onUploadError?: (error: any) => void;
  onImageRemove?: (publicId: string) => void;
  
  // Styling
  className?: string;
  variant?: "default" | "simple" | "detailed";
}

type UploadSource =
  | "local"
  | "camera"
  | "url"
  | "google_drive"
  | "dropbox"
  | "shutterstock"
  | "gettyimages"
  | "istock"
  | "unsplash"
  | "image_search";

const defaultSources: UploadSource[] = [
  "local",
  "camera",
  "url",
  "google_drive",
  "dropbox",
  "shutterstock",
  "gettyimages",
  "istock",
  "unsplash",
  "image_search",
];

const sourceNames: Record<string, string> = {
  local: "Máy Tính",
  camera: "Camera",
  url: "URL",
  google_drive: "Google Drive",
  dropbox: "Dropbox",
  shutterstock: "Shutterstock",
  gettyimages: "Getty Images",
  istock: "iStock",
  unsplash: "Unsplash",
  image_search: "Tìm Kiếm Ảnh",
};

export function CloudinaryUpload({
  maxFiles = 5,
  sources = defaultSources,
  resourceType = "image",
  allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"],
  maxFileSize = 10000000,
  uploadPreset,
  folder,
  subFolder,
  useTimestamp = false,
  useOriginalName = false,
  customTransformation,
  title = "Upload Ảnh",
  description = "Chọn ảnh để upload lên Cloudinary",
  showPreview = true,
  showSource = true,
  showDetails = true,
  showCopyButtons = true,
  showRemoveButtons = true,
  onUploadSuccess,
  onUploadError,
  onImageRemove,
  className = "",
  variant = "default",
}: CloudinaryUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadResult[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { lockScroll, unlockScroll } = useScrollLock();

  // Force unlock scroll when user tries to scroll
  useEffect(() => {
    const handleScroll = () => {
      // If user is trying to scroll but body is locked, force unlock
      if (document.body.classList.contains('modal-open')) {
        unlockScroll();
      }
    };

    const handleWheel = () => {
      if (document.body.classList.contains('modal-open')) {
        unlockScroll();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      unlockScroll();
    };
  }, [unlockScroll]);

  const handleUploadSuccess = (result: any) => {
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

    setUploadedImages((prev) => [imageData, ...prev]);

    if (onUploadSuccess) {
      onUploadSuccess(imageData);
    }

    const sourceName =
      sourceNames[imageData.source || ""] || "Nguồn không xác định";
    toast.success(`Upload thành công từ ${sourceName}!`);
    
    // Force unlock scroll immediately and with delay
    unlockScroll();
    setTimeout(() => {
      unlockScroll();
    }, 100);
    setTimeout(() => {
      unlockScroll();
    }, 500);
    setTimeout(() => {
      unlockScroll();
    }, 1000);
  };

  const handleUploadError = (error: any) => {
    console.error("Upload error:", error);

    if (onUploadError) {
      onUploadError(error);
    }

    toast.error("Có lỗi xảy ra khi upload ảnh");
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success("Đã copy URL vào clipboard!");
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      toast.error("Không thể copy URL");
    }
  };

  const handleRemoveImage = (publicId: string) => {
    setUploadedImages((prev) =>
      prev.filter((img) => img.public_id !== publicId)
    );

    if (onImageRemove) {
      onImageRemove(publicId);
    }

    toast.success("Đã xóa ảnh khỏi danh sách");
  };

  const handleClearAll = () => {
    setUploadedImages([]);
    toast.success("Đã xóa tất cả ảnh");
  };

  const getSourceName = (source: string) => {
    return sourceNames[source] || "Nguồn không xác định";
  };

  const renderUploadWidget = () => {
    // Build folder path
    let folderPath = "";
    if (folder) {
      folderPath = folder;
      if (subFolder) {
        folderPath += `/${subFolder}`;
      }
    }

    // Build upload options
    const uploadOptions: any = {
      maxFiles,
      sources,
      resourceType,
      clientAllowedFormats: allowedFormats,
      maxFileSize,
    };

    // Add folder path if specified
    if (folderPath) {
      uploadOptions.folder = folderPath;
      
      // When using folder, we can use public_id_prefix for better naming
      if (useTimestamp) {
        const timestamp = Date.now();
        uploadOptions.public_id_prefix = `${timestamp}_`;
      }
    } else {
      // Add timestamp if enabled (only when not using folder)
      if (useTimestamp) {
        uploadOptions.use_filename = true;
        uploadOptions.unique_filename = true;
      }

      // Add original name if enabled (only when not using folder)
      if (useOriginalName) {
        uploadOptions.use_filename = true;
        uploadOptions.unique_filename = false;
      }
    }

    // Add custom transformation if specified
    if (customTransformation) {
      uploadOptions.transformation = customTransformation;
    }

    return (
      <CldUploadWidget
        uploadPreset={
          uploadPreset ||
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
          "ml_default"
        }
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        onClose={() => {
          // Ensure body scroll is restored when widget closes
          unlockScroll();
        }}
        onAbort={() => {
          // Ensure body scroll is restored when upload is aborted
          unlockScroll();
        }}
        onOpen={() => {
          // Lock scroll when widget opens
          lockScroll();
        }}
        options={uploadOptions}
      >
              {({ open }) => (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Chọn ảnh để upload</p>
            <p className="text-sm text-muted-foreground mb-4">
              Hỗ trợ: {allowedFormats.join(", ").toUpperCase()} (tối đa{" "}
              {Math.round(maxFileSize / 1000000)}MB)
            </p>
            {folderPath && (
              <p className="text-xs text-muted-foreground mb-2">
                📁 Folder: {folderPath}
              </p>
            )}
            {sources.length > 0 && (
              <p className="text-xs text-muted-foreground mb-4">
                Nguồn: {sources.map((s) => sourceNames[s]).join(", ")}
              </p>
            )}
            <Button onClick={() => open()} className="gap-2">
              <Upload className="h-4 w-4" />
              Chọn Ảnh
            </Button>
          </div>
        )}
      </CldUploadWidget>
    );
  };

  const renderImageList = () => {
    if (uploadedImages.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ảnh Đã Upload</CardTitle>
              <CardDescription>
                Danh sách các ảnh đã upload thành công
              </CardDescription>
            </div>
            {showRemoveButtons && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700"
              >
                Xóa Tất Cả
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {uploadedImages.map((image, index) => (
              <div
                key={`${image.public_id}-${index}`}
                className="border rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  {showPreview && (
                    <div className="flex-shrink-0">
                      <img
                        src={image.secure_url}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium truncate">
                        {image.public_id}
                      </h3>
                      <div className="flex items-center gap-2">
                        {showSource && image.source && (
                          <Badge variant="outline" className="text-xs">
                            {getSourceName(image.source)}
                          </Badge>
                        )}
                        {showDetails && (
                          <div className="text-sm text-muted-foreground">
                            <span>
                              {image.width} × {image.height}
                            </span>
                            <span className="mx-1">•</span>
                            <span className="uppercase">{image.format}</span>
                          </div>
                        )}
                        {showRemoveButtons && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveImage(image.public_id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">URL:</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            value={image.secure_url}
                            readOnly
                            className="text-sm"
                          />
                          {showCopyButtons && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(image.secure_url)}
                              className="flex-shrink-0"
                            >
                              {copiedUrl === image.secure_url ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      {showDetails && (
                        <div>
                          <Label className="text-sm font-medium">
                            Public ID:
                          </Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              value={image.public_id}
                              readOnly
                              className="text-sm"
                            />
                            {showCopyButtons && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(image.public_id)}
                                className="flex-shrink-0"
                              >
                                {copiedUrl === image.public_id ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (variant === "simple") {
    return (
      <div className={className}>
        {renderUploadWidget()}
        {showPreview && renderImageList()}
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{renderUploadWidget()}</CardContent>
      </Card>

      {renderImageList()}
    </div>
  );
}
