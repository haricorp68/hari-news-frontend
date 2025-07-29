import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/lib/modules/user/user.interface";

interface AuthState {
  token: string | null;
  profile: User | null;
  isHydrated: boolean; // Thêm trạng thái này để kiểm tra xem store đã được hydrate chưa
  showLoginDialog: boolean;
  setToken: (token: string | null) => void;
  setProfile: (profile: User | null) => void;
  logout: () => void;
  setShowLoginDialog: (show: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      profile: null,
      isHydrated: false, // Mặc định là false khi khởi tạo
      showLoginDialog: false,
      setShowLoginDialog: (show) => set({ showLoginDialog: show }),
      setToken: (token) => set({ token }),
      setProfile: (profile) => set({ profile }),
      logout: () => set({ token: null, profile: null }),
    }),
    {
      name: "auth-storage", // Tên key sẽ được sử dụng trong localStorage
      storage: createJSONStorage(() => localStorage), // Sử dụng localStorage
      // Hàm này sẽ được gọi sau khi store được hydrate từ storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true; // Đánh dấu là đã hydrate
        }
      },
    }
  )
);
