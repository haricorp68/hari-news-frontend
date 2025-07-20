'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Upload, Check, Globe, Camera, HardDrive, Cloud, Share2, Search } from 'lucide-react';
import { toast } from 'sonner';

const uploadSources = [
  {
    id: 'local',
    name: 'Máy Tính',
    description: 'Chọn file từ máy tính của bạn',
    icon: HardDrive,
    color: 'bg-blue-500'
  },
  {
    id: 'camera',
    name: 'Camera',
    description: 'Chụp ảnh trực tiếp từ camera',
    icon: Camera,
    color: 'bg-green-500'
  },
  {
    id: 'url',
    name: 'URL',
    description: 'Nhập URL của ảnh từ internet',
    icon: Globe,
    color: 'bg-purple-500'
  },
  {
    id: 'google_drive',
    name: 'Google Drive',
    description: 'Chọn ảnh từ Google Drive',
    icon: Cloud,
    color: 'bg-yellow-500'
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Chọn ảnh từ Dropbox',
    icon: Cloud,
    color: 'bg-blue-600'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Chọn ảnh từ Facebook',
    icon: Share2,
    color: 'bg-blue-700'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Chọn ảnh từ Instagram',
    icon: Share2,
    color: 'bg-pink-500'
  },
  {
    id: 'shutterstock',
    name: 'Shutterstock',
    description: 'Tìm kiếm ảnh từ Shutterstock',
    icon: Search,
    color: 'bg-orange-500'
  },
  {
    id: 'gettyimages',
    name: 'Getty Images',
    description: 'Tìm kiếm ảnh từ Getty Images',
    icon: Search,
    color: 'bg-gray-700'
  },
  {
    id: 'istock',
    name: 'iStock',
    description: 'Tìm kiếm ảnh từ iStock',
    icon: Search,
    color: 'bg-red-500'
  },
  {
    id: 'unsplash',
    name: 'Unsplash',
    description: 'Tìm kiếm ảnh miễn phí từ Unsplash',
    icon: Search,
    color: 'bg-black'
  },
  {
    id: 'image_search',
    name: 'Tìm Kiếm Ảnh',
    description: 'Tìm kiếm ảnh từ nhiều nguồn khác nhau',
    icon: Search,
    color: 'bg-indigo-500'
  }
];

export default function UploadSourcesPage() {
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleUploadSuccess = (result: any) => {
    const imageData = {
      public_id: result.info.public_id,
      secure_url: result.info.secure_url,
      url: result.info.url,
      width: result.info.width,
      height: result.info.height,
      format: result.info.format,
      resource_type: result.info.resource_type,
      source: result.info.source || 'unknown',
      created_at: new Date().toLocaleString('vi-VN')
    };
    
    setUploadedImages(prev => [imageData, ...prev]);
    toast.success(`Upload thành công từ ${getSourceName(result.info.source)}!`);
  };

  const handleUploadError = (error: any) => {
    console.error('Upload error:', error);
    toast.error('Có lỗi xảy ra khi upload ảnh');
  };

  const getSourceName = (source: string) => {
    const sourceInfo = uploadSources.find(s => s.id === source);
    return sourceInfo ? sourceInfo.name : 'Nguồn không xác định';
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success('Đã copy URL vào clipboard!');
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      toast.error('Không thể copy URL');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Ảnh từ Nhiều Nguồn</h1>
          <p className="text-muted-foreground">
            Khám phá tất cả các nguồn upload ảnh có sẵn với Cloudinary
          </p>
        </div>

        {/* Upload Widget */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Ảnh
            </CardTitle>
            <CardDescription>
              Chọn nguồn upload từ danh sách bên dưới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
              onSuccess={handleUploadSuccess}
              onError={handleUploadError}
              options={{
                maxFiles: 10,
                sources: uploadSources.map(s => s.id),
                resourceType: 'image',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                maxFileSize: 10000000, // 10MB
              }}
            >
              {({ open }) => (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Bắt đầu Upload</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click để mở widget upload với tất cả các nguồn có sẵn
                  </p>
                  <Button onClick={() => open()} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Mở Upload Widget
                  </Button>
                </div>
              )}
            </CldUploadWidget>
          </CardContent>
        </Card>

        {/* Sources Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Các Nguồn Upload Có Sẵn</CardTitle>
            <CardDescription>
              Danh sách tất cả các nguồn mà bạn có thể upload ảnh từ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadSources.map((source) => {
                const IconComponent = source.icon;
                return (
                  <div
                    key={source.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${source.color}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{source.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {source.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {source.id}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ảnh Đã Upload</CardTitle>
              <CardDescription>
                Danh sách các ảnh đã upload thành công từ các nguồn khác nhau
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={`${image.public_id}-${index}`} className="border rounded-lg p-4">
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
                          <h3 className="font-medium truncate">{image.public_id}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getSourceName(image.source)}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              {image.width} × {image.height}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mb-2">
                          Upload lúc: {image.created_at}
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
                                onClick={() => copyToClipboard(image.secure_url)}
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