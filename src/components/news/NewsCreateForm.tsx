"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CloudinaryUpload,
  type UploadResult,
} from "@/components/CloudinaryUpload";
import { useCreateUserNewsPost } from "@/lib/modules/post/hooks/useCreateUserNewsPost";
import { useCategory } from "@/lib/modules/category/useCategory";
import { toast } from "sonner";
import {
  Trash2,
  Type,
  Image,
  Video,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Save,
  ArrowLeft,
} from "lucide-react";
import type {
  CreateUserNewsPostRequest,
  CreateUserNewsPostBlockRequest,
} from "@/lib/modules/post/post.interface";
import { UserNewsPostBlockType } from "@/lib/modules/post/post.interface";

const blockTypeOptions = [
  { value: UserNewsPostBlockType.Text, label: "Văn bản", icon: Type },
  {
    value: UserNewsPostBlockType.HEADING_1,
    label: "Tiêu đề 1",
    icon: Heading1,
  },
  {
    value: UserNewsPostBlockType.HEADING_2,
    label: "Tiêu đề 2",
    icon: Heading2,
  },
  {
    value: UserNewsPostBlockType.HEADING_3,
    label: "Tiêu đề 3",
    icon: Heading3,
  },
  { value: UserNewsPostBlockType.Image, label: "Hình ảnh", icon: Image },
  { value: UserNewsPostBlockType.Video, label: "Video", icon: Video },
  { value: UserNewsPostBlockType.File, label: "Tệp tin", icon: FileText },
];

