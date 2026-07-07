import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userName: string | null;
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  login: (name: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,
      isLoggedIn: false,
      hasCompletedOnboarding: false,
      login: (name) => set({ userName: name, isLoggedIn: true }),
      logout: () => set({ userName: null, isLoggedIn: false, hasCompletedOnboarding: false }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: "user-storage",
    }
  )
);
