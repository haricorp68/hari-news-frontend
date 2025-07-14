import { create } from "zustand";
import type { Comment } from "./comment.interface";

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  setComments: (comments: Comment[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearComments: () => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  loading: false,
  error: null,
  setComments: (comments) => set({ comments }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearComments: () => set({ comments: [] }),
})); 