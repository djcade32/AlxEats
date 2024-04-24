import { create } from "zustand";
import { zustandStorage } from "@/store/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "@/classes/User";
import { SignInMethods } from "@/enums";

export interface AppState {
  signInMethod: SignInMethods;
  updateSignInMethod: (method: SignInMethods) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      signInMethod: SignInMethods.Email,
      updateSignInMethod: (method: SignInMethods) => {
        set({ signInMethod: method });
      },
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
