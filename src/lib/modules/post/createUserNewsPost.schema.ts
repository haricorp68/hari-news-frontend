import { z } from "zod";

export const createUserNewsPostBlockSchema = z.object({
  type: z.enum([
    "text",
    "image",
    "video",
    "file",
    "heading_1",
    "heading_2",
    "heading_3",
  ]),
  content: z.string().trim().min(1, "Nội dung block không được để trống"),
  media_url: z.string().optional().nullable(),
  file_name: z.string().optional().nullable(),
  file_size: z.number().optional().nullable(),
  order: z.number(),
});

export const createUserNewsPostSchema = z.object({
  title: z.string().trim().min(1, "Tiêu đề không được để trống"),
  summary: z.string().trim().min(1, "Tóm tắt không được để trống"),
  cover_image: z.string().trim().min(1, "Ảnh bìa không được để trống"),
  categoryId: z.string().trim().min(1, "Danh mục không được để trống"),
  blocks: z
    .array(createUserNewsPostBlockSchema)
    .min(1, "Cần ít nhất 1 block nội dung"),
  tags: z.array(z.string()),
});
