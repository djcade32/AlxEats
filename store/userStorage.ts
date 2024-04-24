import { create } from "zustand";
import { zustandStorage } from "@/store/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "@/classes/User";

export interface UserState {
  user: User | null;
  updateUser: (user: User) => void;
  isVerified: boolean;
  updateIsVerified: (verified: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      updateUser: (user: User) => {
        set({ user });
      },
      isVerified: false,
      updateIsVerified: (isVerified: boolean) => {
        set({ isVerified });
      },
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
