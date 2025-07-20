"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CloudinaryUpload, type UploadResult } from "@/components/CloudinaryUpload";
import { useCreateUserNewsPost } from "@/lib/modules/post/hooks/useCreateUserNewsPost";
import { useCategory } from "@/lib/modules/category/useCategory";
import { toast } from "sonner";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatFullTime } from "@/utils/formatTime";
import { NewsTOC } from "@/components/news/NewsTOC";
import { useSidebar } from "@/components/ui/sidebar";
import { 
  Trash2, 
  Type, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Heading1, 
  Heading2, 
  Heading3,
  Save,
  ArrowLeft,
  Eye,
  Edit,
} from "lucide-react";
import type { 
  CreateUserNewsPostRequest, 
  CreateUserNewsPostBlockRequest
} from "@/lib/modules/post/post.interface";
import { UserNewsPostBlockType } from "@/lib/modules/post/post.interface";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";

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
  { value: UserNewsPostBlockType.Image, label: "Hình ảnh", icon: ImageIcon },
  { value: UserNewsPostBlockType.Video, label: "Video", icon: Video },
  { value: UserNewsPostBlockType.File, label: "Tệp tin", icon: FileText },
];

export function NewsCreateForm() {
  const router = useRouter();
  const { mutate: createNewsPost, isPending } = useCreateUserNewsPost();
  const { categories } = useCategory();
  const { state, isMobile } = useSidebar();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

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
    setBlocks(prev => prev.map((block, index) => 
      index === blockIndex 
        ? { ...block, media_url: result.secure_url }
        : block
    ));
    toast.success("Đã upload ảnh cho khối nội dung!");
  };

  // Add new block
  const addBlock = (type: UserNewsPostBlockType) => {
    const newBlock: CreateUserNewsPostBlockRequest = {
      type: type as CreateUserNewsPostBlockRequest["type"],
      content: "",
      order: blocks.length,
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  // Remove block
  const removeBlock = (index: number) => {
    setBlocks(prev => prev.filter((_, i) => i !== index).map((block, i) => ({ ...block, order: i })));
  };

  // Update block content
  const updateBlock = (index: number, updates: Partial<CreateUserNewsPostBlockRequest>) => {
    setBlocks(prev => prev.map((block, i) => 
      i === index ? { ...block, ...updates } : block
    ));
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
    const option = blockTypeOptions.find(opt => opt.value === type);
    return option?.icon || Type;
  };

  const getBlockLabel = (type: string) => {
    const option = blockTypeOptions.find(opt => opt.value === type);
    return option?.label || "Văn bản";
  };

  // Slugify function for TOC
  const slugify = (str: string) =>
    (str ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9\u00C0-\u1EF9\s-]/gi, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  // Generate TOC from blocks
  const toc = blocks
    .filter(block => 
      block.type === "heading_1" || 
      block.type === "heading_2" || 
      block.type === "heading_3"
    )
    .map(block => ({
      id: slugify(block.content),
      label: block.content || "Tiêu đề",
      level: block.type === "heading_1" ? 1 : block.type === "heading_2" ? 2 : 3,
    }));

  return (
    <div className="min-h-screen bg-background flex flex-row items-start">
      {/* Header Actions */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        
        <Button
          type="button"
          variant={isPreviewMode ? "default" : "outline"}
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="gap-2"
        >
          {isPreviewMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {isPreviewMode ? "Chỉnh sửa" : "Xem trước"}
        </Button>
        
        <Button
          type="submit"
          disabled={isPending}
          onClick={handleSubmit}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Đang tạo..." : "Tạo bài báo"}
        </Button>
      </div>

      {/* Nội dung chính */}
      <main className="flex-1 w-full mx-auto md:px-0">
        <div className="w-full flex flex-col md:flex-row items-start md:items-stretch relative">
          {/* Main content */}
          <div className="flex-1 flex flex-col items-center">
            {/* Cover image */}
            <div className="relative w-full aspect-[16/9] max-w-5xl mx-auto">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={title || "cover"}
                  fill
                  className="object-cover w-full h-full"
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
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
                </div>
              )}
            </div>

            <div className="w-full max-w-3xl mx-auto px-2">
              {/* Title & meta */}
              {isPreviewMode ? (
                <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight mt-8">
                  {title || "[Nhập tên bài viết]"}
                </h1>
              ) : (
                <div className="mt-8 mb-2">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tên bài viết..."
                    className="text-3xl md:text-4xl font-bold border-none p-0 h-auto resize-none focus:ring-0 focus:border-none"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="text-base font-medium text-gray-800">
                    Tác giả
                  </span>
                </div>
                <div className="flex flex-col items-end text-xs text-gray-500 min-w-fit">
                  <span>{formatFullTime(new Date().toISOString())}</span>
                </div>
              </div>

              {/* Summary */}
              {isPreviewMode ? (
                <div className="text-lg text-gray-700 mb-6">
                  {summary || "[Nhập tóm tắt bài viết]"}
                </div>
              ) : (
                <div className="mb-6">
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Nhập tóm tắt bài viết..."
                    className="text-lg text-gray-700 border-none p-0 h-auto resize-none focus:ring-0 focus:border-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Category selector */}
              {!isPreviewMode && (
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-600">Danh mục:</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="w-full max-w-xs">
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
              )}

              {/* Content blocks */}
              <div className="prose prose-neutral max-w-none mb-8">
                {blocks.length === 0 && !isPreviewMode ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">Chưa có nội dung nào</p>
                    <div className="flex flex-wrap gap-2 justify-center">
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
                ) : (
                  blocks.map((block, idx) => {
                    if (isPreviewMode) {
                      // Preview mode - render like the detail page
                      if (block.type === "heading_1")
                        return (
                          <h2
                            key={idx}
                            id={slugify(block.content)}
                            className="text-2xl font-bold mt-8 mb-2 scroll-mt-24"
                          >
                            {block.content || "[Nhập tiêu đề 1]"}
                          </h2>
                        );
                      if (block.type === "heading_2")
                        return (
                          <h3
                            key={idx}
                            id={slugify(block.content)}
                            className="text-xl font-semibold mt-6 mb-2 scroll-mt-24"
                          >
                            {block.content || "[Nhập tiêu đề 2]"}
                          </h3>
                        );
                      if (block.type === "heading_3")
                        return (
                          <h4
                            key={idx}
                            id={slugify(block.content)}
                            className="text-lg font-semibold mt-4 mb-2 scroll-mt-24"
                          >
                            {block.content || "[Nhập tiêu đề 3]"}
                          </h4>
                        );
                      if (block.type === "text")
                        return (
                          <p key={idx} className="mb-4 text-base">
                            {block.content || "[Nhập nội dung văn bản]"}
                          </p>
                        );
                      if (block.type === "image" && block.media_url)
                        return (
                          <div key={idx} className="my-6 flex flex-col items-center w-full">
                            <Image
                              src={block.media_url}
                              alt={block.content || "image"}
                              width={900}
                              height={500}
                              className="rounded-xl object-contain max-h-[500px] w-full max-w-3xl"
                            />
                            {block.content && (
                              <div className="text-sm text-gray-500 mt-2 italic">
                                {block.content}
                              </div>
                            )}
                          </div>
                        );
                      if (block.type === "video" && block.media_url)
                        return (
                          <div key={idx} className="my-6 flex flex-col items-center w-full">
                            <video
                              src={block.media_url}
                              controls
                              className="rounded-xl max-w-3xl w-full max-h-[500px] bg-black"
                            />
                            {block.content && (
                              <div className="text-sm text-gray-500 mt-2">
                                {block.content}
                              </div>
                            )}
                          </div>
                        );
                      if (block.type === "file" && block.media_url) {
                        const sizeMB = block.file_size ? `(${(block.file_size / 1024 / 1024).toFixed(1)} MB)` : "";
                        return (
                          <div key={idx} className="my-6 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 w-full max-w-3xl mx-auto">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-blue-700">
                                {block.file_name || "Tài liệu đính kèm"} {sizeMB}
                              </div>
                              {block.content && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {block.content}
                                </div>
                              )}
                            </div>
                            <a
                              href={block.media_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
                            >
                              Tải về
                            </a>
                          </div>
                        );
                      }
                      return null;
                    } else {
                      // Edit mode - render editable inputs
                      return (
                        <div key={idx} className="border rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const Icon = getBlockIcon(block.type);
                                return <Icon className="h-4 w-4" />;
                              })()}
                              <Badge variant="outline">
                                {getBlockLabel(block.type)}
                              </Badge>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBlock(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {block.type === "text" && (
                            <Textarea
                              value={block.content}
                              onChange={(e) => updateBlock(idx, { content: e.target.value })}
                              placeholder="Nhập nội dung văn bản..."
                              rows={4}
                            />
                          )}

                          {(block.type === "heading_1" || block.type === "heading_2" || block.type === "heading_3") && (
                            <Input
                              value={block.content}
                              onChange={(e) => updateBlock(idx, { content: e.target.value })}
                              placeholder="Nhập tiêu đề..."
                              className={
                                block.type === "heading_1" ? "text-2xl font-bold" :
                                block.type === "heading_2" ? "text-xl font-semibold" :
                                "text-lg font-medium"
                              }
                            />
                          )}

                          {block.type === "image" && (
                            <div className="space-y-3">
                              <Textarea
                                value={block.content}
                                onChange={(e) => updateBlock(idx, { content: e.target.value })}
                                placeholder="Mô tả hình ảnh (alt text)..."
                                rows={2}
                              />
                              {block.media_url ? (
                                <div className="relative">
                                  <Image
                                    src={block.media_url}
                                    alt={block.content || "Uploaded image"}
                                    width={400}
                                    height={300}
                                    className="w-full max-w-md rounded-lg"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateBlock(idx, { media_url: undefined })}
                                    className="absolute top-2 right-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <CloudinaryUpload
                                  onUploadSuccess={(result) => handleBlockImageUpload(result, idx)}
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

                          {block.type === "video" && (
                            <div className="space-y-3">
                              <Textarea
                                value={block.content}
                                onChange={(e) => updateBlock(idx, { content: e.target.value })}
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
                                    onClick={() => updateBlock(idx, { media_url: undefined })}
                                    className="absolute top-2 right-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <CloudinaryUpload
                                  onUploadSuccess={(result) => handleBlockImageUpload(result, idx)}
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

                          {block.type === "file" && (
                            <div className="space-y-3">
                              <Textarea
                                value={block.content}
                                onChange={(e) => updateBlock(idx, { content: e.target.value })}
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
                                    onClick={() => updateBlock(idx, { media_url: undefined })}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <CloudinaryUpload
                                  onUploadSuccess={(result) => handleBlockImageUpload(result, idx)}
                                  variant="simple"
                                  title="Upload tệp tin"
                                  description="Chọn tệp tin cho khối nội dung này"
                                  folder="news"
                                  subFolder="files"
                                  resourceType="raw"
                                  allowedFormats={["pdf", "doc", "docx", "txt", "zip", "rar"]}
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
                    }
                  })
                )}

                {/* Add block button */}
                {!isPreviewMode && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-500 mb-4">Thêm nội dung mới</p>
                    <div className="flex flex-wrap gap-2 justify-center">
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
                )}

                <Separator className="my-8 border-t-2 border-dashed border-muted" />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* TOC responsive, aside phải, floating cho mobile */}
      {!isMobile && toc.length > 0 && (
        <aside
          className="hidden md:block transition-all duration-200"
          style={{
            width: state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON,
            minWidth: state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON,
            maxWidth: state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON,
          }}
        >
          <div className="fixed h-[calc(100vh-4rem)]">
            <NewsTOC toc={toc} />
          </div>
        </aside>
      )}
      {/* TOC floating cho mobile sẽ tự xử lý trong NewsTOC */}
    </div>
  );
}
