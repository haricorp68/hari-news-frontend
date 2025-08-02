"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useCreateUserFeedPost } from "@/lib/modules/post/hooks/useCreateUserFeedPost";
import { Loader2, Camera, X } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUpload } from "@/lib/modules/upload/hooks/useUpload";
import { toast } from "sonner";

type PostCreateDialogProps = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

interface UploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
}

export function PostCreateDialog({
  open: controlledOpen,
  setOpen: controlledSetOpen,
}: PostCreateDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen =
    controlledSetOpen !== undefined ? controlledSetOpen : setUncontrolledOpen;
  const [caption, setCaption] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState<UploadResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createUserFeedPost, isPending: createLoading } =
    useCreateUserFeedPost();
  const { uploadMedia, isUploading } = useUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploadPromises = Array.from(files).map((file) => uploadMedia(file));
      const results = await Promise.all(uploadPromises);
      setUploadedMedia((prev) => [...prev, ...results]);
    } catch (error) {
      toast.error(
        `Có lỗi xảy ra khi tải lên: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveMedia = (index: number) => {
    setUploadedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mediaData = uploadedMedia.map((media, index) => ({
      url: media.secure_url,
      type: media.resource_type === "video" ? "video" : "image",
      order: index + 1,
    }));
    createUserFeedPost({ caption, media: mediaData });
    setCaption("");
    setUploadedMedia([]);
    setOpen(false);
  };

  const renderMediaPreview = () => {
    // Thêm logic hiển thị loading khi chưa có ảnh nào và đang tải lên
    if (isUploading && uploadedMedia.length === 0) {
      return (
        <div className="relative">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 mx-auto  animate-spin mb-2" />
          </div>
        </div>
      );
    }

    if (uploadedMedia.length === 0) {
      return (
        <div className="relative">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Click để thêm ảnh/video</p>
          </div>
        </div>
      );
    }

    const renderMedia = (
      media: UploadResult,
      idx: number,
      className: string,
      showRemove: boolean = true
    ) => (
      <div key={idx} className={`relative group ${className}`}>
        {media.resource_type === "image" ? (
          <Image
            src={media.secure_url}
            alt=""
            width={600}
            height={400}
            className="rounded-lg object-cover w-full h-full"
          />
        ) : (
          <video
            src={media.secure_url}
            controls
            className="rounded-lg object-cover w-full h-full"
          />
        )}
        {showRemove && (
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleRemoveMedia(idx)}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    );

    const MediaContainer = ({ children }: { children: React.ReactNode }) => (
      <div className="relative">
        {children}
        <div className="absolute top-3 left-3 z-10">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={isUploading}
            className="h-9 px-3 rounded-lg bg-white/95 hover:bg-white shadow-lg border border-gray-200 flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Đang tải...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Thêm ảnh/video</span>
              </>
            )}
          </Button>
        </div>
      </div>
    );

    if (uploadedMedia.length === 1) {
      return (
        <MediaContainer>
          {renderMedia(uploadedMedia[0], 0, "aspect-video")}
        </MediaContainer>
      );
    }

    if (uploadedMedia.length === 2) {
      return (
        <MediaContainer>
          <div className="grid grid-cols-2 gap-2">
            {uploadedMedia
              .slice(0, 2)
              .map((media, idx) => renderMedia(media, idx, "aspect-video"))}
          </div>
        </MediaContainer>
      );
    }

    if (uploadedMedia.length === 3) {
      return (
        <MediaContainer>
          <div className="grid grid-cols-3 gap-2 h-96">
            {renderMedia(uploadedMedia[0], 0, "col-span-2 h-full")}
            <div className="flex flex-col gap-2 h-full">
              {uploadedMedia
                .slice(1, 3)
                .map((media, idx) =>
                  renderMedia(media, idx + 1, "h-1/2 min-h-0", true)
                )}
            </div>
          </div>
        </MediaContainer>
      );
    }

    if (uploadedMedia.length === 4) {
      return (
        <MediaContainer>
          <div className="grid grid-cols-2 grid-rows-2 gap-2 h-96">
            {uploadedMedia.map((media, idx) =>
              renderMedia(media, idx, "h-full min-h-0")
            )}
          </div>
        </MediaContainer>
      );
    }

    if (uploadedMedia.length >= 5) {
      return (
        <MediaContainer>
          <div className="h-96 flex flex-col gap-2">
            <div className="flex-[3] grid grid-cols-2 gap-2">
              {uploadedMedia
                .slice(0, 2)
                .map((media, idx) => renderMedia(media, idx, "h-full"))}
            </div>
            <div className="flex-[2] grid grid-cols-3 gap-2">
              {uploadedMedia.slice(2, 5).map((media, idx) => (
                <div key={idx} className="relative group h-full">
                  {renderMedia(media, idx + 2, "h-full", true)}
                  {idx === 2 && uploadedMedia.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                      <span className="text-white text-xl font-bold">
                        +{uploadedMedia.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </MediaContainer>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
        </DialogHeader>

        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center gap-4 mb-0 pb-0 border-b-0">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
            <div>
              <div className="font-semibold text-base">Bạn</div>
              <div className="text-xs text-muted-foreground">Vừa xong</div>
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-0">
            <div className="mb-4">
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Bạn đang nghĩ gì?"
                className="resize-none border-none p-0 text-lg font-medium focus-visible:ring-0 min-h-[60px] bg-transparent"
              />
            </div>

            <div className="mb-4">{renderMediaPreview()}</div>
          </CardContent>
        </Card>

        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={
            createLoading ||
            isUploading ||
            (!caption.trim() && uploadedMedia.length === 0)
          }
        >
          {createLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang đăng...
            </>
          ) : (
            "Đăng bài"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
