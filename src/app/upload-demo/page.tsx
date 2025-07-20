'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadDemoPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleUploadSuccess = (result: any) => {
    const url = result.info.secure_url;
    setUploadedUrl(url);
    toast.success('Upload thành công!');
  };

  const handleUploadError = () => {
    toast.error('Có lỗi xảy ra khi upload');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      toast.success('Đã copy URL!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Không thể copy URL');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Ảnh Demo</h1>
          <p className="text-muted-foreground">
            Upload ảnh và nhận URL ngay lập tức
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Ảnh
            </CardTitle>
            <CardDescription>
              Chọn ảnh từ máy tính, camera, URL, Google Drive, Dropbox, Facebook, Instagram, hoặc tìm kiếm ảnh từ các nguồn khác
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
              onSuccess={handleUploadSuccess}
              onError={handleUploadError}
              options={{
                maxFiles: 1,
                sources: [
                  'local',
                  'camera',
                  'url',
                  'google_drive',
                  'dropbox',
                  'facebook',
                  'instagram',
                  'shutterstock',
                  'gettyimages',
                  'istock',
                  'unsplash',
                  'image_search'
                ],
                resourceType: 'image',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                maxFileSize: 10000000, // 10MB
              }}
            >
              {({ open }) => (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Chọn ảnh để upload</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 10MB)
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Nguồn: Máy tính, Camera, URL, Google Drive, Dropbox, Facebook, Instagram, Shutterstock, Getty Images, iStock, Unsplash
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

        {uploadedUrl && (
          <Card>
            <CardHeader>
              <CardTitle>URL Ảnh</CardTitle>
              <CardDescription>
                URL của ảnh đã upload thành công
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>URL:</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={uploadedUrl}
                      readOnly
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Preview:</Label>
                  <div className="mt-2">
                    <img
                      src={uploadedUrl}
                      alt="Uploaded preview"
                      className="max-w-full h-auto rounded-lg border"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 