export function NewsCreateForm() {
  const router = useRouter();
  const { mutate: createNewsPost, isPending } = useCreateUserNewsPost();
  const { categories } = useCategory();

  // Form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [blocks, setBlocks] = useState<CreateUserNewsPostBlockRequest[]>([]);

  // Handle cover image upload
  const handleCoverImageUpload = (result: UploadResult) => {
    setCoverImage(result.secure_url);
    toast.success("Đã upload ảnh bìa thành công!");
  };

  // Handle block content upload
  const handleBlockImageUpload = (result: UploadResult, blockIndex: number) => {
    setBlocks((prev) =>
      prev.map((block, index) =>
        index === blockIndex
          ? { ...block, media_url: result.secure_url }
          : block
      )
    );
    toast.success("Đã upload ảnh cho khối nội dung!");
  };

  // Add new block
  const addBlock = (type: UserNewsPostBlockType) => {
    const newBlock: CreateUserNewsPostBlockRequest = {
      type: type as CreateUserNewsPostBlockRequest["type"],
      content: "",
      order: blocks.length,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  // Remove block
  const removeBlock = (index: number) => {
    setBlocks((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((block, i) => ({ ...block, order: i }))
    );
  };

  // Update block content
  const updateBlock = (
    index: number,
    updates: Partial<CreateUserNewsPostBlockRequest>
  ) => {
    setBlocks((prev) =>
      prev.map((block, i) => (i === index ? { ...block, ...updates } : block))
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài báo");
      return;
    }

    if (!summary.trim()) {
      toast.error("Vui lòng nhập tóm tắt bài báo");
      return;
    }

    if (!coverImage) {
      toast.error("Vui lòng upload ảnh bìa");
      return;
    }

    if (!categoryId) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    if (blocks.length === 0) {
      toast.error("Vui lòng thêm ít nhất một khối nội dung");
      return;
    }

    const request: CreateUserNewsPostRequest = {
      title: title.trim(),
      summary: summary.trim(),
      cover_image: coverImage,
      categoryId,
      blocks: blocks.map((block, index) => ({
        ...block,
        order: index,
      })),
    };

    createNewsPost(request, {
      onSuccess: (response) => {
        toast.success("Tạo bài báo thành công!");
        router.push(`/news/${response.data.id}`);
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi tạo bài báo");
        console.error("Create news error:", error);
      },
    });
  };

  const getBlockIcon = (type: string) => {
    const option = blockTypeOptions.find((opt) => opt.value === type);
    return option?.icon || Type;
  };

  const getBlockLabel = (type: string) => {
    const option = blockTypeOptions.find((opt) => opt.value === type);
    return option?.label || "Văn bản";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {isPending ? "Đang tạo..." : "Tạo bài báo"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề bài báo *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài báo..."
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="summary">Tóm tắt *</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn về nội dung bài báo..."
                  className="mt-1"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Danh mục *</Label>
                <Select
                  value={categoryId}
                  onValueChange={setCategoryId}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn danh mục..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Content Blocks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Nội dung bài báo</CardTitle>
                <div className="flex gap-2">
                  {blockTypeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.value}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addBlock(option.value)}
                        className="gap-1"
                      >
                        <Icon className="h-3 w-3" />
                        {option.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {blocks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>
                    Chưa có nội dung nào. Hãy thêm các khối nội dung để bắt đầu
                    viết bài báo.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blocks.map((block, index) => {
                    const Icon = getBlockIcon(block.type);
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <Badge variant="outline">
                              {getBlockLabel(block.type)}
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBlock(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {block.type === UserNewsPostBlockType.Text && (
                          <Textarea
                            value={block.content}
                            onChange={(e) =>
                              updateBlock(index, { content: e.target.value })
                            }
                            placeholder="Nhập nội dung văn bản..."
                            rows={4}
                          />
                        )}

                        {(block.type === UserNewsPostBlockType.HEADING_1 ||
                          block.type === UserNewsPostBlockType.HEADING_2 ||
                          block.type === UserNewsPostBlockType.HEADING_3) && (
                          <Input
                            value={block.content}
                            onChange={(e) =>
                              updateBlock(index, { content: e.target.value })
                            }
                            placeholder="Nhập tiêu đề..."
                            className={
                              block.type === UserNewsPostBlockType.HEADING_1
                                ? "text-2xl font-bold"
                                : block.type === UserNewsPostBlockType.HEADING_2
                                ? "text-xl font-semibold"
                                : "text-lg font-medium"
                            }
                          />
                        )}

                        {block.type === UserNewsPostBlockType.Image && (
                          <div className="space-y-3">
                            <Textarea
                              value={block.content}
                              onChange={(e) =>
                                updateBlock(index, { content: e.target.value })
                              }
                              placeholder="Mô tả hình ảnh (alt text)..."
                              rows={2}
                            />
                            {block.media_url ? (
                              <div className="relative">
                                <img
                                  src={block.media_url}
                                  alt={block.content || "Uploaded image"}
                                  className="w-full max-w-md rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateBlock(index, { media_url: undefined })
                                  }
                                  className="absolute top-2 right-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <CloudinaryUpload
                                onUploadSuccess={(result) =>
                                  handleBlockImageUpload(result, index)
                                }
                                variant="simple"
                                title="Upload hình ảnh"
                                description="Chọn hình ảnh cho khối nội dung này"
                                folder="news"
                                subFolder="content"
                                maxFiles={1}
                                sources={["local", "camera", "url"]}
                                showPreview={false}
                                showSource={false}
                                showDetails={false}
                                showCopyButtons={false}
                                showRemoveButtons={false}
                              />
                            )}
                          </div>
                        )}

                        {block.type === UserNewsPostBlockType.Video && (
                          <div className="space-y-3">
                            <Textarea
                              value={block.content}
                              onChange={(e) =>
                                updateBlock(index, { content: e.target.value })
                              }
                              placeholder="Mô tả video..."
                              rows={2}
                            />
                            {block.media_url ? (
                              <div className="relative">
                                <video
                                  src={block.media_url}
                                  controls
                                  className="w-full max-w-md rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateBlock(index, { media_url: undefined })
                                  }
                                  className="absolute top-2 right-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <CloudinaryUpload
                                onUploadSuccess={(result) =>
                                  handleBlockImageUpload(result, index)
                                }
                                variant="simple"
                                title="Upload video"
                                description="Chọn video cho khối nội dung này"
                                folder="news"
                                subFolder="content"
                                resourceType="video"
                                allowedFormats={["mp4", "mov", "avi", "webm"]}
                                maxFiles={1}
                                sources={["local", "camera", "url"]}
                                showPreview={false}
                                showSource={false}
                                showDetails={false}
                                showCopyButtons={false}
                                showRemoveButtons={false}
                              />
                            )}
                          </div>
                        )}

                        {block.type === UserNewsPostBlockType.File && (
                          <div className="space-y-3">
                            <Textarea
                              value={block.content}
                              onChange={(e) =>
                                updateBlock(index, { content: e.target.value })
                              }
                              placeholder="Mô tả tệp tin..."
                              rows={2}
                            />
                            {block.media_url ? (
                              <div className="flex items-center gap-2 p-3 border rounded-lg">
                                <FileText className="h-5 w-5" />
                                <span className="flex-1">
                                  {block.file_name || "Tệp tin"}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateBlock(index, { media_url: undefined })
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <CloudinaryUpload
                                onUploadSuccess={(result) =>
                                  handleBlockImageUpload(result, index)
                                }
                                variant="simple"
                                title="Upload tệp tin"
                                description="Chọn tệp tin cho khối nội dung này"
                                folder="news"
                                subFolder="files"
                                resourceType="raw"
                                allowedFormats={[
                                  "pdf",
                                  "doc",
                                  "docx",
                                  "txt",
                                  "zip",
                                  "rar",
                                ]}
                                maxFiles={1}
                                sources={["local", "url"]}
                                showPreview={false}
                                showSource={false}
                                showDetails={false}
                                showCopyButtons={false}
                                showRemoveButtons={false}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Ảnh bìa *</CardTitle>
            </CardHeader>
            <CardContent>
              {coverImage ? (
                <div className="relative">
                  <img
                    src={coverImage}
                    alt="Cover image"
                    className="w-full rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <CloudinaryUpload
                  onUploadSuccess={handleCoverImageUpload}
                  variant="simple"
                  title="Upload ảnh bìa"
                  description="Chọn ảnh bìa cho bài báo"
                  folder="news"
                  subFolder="covers"
                  maxFiles={1}
                  sources={["local", "camera", "url", "unsplash"]}
                  showPreview={false}
                  showSource={false}
                  showDetails={false}
                  showCopyButtons={false}
                  showRemoveButtons={false}
                />
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Xem trước</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Tiêu đề:</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {title || "Chưa có tiêu đề"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Tóm tắt:</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {summary || "Chưa có tóm tắt"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Danh mục:</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {categories?.find((c) => c.id === categoryId)?.name ||
                      "Chưa chọn danh mục"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Số khối nội dung:
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {blocks.length} khối
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
