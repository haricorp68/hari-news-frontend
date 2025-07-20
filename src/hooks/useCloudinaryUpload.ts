import { useState } from 'react';

export interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
}

export interface UseCloudinaryUploadReturn {
  uploadedImages: UploadResult[];
  addUploadedImage: (result: UploadResult) => void;
  clearUploadedImages: () => void;
  removeUploadedImage: (publicId: string) => void;
}

export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [uploadedImages, setUploadedImages] = useState<UploadResult[]>([]);

  const addUploadedImage = (result: UploadResult) => {
    setUploadedImages(prev => [result, ...prev]);
  };

  const clearUploadedImages = () => {
    setUploadedImages([]);
  };

  const removeUploadedImage = (publicId: string) => {
    setUploadedImages(prev => prev.filter(img => img.public_id !== publicId));
  };

  return {
    uploadedImages,
    addUploadedImage,
    clearUploadedImages,
    removeUploadedImage,
  };
} 