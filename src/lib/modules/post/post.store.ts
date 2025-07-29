// lib/modules/createNews/createNews.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserNewsPostBlockType } from "@/lib/modules/post/post.interface";
import { NewsTag } from "@/lib/modules/newsTag/newsTag.interface";
import { UploadResult } from "@/components/CloudinaryUpload";

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

interface CreateNewsState {
  // Form data
  title: string;
  summary: string;
  coverImage: UploadResult | null;
  categoryId: string;
  blocks: NewsBlock[];
  tags: NewsTag[];

  // Actions
  setTitle: (title: string) => void;
  setSummary: (summary: string) => void;
  setCoverImage: (coverImage: UploadResult | null) => void;
  setCategoryId: (categoryId: string) => void;
  setBlocks: (blocks: NewsBlock[]) => void;
  setTags: (tags: NewsTag[]) => void;

  // Block actions
  addBlock: (type: UserNewsPostBlockType) => void;
  updateBlock: (id: string, updates: Partial<NewsBlock>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (blocks: NewsBlock[]) => void;

  // Tag actions
  addTag: (tag: NewsTag) => void;
  removeTag: (tagId: string) => void;

  // Utility actions
  clearAll: () => void;
  loadFromTemplate: (
    templateBlocks: {
      type: UserNewsPostBlockType;
      content: string;
      order: number;
    }[]
  ) => void;
  loadFromJSON: (data: any) => void;

  // Auto-save controls
  enableAutoSave: boolean;
  setEnableAutoSave: (enable: boolean) => void;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial state
const initialState = {
  title: "",
  summary: "",
  coverImage: null,
  categoryId: "",
  blocks: [],
  tags: [],
  enableAutoSave: true,
};

export const useCreateNewsStore = create<CreateNewsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Basic setters
      setTitle: (title: string) => set({ title }),
      setSummary: (summary: string) => set({ summary }),
      setCoverImage: (coverImage: UploadResult | null) => set({ coverImage }),
      setCategoryId: (categoryId: string) => set({ categoryId }),
      setBlocks: (blocks: NewsBlock[]) => set({ blocks }),
      setTags: (tags: NewsTag[]) => set({ tags }),

      // Block actions
      addBlock: (type: UserNewsPostBlockType) => {
        const { blocks } = get();
        const newBlock: NewsBlock = {
          id: generateId(),
          type,
          content: "",
          order: blocks.length,
        };
        set({ blocks: [...blocks, newBlock] });
      },

      updateBlock: (id: string, updates: Partial<NewsBlock>) => {
        const { blocks } = get();
        const updatedBlocks = blocks.map((block) =>
          block.id === id ? { ...block, ...updates } : block
        );
        set({ blocks: updatedBlocks });
      },

      removeBlock: (id: string) => {
        const { blocks } = get();
        const filteredBlocks = blocks
          .filter((block) => block.id !== id)
          .map((block, index) => ({ ...block, order: index }));
        set({ blocks: filteredBlocks });
      },

      reorderBlocks: (blocks: NewsBlock[]) => {
        const reorderedBlocks = blocks.map((block, index) => ({
          ...block,
          order: index,
        }));
        set({ blocks: reorderedBlocks });
      },

      // Tag actions
      addTag: (tag: NewsTag) => {
        const { tags } = get();
        if (!tags.some((t) => t.id === tag.id)) {
          set({ tags: [...tags, tag] });
        }
      },

      removeTag: (tagId: string) => {
        const { tags } = get();
        set({ tags: tags.filter((tag) => tag.id !== tagId) });
      },

      // Utility actions
      clearAll: () => set(initialState),

      loadFromTemplate: (templateBlocks) => {
        const blocks: NewsBlock[] = templateBlocks.map((block, index) => ({
          id: generateId(),
          type: block.type,
          content: "",
          placeholderContent: block.content,
          order: index,
        }));
        set({ blocks });
      },

      loadFromJSON: (data) => {
        try {
          const importedBlocks: NewsBlock[] = data.blocks.map(
            (block: any, index: number) => ({
              id: generateId(),
              type: block.type,
              content: block.content || "",
              order: block.order !== undefined ? block.order : index,
              media_url: undefined, // Reset media URLs for re-upload
              file_name: undefined,
              file_size: undefined,
            })
          );

          importedBlocks.sort((a, b) => a.order - b.order);

          set({
            title: data.title || "",
            summary: data.summary || "",
            categoryId: data.categoryId || "",
            blocks: importedBlocks,
            coverImage: null, // Reset cover image for re-upload
            tags: [], // Reset tags for re-selection
          });
        } catch (error) {
          console.error("Error loading from JSON:", error);
          throw error;
        }
      },

      // Auto-save controls
      setEnableAutoSave: (enable: boolean) => set({ enableAutoSave: enable }),
    }),
    {
      name: "create-news-draft", // Local storage key
      partialize: (state) => ({
        title: state.title,
        summary: state.summary,
        coverImage: state.coverImage,
        categoryId: state.categoryId,
        blocks: state.blocks,
        tags: state.tags,
        enableAutoSave: state.enableAutoSave,
      }),
      // Only persist if auto-save is enabled
      skipHydration: false,
    }
  )
);

// Selector hooks for better performance
export const useCreateNewsTitle = () =>
  useCreateNewsStore((state) => state.title);
export const useCreateNewsSummary = () =>
  useCreateNewsStore((state) => state.summary);
export const useCreateNewsCoverImage = () =>
  useCreateNewsStore((state) => state.coverImage);
export const useCreateNewsCategoryId = () =>
  useCreateNewsStore((state) => state.categoryId);
export const useCreateNewsBlocks = () =>
  useCreateNewsStore((state) => state.blocks);
export const useCreateNewsTags = () =>
  useCreateNewsStore((state) => state.tags);

// Individual action hooks để tránh re-render không cần thiết
export const useSetTitle = () => useCreateNewsStore((state) => state.setTitle);
export const useSetSummary = () =>
  useCreateNewsStore((state) => state.setSummary);
export const useSetCoverImage = () =>
  useCreateNewsStore((state) => state.setCoverImage);
export const useSetCategoryId = () =>
  useCreateNewsStore((state) => state.setCategoryId);
export const useSetBlocks = () =>
  useCreateNewsStore((state) => state.setBlocks);
export const useSetTags = () => useCreateNewsStore((state) => state.setTags);
export const useAddBlock = () => useCreateNewsStore((state) => state.addBlock);
export const useUpdateBlock = () =>
  useCreateNewsStore((state) => state.updateBlock);
export const useRemoveBlock = () =>
  useCreateNewsStore((state) => state.removeBlock);
export const useReorderBlocks = () =>
  useCreateNewsStore((state) => state.reorderBlocks);
export const useAddTag = () => useCreateNewsStore((state) => state.addTag);
export const useRemoveTag = () =>
  useCreateNewsStore((state) => state.removeTag);
export const useClearAll = () => useCreateNewsStore((state) => state.clearAll);
export const useLoadFromTemplate = () =>
  useCreateNewsStore((state) => state.loadFromTemplate);
export const useLoadFromJSON = () =>
  useCreateNewsStore((state) => state.loadFromJSON);
