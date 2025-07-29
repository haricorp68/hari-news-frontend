"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CloudinaryUpload, UploadResult } from "@/components/CloudinaryUpload";
import { useCreateUserNewsPost } from "@/lib/modules/post/hooks/useCreateUserNewsPost";
import { useCategory } from "@/lib/modules/category/useCategory";
import {
  ReactionSummary,
  UserNewsPostBlock,
  UserNewsPostBlockType,
} from "@/lib/modules/post/post.interface";
import { NewsTag } from "@/lib/modules/newsTag/newsTag.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Heading1,
  Heading2,
  Heading3,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  Plus,
  Trash2,
  BookOpen,
  Eye,
  UploadCloud,
  Download,
  RotateCcw,
} from "lucide-react";
import type { DragEndEvent } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TagAutoCompleteInput } from "@/components/tag/TagAutoCompleteInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import templates from "../../../../news-template.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewsDetailLayout } from "@/components/news/NewsDetailLayout";
import { useAuthStore } from "@/lib/modules/auth/auth.store";
import {
  useCreateNewsTitle,
  useCreateNewsSummary,
  useCreateNewsCoverImage,
  useCreateNewsCategoryId,
  useCreateNewsBlocks,
  useCreateNewsTags,
  useSetTitle,
  useSetSummary,
  useSetCoverImage,
  useSetCategoryId,
  useAddBlock,
  useUpdateBlock,
  useRemoveBlock,
  useReorderBlocks,
  useAddTag,
  useRemoveTag,
  useLoadFromTemplate,
  useLoadFromJSON,
  useClearAll,
} from "@/lib/modules/post/post.store";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface NewsBlock {
  id: string;
  type: UserNewsPostBlockType;
  content: string;
  placeholderContent?: string;
  media_url?: string;
  file_name?: string;
  file_size?: number;
  order: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  blocks: {
    type: UserNewsPostBlockType;
    content: string;
    order: number;
  }[];
}

interface ImportedNewsData {
  title: string;
  summary: string;
  cover_image?: string;
  blocks: {
    type: UserNewsPostBlockType;
    content: string;
    media_url?: string;
    file_name?: string;
    file_size?: number;
    order: number;
  }[];
  categoryId: string;
  tags?: string[];
}

const blockTypes = [
  {
    type: UserNewsPostBlockType.HEADING_1,
    icon: <Heading1 className="w-4 h-4" />,
    label: "Heading 1",
  },
  {
    type: UserNewsPostBlockType.HEADING_2,
    icon: <Heading2 className="w-4 h-4" />,
    label: "Heading 2",
  },
  {
    type: UserNewsPostBlockType.HEADING_3,
    icon: <Heading3 className="w-4 h-4" />,
    label: "Heading 3",
  },
  {
    type: UserNewsPostBlockType.Text,
    icon: <FileText className="w-4 h-4" />,
    label: "Văn bản",
  },
  {
    type: UserNewsPostBlockType.Image,
    icon: <ImageIcon className="w-4 h-4" />,
    label: "Ảnh",
  },
  {
    type: UserNewsPostBlockType.Video,
    icon: <Video className="w-4 h-4" />,
    label: "Video",
  },
  {
    type: UserNewsPostBlockType.File,
    icon: <File className="w-4 h-4" />,
    label: "File",
  },
];

interface SortableBlockProps {
  block: NewsBlock;
  index: number;
  renderBlockContent: (block: NewsBlock) => React.ReactNode;
  getBlockTypeName: (type: UserNewsPostBlockType) => string;
  removeBlock: (id: string) => void;
  listeners?: SyntheticListenerMap;
  attributes?: Record<string, any>;
  isDragging?: boolean;
  isDragActive?: boolean;
}

