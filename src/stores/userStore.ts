import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userName: string | null;
  isLoggedIn: boolean;
  login: (name: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,
      isLoggedIn: false,
      login: (name) => set({ userName: name, isLoggedIn: true }),
      logout: () => set({ userName: null, isLoggedIn: false }),
    }),
    {
      name: "user-storage",
    }
  )
);
