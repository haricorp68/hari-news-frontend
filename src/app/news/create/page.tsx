"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
// import { CloudinaryUpload } from "@/components/CloudinaryUpload";
import { useCreateUserNewsPost } from "@/lib/modules/post/hooks/useCreateUserNewsPost";
import { useCategory } from "@/lib/modules/category/useCategory";
import { UserNewsPostBlockType } from "@/lib/modules/post/post.interface";
// import type { UploadResult } from "@/components/CloudinaryUpload";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import type { DragEndEvent } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NewsBlock {
  id: string;
  type: UserNewsPostBlockType;
  content: string;
  media_url?: string;
  file_name?: string;
  file_size?: number;
  order: number;
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
}: SortableBlockProps) {
  return (
    <div
      className={`border rounded-lg p-4 space-y-3 bg-white flex flex-col ${
        isDragging ? "opacity-60" : ""
      }`}
      style={{
        position: isDragging ? "relative" : undefined,
        zIndex: isDragging ? 10 : undefined,
      }}
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
}

function DraggableBlock({
  block,
  index,
  renderBlockContent,
  getBlockTypeName,
  removeBlock,
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
      />
    </div>
  );
}

export default function CreateNewsPage() {
  const router = useRouter();
  const { mutate: createUserNewsPost, isPending } = useCreateUserNewsPost();
  const { rootCategories, rootCategoriesLoading } = useCategory(undefined, {
    enabledRoot: true,
  });

  // Form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  // const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [blocks, setBlocks] = useState<NewsBlock[]>([]);

  // DnD-kit setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over?.id);
      setBlocks((prev) =>
        arrayMove(prev, oldIndex, newIndex).map((block, idx) => ({
          ...block,
          order: idx,
        }))
      );
    }
  };

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add new block
  const addBlock = useCallback(
    (type: UserNewsPostBlockType) => {
      const newBlock: NewsBlock = {
        id: generateId(),
        type,
        content: "",
        order: blocks.length,
      };
      setBlocks((prev) => [...prev, newBlock]);
    },
    [blocks.length]
  );

  // Update block content
  const updateBlock = useCallback((id: string, updates: Partial<NewsBlock>) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, ...updates } : block))
    );
  }, []);

  // Remove block
  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) =>
      prev
        .filter((block) => block.id !== id)
        .map((block, index) => ({ ...block, order: index }))
    );
  }, []);

  // // Handle cover image upload
  // const handleCoverImageUpload = useCallback((result: UploadResult) => {
  //   setCoverImage(result.secure_url);
  //   toast.success("Ảnh bìa đã được upload thành công!");
  // }, []);

  // // Handle block media upload
  // const handleBlockMediaUpload = useCallback((blockId: string, result: UploadResult) => {
  //   updateBlock(blockId, {
  //     media_url: result.secure_url,
  //     file_name: result.public_id,
  //     file_size: result.bytes,
  //   });
  //   toast.success("Media đã được upload thành công!");
  // }, [updateBlock]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim()) {
        toast.error("Vui lòng nhập tiêu đề bài viết");
        return;
      }

      if (!summary.trim()) {
        toast.error("Vui lòng nhập tóm tắt bài viết");
        return;
      }

      // if (!coverImage) {
      //   toast.error("Vui lòng upload ảnh bìa");
      //   return;
      // }

      if (!categoryId) {
        toast.error("Vui lòng chọn danh mục");
        return;
      }

      if (blocks.length === 0) {
        toast.error("Vui lòng thêm ít nhất một block nội dung");
        return;
      }

      const invalidBlocks = blocks.filter((block) => !block.content.trim());
      if (invalidBlocks.length > 0) {
        toast.error("Vui lòng nhập nội dung cho tất cả các block");
        return;
      }

      const requestData = {
        title: title.trim(),
        summary: summary.trim(),
        cover_image: "", // coverImage,
        categoryId,
        blocks: blocks.map((block) => ({
          type: block.type,
          content: block.content.trim(),
          media_url: block.media_url,
          file_name: block.file_name,
          file_size: block.file_size,
          order: block.order,
        })),
      };

      try {
        await createUserNewsPost(requestData);
        toast.success("Bài viết đã được tạo thành công!");
        router.push("/");
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tạo bài viết");
        console.error("Create news error:", error);
      }
    },
    [title, summary, categoryId, blocks, createUserNewsPost, router]
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

  // Get block placeholder
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
      placeholder: getBlockPlaceholder(block.type),
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
              placeholder="Mô tả ảnh (tùy chọn)"
            />
            {/* <CloudinaryUpload ... /> */}
            <div className="bg-muted p-4 rounded-lg text-center text-muted-foreground">
              UPLOAD ĐÃ BỊ COMMENT
            </div>
          </div>
        );
      case "video":
        return (
          <div className="space-y-3">
            <Textarea
              {...commonProps}
              rows={2}
              placeholder="Mô tả video (tùy chọn)"
            />
            {/* <CloudinaryUpload ... /> */}
            <div className="bg-muted p-4 rounded-lg text-center text-muted-foreground">
              UPLOAD ĐÃ BỊ COMMENT
            </div>
          </div>
        );
      case "file":
        return (
          <div className="space-y-3">
            <Textarea
              {...commonProps}
              rows={2}
              placeholder="Mô tả file (tùy chọn)"
            />
            {/* <CloudinaryUpload ... /> */}
            <div className="bg-muted p-4 rounded-lg text-center text-muted-foreground">
              UPLOAD ĐÃ BỊ COMMENT
            </div>
          </div>
        );
      default:
        return <Textarea {...commonProps} rows={4} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Tạo bài viết mới</h1>
            <p className="text-muted-foreground">
              Viết và chia sẻ bài viết của bạn
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề bài viết *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                required
              />
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label>Danh mục *</Label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Chọn danh mục</option>
                {rootCategoriesLoading ? (
                  <option value="loading" disabled>
                    Đang tải...
                  </option>
                ) : rootCategories && rootCategories.length > 0 ? (
                  rootCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="no-categories" disabled>
                    Không có danh mục
                  </option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Ảnh bìa *</Label>
              {/* {!coverImage ? (
                <CloudinaryUpload ... />
              ) : ( ... )} */}
              <div className="bg-muted p-4 rounded-lg text-center text-muted-foreground">
                UPLOAD ĐÃ BỊ COMMENT
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Blocks */}
        <Card>
          <CardHeader>
            <CardTitle>Nội dung bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
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
                      Sử dụng nút bên dưới để thêm nội dung
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
                      />
                    ))}
                  </div>
                )}
              </SortableContext>
            </DndContext>
            {/* Dropdown tạo block nằm ở dưới cùng card */}
            <div className="flex justify-center mt-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed border-2 border-muted-foreground flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg shadow-none hover:bg-muted"
                  >
                    <Plus className="w-5 h-5" />
                    Tạo block
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  {blockTypes.map((block) => (
                    <DropdownMenuItem
                      key={block.type}
                      onClick={() => addBlock(block.type)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {block.icon}
                      <span>{block.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Nút tạo bài viết ở dưới cùng */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full mt-8 text-base h-12"
        >
          {isPending ? "Đang tạo..." : "Tạo bài viết"}
        </Button>
      </form>
    </div>
  );
}
