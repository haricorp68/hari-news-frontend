import { create } from "zustand";
import type { User } from "@/lib/modules/user/user.interface";

interface AuthState {
  token: string | null;
  profile: User | null;
  setToken: (token: string | null) => void;
  setProfile: (profile: User | null) => void;
  logout: () => void;
  setShowLoginDialog: (show: boolean) => void;
  showLoginDialog: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  profile: null,
  showLoginDialog: false,
  setShowLoginDialog: (show) => set({ showLoginDialog: show }),
  setToken: (token) => set({ token }),
  setProfile: (profile) => set({ profile }),
  logout: () => set({ token: null, profile: null }),
}));
