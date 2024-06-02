import { create } from "zustand";
import { zustandStorage } from "@/store/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { SignInMethods } from "@/enums";
import { User } from "firebase/auth";
import { RestaurantRankingPayload, User as UserDb } from "@/interfaces";

export interface AppState {
  authUser: User | null;
  setAuthUser: (user: User | null) => void;
  userDbInfo: UserDb | null;
  setUserDbInfo: (info: UserDb) => void;
  signInMethod: SignInMethods;
  updateSignInMethod: (method: SignInMethods) => void;
  pendingEmailVerification: boolean;
  setPendingEmailVerification: (pending: boolean) => void;
  userTriedRestaurants: RestaurantRankingPayload[];
  setUserTriedRestaurants: (restaurants: RestaurantRankingPayload[]) => void;
  userToTryRestaurants: string[];
  setUserToTryRestaurants: (restaurants: string[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      signInMethod: SignInMethods.Email,
      updateSignInMethod: (method: SignInMethods) => {
        set({ signInMethod: method });
      },
      pendingEmailVerification: false,
      setPendingEmailVerification: (pending: boolean) => {
        set({ pendingEmailVerification: pending });
      },
      authUser: null,
      setAuthUser: (user: User | null) => {
        set({ authUser: user });
      },
      userDbInfo: null,
      setUserDbInfo: (info: UserDb) => {
        set({ userDbInfo: info });
      },
      userTriedRestaurants: [],
      setUserTriedRestaurants: (restaurants: RestaurantRankingPayload[]) => {
        set({ userTriedRestaurants: restaurants });
      },
      userToTryRestaurants: [],
      setUserToTryRestaurants: (restaurants: string[]) => {
        set({ userToTryRestaurants: restaurants });
      },
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
