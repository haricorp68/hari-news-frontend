"use client";

import { useState } from "react";
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
import { Copy, Upload, Image as ImageIcon, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useCloudinaryUpload, UploadResult } from "@/hooks/useCloudinaryUpload";

export default function UploadPage() {
  const {
    uploadedImages,
    addUploadedImage,
    removeUploadedImage,
    clearUploadedImages,
  } = useCloudinaryUpload();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

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
    };

    addUploadedImage(imageData);
    toast.success("Ảnh đã được upload thành công!");
  };

  const handleUploadError = (error: any) => {
    console.error("Upload error:", error);
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
    removeUploadedImage(publicId);
    toast.success("Đã xóa ảnh khỏi danh sách");
  };

  const handleClearAll = () => {
    clearUploadedImages();
    toast.success("Đã xóa tất cả ảnh");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Ảnh lên Cloudinary</h1>
          <p className="text-muted-foreground">
            Upload ảnh và nhận URL để sử dụng trong dự án của bạn
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Ảnh Mới
            </CardTitle>
            <CardDescription>
              Chọn ảnh từ máy tính, camera, URL, Google Drive, Dropbox,
              Facebook, Instagram, hoặc tìm kiếm ảnh từ các nguồn khác
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={handleUploadSuccess}
              onError={handleUploadError}
              options={{
                maxFiles: 5,
                sources: [
                  "local",
                  "camera",
                  "url",
                  "google_drive",
                  "dropbox",
                  "facebook",
                  "instagram",
                  "shutterstock",
                  "gettyimages",
                  "istock",
                  "unsplash",
                  "image_search",
                ],
                resourceType: "image",
                clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                maxFileSize: 10000000, // 10MB
              }}
            >
              {({ open }) => (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Chọn ảnh để upload</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 10MB)
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Nguồn: Máy tính, Camera, URL, Google Drive, Dropbox,
                    Facebook, Instagram, Shutterstock, Getty Images, iStock,
                    Unsplash
                  </p>
                  <Button onClick={() => open()} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Chọn Ảnh
                  </Button>
                </div>
              )}
            </CldUploadWidget>
          </CardContent>
        </Card>

        {uploadedImages.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ảnh Đã Upload</CardTitle>
                  <CardDescription>
                    Danh sách các ảnh đã upload thành công
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-red-600 hover:text-red-700"
                >
                  Xóa Tất Cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={image.public_id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={image.secure_url}
                          alt={`Uploaded image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium truncate">
                            {image.public_id}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>
                                {image.width} × {image.height}
                              </span>
                              <span>•</span>
                              <span className="uppercase">{image.format}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveImage(image.public_id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
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
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  copyToClipboard(image.secure_url)
                                }
                                className="flex-shrink-0"
                              >
                                {copiedUrl === image.secure_url ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
