import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CloudinaryUpload, UploadResult } from "@/components/CloudinaryUpload";
import { useUpdateUserNewsPost } from "@/lib/modules/post/hooks/useUpdateUserNewsPost";
import { NewsTag } from "@/lib/modules/newsTag/newsTag.interface";
import { UserNewsPost } from "@/lib/modules/post/post.interface";
import { toast } from "sonner";

import { TagsInput } from "../ui/TagsInput";
import { CategorySelector } from "../ui/CategorySelector";

interface EditNewsPostDialogProps {
  post: UserNewsPost;
  trigger: React.ReactNode;
}

export function EditNewsPostDialog({ post, trigger }: EditNewsPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [summary, setSummary] = useState(post.summary);
  const [categoryId, setCategoryId] = useState(post.category.id);
  const [coverImage, setCoverImage] = useState<UploadResult | null>(
    post.cover_image
      ? {
          public_id: "",
          secure_url: post.cover_image,
          url: post.cover_image,
          width: 0,
          height: 0,
          format: "",
          resource_type: "image",
        }
      : null
  );
  const [tags, setTags] = useState<NewsTag[]>(post.tags || []);

  const updateNewsPost = useUpdateUserNewsPost();

  const handleCoverImageUpload = useCallback((result: UploadResult) => {
    setCoverImage(result);
  }, []);

  const handleTagSelect = useCallback((tag: NewsTag) => {
    setTags((prev) =>
      prev.some((t) => t.id === tag.id) ? prev : [...prev, tag]
    );
  }, []);

  const removeTag = useCallback((tagId: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== tagId));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim()) {
        toast.warning("Vui lòng nhập tiêu đề bài viết.");
        return;
      }

      if (!summary.trim()) {
        toast.warning("Vui lòng nhập tóm tắt bài viết.");
        return;
      }

      if (!categoryId) {
        toast.warning("Vui lòng chọn danh mục.");
        return;
      }

      const requestData = {
        title: title.trim(),
        summary: summary.trim(),
        cover_image: coverImage?.secure_url || "",
        categoryId,
        tags: tags.map((tag) => tag.id),
      };

      updateNewsPost.mutate(
        { postId: post.id, data: requestData },
        {
          onSuccess: () => {
            setOpen(false);
          },
          onError: (error) => {
            console.error("Failed to update news post:", error);
            toast.error("Cập nhật bài viết thất bại. Vui lòng thử lại.");
          },
        }
      );
    },
    [title, summary, categoryId, coverImage, tags, post.id, updateNewsPost]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="!max-w-none w-[95vw] h-[95vh] sm:w-[90vw] sm:h-[90vh] md:w-[80vw] md:h-[80vh] lg:w-[70vw] lg:h-[70vh] p-0 flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Sửa bài viết</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin và nội dung bài viết của bạn.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="title">Tiêu đề bài viết *</Label>
                    <Textarea
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nhập tiêu đề bài viết..."
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="summary">Tóm tắt *</Label>
                    <Textarea
                      id="summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <TagsInput
                    tags={tags}
                    onTagSelect={handleTagSelect}
                    onRemoveTag={removeTag}
                  />
                  <CategorySelector
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ảnh bìa *</Label>
                  <CloudinaryUpload
                    value={coverImage}
                    onUploadSuccess={handleCoverImageUpload}
                    onRemove={() => setCoverImage(null)}
                    allowedFormats={["jpg", "jpeg", "png", "gif", "webp"]}
                    resourceType="image"
                    showPreview
                    showRemove
                    showCopy
                    label="Upload ảnh bìa"
                    description="Chọn hoặc kéo thả ảnh bìa cho bài viết"
                    folder="news/covers"
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateNewsPost.isPending}>
                {updateNewsPost.isPending ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