function SortableBlock({
  block,
  index,
  renderBlockContent,
  getBlockTypeName,
  removeBlock,
  listeners,
  attributes,
  isDragging,
  isDragActive,
}: SortableBlockProps) {
  if (isDragging || isDragActive) {
    return (
      <div
        className={`border rounded-lg p-3 bg-white shadow-lg ${
          isDragging
            ? "border-blue-300 bg-blue-50"
            : "border-gray-200 bg-gray-50"
        }`}
        style={{
          position: isDragging ? "relative" : undefined,
          zIndex: isDragging ? 10 : undefined,
          height: "48px",
          minHeight: "48px",
          maxHeight: "48px",
          overflow: "hidden",
        }}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2 h-full">
          <GripVertical
            className={`w-4 h-4 cursor-grab flex-shrink-0 ${
              isDragging ? "text-blue-600" : "text-gray-500"
            }`}
          />
          <span
            className={`text-sm font-medium flex-shrink-0 ${
              isDragging ? "text-blue-800" : "text-gray-700"
            }`}
          >
            Block {index + 1}
          </span>
          <Badge
            variant="secondary"
            className={`flex-shrink-0 ${
              isDragging
                ? "bg-blue-200 text-blue-800"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {getBlockTypeName(block.type)}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border rounded-lg p-4 space-y-3 bg-white flex flex-col"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 cursor-grab text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Block {index + 1}
          </span>
          <Badge variant="secondary">{getBlockTypeName(block.type)}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeBlock(block.id)}
            className="text-red-500 hover:text-red-700"
            aria-label="Xóa block"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Separator />
      {renderBlockContent(block)}
    </div>
  );
}

interface DraggableBlockProps {
  block: NewsBlock;
  index: number;
  renderBlockContent: (block: NewsBlock) => React.ReactNode;
  getBlockTypeName: (type: UserNewsPostBlockType) => string;
  removeBlock: (id: string) => void;
  isDragActive?: boolean;
}

function DraggableBlock({
  block,
  index,
  renderBlockContent,
  getBlockTypeName,
  removeBlock,
  isDragActive,
}: DraggableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SortableBlock
        block={block}
        index={index}
        renderBlockContent={renderBlockContent}
        getBlockTypeName={getBlockTypeName}
        removeBlock={removeBlock}
        listeners={listeners}
        attributes={attributes}
        isDragging={isDragging}
        isDragActive={isDragActive}
      />
    </div>
  );
}

export default function CreateNewsPage() {
  const { profile } = useAuthStore();
  const router = useRouter();
  const useCreateNewsPost = useCreateUserNewsPost();
  const { rootCategories, rootCategoriesLoading } = useCategory(undefined, {
    enabledRoot: true,
  });

  // Store data
  const title = useCreateNewsTitle();
  const summary = useCreateNewsSummary();
  const coverImage = useCreateNewsCoverImage();
  const categoryId = useCreateNewsCategoryId();
  const blocks = useCreateNewsBlocks();
  const tags = useCreateNewsTags();

  // Store actions
  const setTitle = useSetTitle();
  const setSummary = useSetSummary();
  const setCoverImage = useSetCoverImage();
  const setCategoryId = useSetCategoryId();
  const addBlockAction = useAddBlock();
  const updateBlockAction = useUpdateBlock();
  const removeBlockAction = useRemoveBlock();
  const reorderBlocks = useReorderBlocks();
  const addTagAction = useAddTag();
  const removeTagAction = useRemoveTag();
  const loadFromTemplate = useLoadFromTemplate();
  const loadFromJSON = useLoadFromJSON();
  const clearAll = useClearAll();

  // Local state
  const [isDragActive, setIsDragActive] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [importJsonDialogOpen, setImportJsonDialogOpen] = useState(false);
  const [importJsonError, setImportJsonError] = useState("");
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);

  // Handler xác nhận xóa data
  const handleClearData = useCallback(() => {
    clearAll();
    setClearDataDialogOpen(false);
    // Có thể thêm toast notification
    toast.success("Đã reset tất cả dữ liệu!");
  }, [clearAll]);

  // DnD-kit setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = () => {
    setIsDragActive(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragActive(false);
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over?.id);
      const reorderedBlocksArray = arrayMove(blocks, oldIndex, newIndex);
      reorderBlocks(reorderedBlocksArray);
    }
  };

  useEffect(() => {
    // Chỉ chạy khi đã load xong categories và có categoryId
    if (!rootCategoriesLoading && rootCategories && categoryId) {
      const categoryExists = rootCategories.find(
        (cat) => cat.id === categoryId
      );
      if (!categoryExists) {
        // Reset categoryId nếu category không tồn tại
        setCategoryId("");
        console.warn(
          `Category with ID ${categoryId} no longer exists. Resetting selection.`
        );
      }
    }
  }, [rootCategoriesLoading, rootCategories, categoryId, setCategoryId]);

  // Apply template
  const applyTemplate = useCallback(
    (template: Template) => {
      loadFromTemplate(template.blocks);
      setTemplateDialogOpen(false);
    },
    [loadFromTemplate]
  );

  // Add new block
  const addBlock = useCallback(
    (type: UserNewsPostBlockType) => {
      addBlockAction(type);
    },
    [addBlockAction]
  );

  // Update block content
  const updateBlock = useCallback(
    (id: string, updates: Partial<NewsBlock>) => {
      updateBlockAction(id, updates);
    },
    [updateBlockAction]
  );

  // Remove block
  const removeBlock = useCallback(
    (id: string) => {
      removeBlockAction(id);
    },
    [removeBlockAction]
  );

  const handleCoverImageUpload = useCallback(
    (result: UploadResult) => {
      setCoverImage(result);
    },
    [setCoverImage]
  );

  const handleBlockMediaUpload = useCallback(
    (blockId: string, result: UploadResult) => {
      updateBlock(blockId, {
        media_url: result.secure_url,
        file_name: result.public_id,
        file_size: result.bytes,
      });
    },
    [updateBlock]
  );

  // Handle tag selection
  const handleTagSelect = useCallback(
    (tag: NewsTag) => {
      addTagAction(tag);
    },
    [addTagAction]
  );

  // Remove tag
  const removeTag = useCallback(
    (tagToRemoveId: string) => {
      removeTagAction(tagToRemoveId);
    },
    [removeTagAction]
  );

  // Generate preview data
  const generatePreviewData = useCallback(() => {
    const userForPreview = profile || {
      id: "anonymous-user",
      name: "Người dùng ẩn danh",
      avatar: null,
    };
    const previewBlocks: UserNewsPostBlock[] = blocks.map((block) => ({
      ...block,
      content: block.content.trim() || block.placeholderContent || "",
    }));

    const previewPost: any = {
      id: "preview-id",
      title: title.trim() || "Tiêu đề xem trước của bài viết",
      cover_image: coverImage?.secure_url || "",
      created_at: new Date().toISOString(),
      summary:
        summary.trim() || "Tóm tắt ngắn gọn về bản xem trước bài viết...",
      blocks: previewBlocks,
      tags: tags,
      reactionSummary: {
        like: 0,
        love: 0,
        haha: 0,
        wow: 0,
        sad: 0,
        angry: 0,
      } as ReactionSummary,
      commentCount: 0,
      userReaction: undefined,
      user: userForPreview,
    };

    return { previewPost };
  }, [title, summary, coverImage, blocks, tags, profile]);

  const handleImportJson = useCallback(
    (jsonString: string) => {
      setImportJsonError("");
      try {
        const data: ImportedNewsData = JSON.parse(jsonString);
        loadFromJSON(data);
        setImportJsonDialogOpen(false);
        toast.success("Import dữ liệu thành công!");
      } catch (error: any) {
        console.error("Lỗi khi import JSON:", error);
        setImportJsonError(
          `Lỗi: ${error.message}. Vui lòng kiểm tra định dạng JSON.`
        );
      }
    },
    [loadFromJSON]
  );

  // Handle form submission
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

      if (blocks.length === 0) {
        toast.warning("Vui lòng thêm nội dung cho bài viết.");
        return;
      }

      const invalidTextBlocks = blocks.filter(
        (block) =>
          (block.type === UserNewsPostBlockType.Text ||
            block.type.startsWith("heading")) &&
          !block.content.trim()
      );

      if (invalidTextBlocks.length > 0) {
        toast.warning(
          "Vui lòng điền đầy đủ nội dung cho các block văn bản và tiêu đề."
        );
        return;
      }

      const invalidMediaBlocks = blocks.filter(
        (block) =>
          (block.type === UserNewsPostBlockType.Image ||
            block.type === UserNewsPostBlockType.Video ||
            block.type === UserNewsPostBlockType.File) &&
          !block.media_url
      );

      if (invalidMediaBlocks.length > 0) {
        toast.warning(
          "Vui lòng upload file hoặc hình ảnh cho các block media."
        );
        return;
      }

      const requestData = {
        title: title.trim(),
        summary: summary.trim(),
        cover_image: coverImage?.secure_url || "",
        categoryId,
        blocks: blocks.map((block) => ({
          type: block.type,
          content: block.content.trim(),
          media_url: block.media_url,
          file_name: block.file_name,
          file_size: block.file_size,
          order: block.order,
        })),
        tags: tags.map((tag) => tag.id),
      };

      useCreateNewsPost.mutate(requestData, {
        onSuccess: () => {
          clearAll(); // Clear draft after successful submission
          router.push("/");
        },
        onError: (error) => {
          console.error("Failed to create news post:", error);
        },
      });
    },
    [
      title,
      summary,
      categoryId,
      blocks,
      router,
      coverImage,
      tags,
      useCreateNewsPost,
      clearAll,
    ]
  );

  // Get block type name
  const getBlockTypeName = (type: UserNewsPostBlockType) => {
    switch (type) {
      case "heading_1":
        return "Heading 1";
      case "heading_2":
        return "Heading 2";
      case "heading_3":
        return "Heading 3";
      case "text":
        return "Văn bản";
      case "image":
        return "Ảnh";
      case "video":
        return "Video";
      case "file":
        return "File";
      default:
        return "Văn bản";
    }
  };

  // Get block default placeholder
  const getBlockPlaceholder = (type: UserNewsPostBlockType) => {
    switch (type) {
      case "heading_1":
        return "Tiêu đề chính...";
      case "heading_2":
        return "Tiêu đề phụ...";
      case "heading_3":
        return "Tiêu đề nhỏ...";
      case "text":
        return "Nhập nội dung văn bản...";
      case "image":
        return "Mô tả ảnh (tùy chọn)...";
      case "video":
        return "Mô tả video (tùy chọn)...";
      case "file":
        return "Mô tả file (tùy chọn)...";
      default:
        return "Nhập nội dung...";
    }
  };

  // Render block content
  const renderBlockContent = (block: NewsBlock) => {
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      updateBlock(block.id, { content: e.target.value });
    };

    const commonProps = {
      value: block.content,
      onChange: handleChange,
      placeholder: block.placeholderContent || getBlockPlaceholder(block.type),
      className: "w-full",
    };

    switch (block.type) {
      case "heading_1":
        return <Input {...commonProps} className="text-2xl font-bold" />;
      case "heading_2":
        return <Input {...commonProps} className="text-xl font-semibold" />;
      case "heading_3":
        return <Input {...commonProps} className="text-lg font-semibold" />;
      case "text":
        return <Textarea {...commonProps} rows={4} className="resize-none" />;
      case "image":
        return (
          <div className="space-y-3">
            <Textarea
              {...commonProps}
              rows={2}
              placeholder={block.placeholderContent || "Mô tả ảnh (tùy chọn)"}
            />
            <CloudinaryUpload
              value={
                block.media_url
                  ? {
                      public_id: block.file_name || "",
                      secure_url: block.media_url,
                      url: block.media_url,
                      width: 0,
                      height: 0,
                      format: "",
                      resource_type: "image",
                    }
                  : null
              }
              onUploadSuccess={(result) =>
                handleBlockMediaUpload(block.id, result)
              }
              onRemove={() =>
                updateBlock(block.id, {
                  media_url: undefined,
                  file_name: undefined,
                  file_size: undefined,
                })
              }
              allowedFormats={["jpg", "jpeg", "png", "gif", "webp"]}
              resourceType="image"
              showPreview
              showRemove
              showCopy
              label="Upload ảnh"
              description="Chọn hoặc kéo thả ảnh"
              folder="news/images"
            />
          </div>
        );
      case "video":
        return (
          <div className="space-y-3">
            <Textarea
              {...commonProps}
              rows={2}
              placeholder={block.placeholderContent || "Mô tả video (tùy chọn)"}
            />
            <CloudinaryUpload
              value={
                block.media_url
                  ? {
                      public_id: block.file_name || "",
                      secure_url: block.media_url,
                      url: block.media_url,
                      width: 0,
                      height: 0,
                      format: "",
                      resource_type: "video",
                    }
                  : null
              }
              onUploadSuccess={(result) =>
                handleBlockMediaUpload(block.id, result)
              }
              onRemove={() =>
                updateBlock(block.id, {
                  media_url: undefined,
                  file_name: undefined,
                  file_size: undefined,
                })
              }
              allowedFormats={["mp4", "avi", "mov", "wmv", "flv", "webm"]}
              resourceType="video"
              showPreview
              showRemove
              showCopy
              label="Upload video"
              description="Chọn hoặc kéo thả video"
              folder="news/videos"
            />
          </div>
        );
      case "file":
        return (
          <div className="space-y-3">
            <Textarea
              {...commonProps}
              rows={2}
              placeholder={block.placeholderContent || "Mô tả file (tùy chọn)"}
            />
            <CloudinaryUpload
              value={
                block.media_url
                  ? {
                      public_id: block.file_name || "",
                      secure_url: block.media_url,
                      url: block.media_url,
                      width: 0,
                      height: 0,
                      format: "",
                      resource_type: "raw",
                    }
                  : null
              }
              onUploadSuccess={(result) =>
                handleBlockMediaUpload(block.id, result)
              }
              onRemove={() =>
                updateBlock(block.id, {
                  media_url: undefined,
                  file_name: undefined,
                  file_size: undefined,
                })
              }
              allowedFormats={[
                "pdf",
                "doc",
                "docx",
                "xls",
                "xlsx",
                "ppt",
                "pptx",
                "txt",
              ]}
              resourceType="raw"
              showPreview
              showRemove
              showCopy
              label="Upload file"
              description="Chọn hoặc kéo thả file"
              folder="news/files"
            />
          </div>
        );
      default:
        return <Textarea {...commonProps} rows={4} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Tạo bài viết mới</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Viết và chia sẻ bài viết của bạn
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Basic Information */}
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
              <div className="flex-1 space-y-2">
                <Label>Thẻ *</Label>
                <TagAutoCompleteInput
                  onSelectTag={handleTagSelect}
                  placeholder="Tìm kiếm thẻ..."
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => removeTag(tag.id)}
                      >
                        {tag.name}
                        <span className="ml-1">×</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Label>Danh mục *</Label>
                {rootCategoriesLoading ? (
                  // Skeleton loading
                  <Skeleton className="w-full h-10 bg-gray-200 animate-pulse rounded-lg"></Skeleton>
                ) : (
                  <Select
                    value={categoryId}
                    onValueChange={setCategoryId}
                    required
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-lg focus:outline-none">
                      <SelectValue placeholder="Chọn danh mục">
                        {/* Hiển thị tên category đã chọn khi có categoryId */}
                        {categoryId && rootCategories
                          ? rootCategories.find((cat) => cat.id === categoryId)
                              ?.name || "Danh mục không tồn tại"
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {rootCategories && rootCategories.length > 0 ? (
                        rootCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>
                          Không có danh mục
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}

                {/* Hiển thị warning nếu categoryId có nhưng không tìm thấy trong danh sách */}
                {categoryId &&
                  rootCategories &&
                  !rootCategoriesLoading &&
                  !rootCategories.find((cat) => cat.id === categoryId) && (
                    <p className="text-sm text-amber-600">
                      ⚠️ Danh mục đã chọn không còn tồn tại. Vui lòng chọn danh
                      mục khác.
                    </p>
                  )}
              </div>
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

        {/* Content Blocks */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-lg md:text-xl">
                Nội dung bài viết
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Dialog
                  open={templateDialogOpen}
                  onOpenChange={setTemplateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Chọn Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-full md:max-w-4xl max-h-[90vh] md:max-h-[80vh] overflow-y-auto">
                    {" "}
                    {/* Responsive width and height */}
                    <DialogHeader>
                      <DialogTitle>Chọn Template</DialogTitle>
                      <DialogDescription>
                        Chọn một template có sẵn để bắt đầu viết bài nhanh chóng
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {templates.templates.map((template) => (
                        <Card
                          key={template.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => applyTemplate(template as any)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{template.icon}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-base mb-1">
                                  {template.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {template.description}
                                </p>
                                <div className="text-xs text-muted-foreground">
                                  {template.blocks.length} blocks
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={importJsonDialogOpen}
                  onOpenChange={setImportJsonDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <UploadCloud className="w-4 h-4 mr-2" />
                      Import JSON
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="!max-w-none w-[95vw] md:w-[90vh] lg:w-[1000px] h-[95vh] md:h-[80vh] flex flex-col">
                    <DialogHeader className="sticky top-0 z-10border-b pb-4">
                      <DialogTitle>Import Dữ liệu từ JSON</DialogTitle>
                      <DialogDescription>
                        Dán nội dung JSON của bài viết vào đây để tự động điền
                        thông tin.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-4">
                          <Label htmlFor="json-input">
                            Nội dung JSON bài viết
                          </Label>
                          <Textarea
                            id="json-input"
                            placeholder='Dán JSON của bạn vào đây, ví dụ: {"title": "...", "summary": "...", "blocks": [...]}'
                            rows={15}
                            className="font-mono text-xs"
                            onChange={() => {
                              if (importJsonError) setImportJsonError("");
                            }}
                          />
                          {importJsonError && (
                            <p className="text-red-500 text-sm">
                              {importJsonError}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={() => {
                                const jsonInput = document.getElementById(
                                  "json-input"
                                ) as HTMLTextAreaElement;
                                if (jsonInput) {
                                  handleImportJson(jsonInput.value);
                                }
                              }}
                            >
                              <Download />
                              Import
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const jsonInput = document.getElementById(
                                  "json-input"
                                ) as HTMLTextAreaElement;
                                if (jsonInput) {
                                  const emptyTemplate = {
                                    title: "",
                                    summary: "",
                                    blocks: [
                                      {
                                        type: "text",
                                        content: "",
                                        order: 1,
                                      },
                                      {
                                        type: "heading_1",
                                        content: "",
                                        order: 2,
                                      },
                                      {
                                        type: "heading_2",
                                        content: "",
                                        order: 3,
                                      },
                                      {
                                        type: "heading_3",
                                        content: "",
                                        order: 4,
                                      },
                                      {
                                        type: "image",
                                        content: "",
                                        media_url: "",
                                        order: 5,
                                      },
                                      {
                                        type: "video",
                                        content: "",
                                        media_url: "",
                                        order: 6,
                                      },
                                      {
                                        type: "file",
                                        content: "",
                                        media_url: "",
                                        file_name: "",
                                        file_size: 0,
                                        order: 7,
                                      },
                                    ],
                                  };
                                  jsonInput.value = JSON.stringify(
                                    emptyTemplate,
                                    null,
                                    2
                                  );
                                }
                              }}
                            >
                              <Plus />
                              Khung data
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-4 text-sm text-muted-foreground md:border-l md:pl-4 pt-4 md:pt-0">
                          <h4 className="font-semibold text-base text-foreground">
                            Hướng dẫn nhập JSON
                          </h4>
                          <p>Vui lòng dán JSON theo cấu trúc sau:</p>
                          <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs">
                            <code>
                              {`{
  "title": "Tiêu đề bài viết news",
  "summary": "Tóm tắt ngắn gọn về bài viết",
  "blocks": [
    {
      "type": "text",
      "content": "Đây là đoạn văn bản đầu tiên của bài viết.",
      "order": 1
    },
    {
      "type": "image",
      "content": "Mô tả cho hình ảnh",
      "media_url": "https://example.com/image1.jpg", 
      "order": 2
    },
    {
      "type": "video",
      "content": "Video giới thiệu sản phẩm",
      "media_url": "https://example.com/video.mp4", 
      "order": 4
    },
    {
      "type": "file",
      "content": "Tài liệu đính kèm",
      "media_url": "https://example.com/document.pdf", 
      "file_name": "document.pdf", 
      "file_size": 1024000, 
      "order": 5
    }
  ]
}`}
                            </code>
                          </pre>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Đối với các block loại <code>image</code>,{" "}
                              <code>video</code>, <code>file</code>:
                              <ul className="list-circle pl-5 mt-1">
                                <li>
                                  Thuộc tính <code>media_url</code>,{" "}
                                  <code>file_name</code>, <code>file_size</code>{" "}
                                  sẽ bị bỏ qua.
                                </li>
                                <li>
                                  Bạn sẽ cần tự tải lên lại các file media sau
                                  khi import để bài viết hoàn chỉnh.
                                </li>
                              </ul>
                            </li>
                            <li>
                              Mỗi block cần có <code>type</code> và{" "}
                              <code>content</code>. <code>order</code> là tùy
                              chọn, nếu không có sẽ dùng thứ tự trong JSON.
                            </li>
                            <li>
                              Các loại <code>type</code> hợp lệ:{" "}
                              <code>text</code>, <code>heading_1</code>,{" "}
                              <code>heading_2</code>, <code>heading_3</code>,{" "}
                              <code>image</code>, <code>video</code>,{" "}
                              <code>file</code>.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                {blocks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      📝
                    </div>
                    <p>Chưa có nội dung nào</p>
                    <p className="text-sm">
                      Sử dụng template hoặc nút bên dưới để thêm nội dung
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blocks.map((block, index) => (
                      <DraggableBlock
                        key={block.id}
                        block={block}
                        index={index}
                        renderBlockContent={renderBlockContent}
                        getBlockTypeName={getBlockTypeName}
                        removeBlock={removeBlock}
                        isDragActive={isDragActive}
                      />
                    ))}
                  </div>
                )}
              </SortableContext>
            </DndContext>
            <div className="flex justify-center mt-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed border-2 border-muted-foreground flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg shadow-none hover:bg-muted"
                  >
                    <Plus className="w-5 h-5 mr-1" />
                    Thêm Block Nội dung
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {blockTypes.map((type) => (
                    <DropdownMenuItem
                      key={type.type}
                      onSelect={() => addBlock(type.type)}
                    >
                      {type.icon}
                      <span className="ml-2">{type.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Clear Data Button */}
            <Dialog
              open={clearDataDialogOpen}
              onOpenChange={setClearDataDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Xóa nháp
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-red-600" />
                    Xác nhận xóa dữ liệu
                  </DialogTitle>
                  <DialogDescription className="text-left pt-2">
                    Bạn có chắc chắn muốn xóa tất cả dữ liệu đã nhập?
                    <br />
                    <span className="text-red-600 font-medium">
                      Hành động này không thể hoàn tác.
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                  {/* Action buttons */}
                  <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setClearDataDialogOpen(false)}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleClearData}
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Xác nhận
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog
              open={previewDialogOpen}
              onOpenChange={setPreviewDialogOpen}
            >
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </DialogTrigger>
              {/* Responsive DialogContent for Preview */}
              <DialogContent className="!max-w-none w-[95vw] h-[95vh] sm:w-[90vw] sm:h-[90vh] md:w-[80vw] md:h-[80vh] lg:w-[70vw] lg:h-[70vh] p-0 flex flex-col">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle>Xem trước bài viết</DialogTitle>
                  <DialogDescription>
                    Đây là bản xem trước bài viết của bạn.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                  {" "}
                  {/* Ensures content scrolls within the dialog */}
                  {previewDialogOpen && (
                    <NewsDetailLayout
                      post={generatePreviewData().previewPost}
                      isMobile={false}
                      showFooter={false}
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Button type="submit" disabled={useCreateNewsPost.isPending}>
            {useCreateNewsPost.isPending ? "Đang tạo..." : "Tạo bài viết"}
          </Button>
        </div>
      </form>
    </div>
  );
}
