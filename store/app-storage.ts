import { create } from "zustand";
import { zustandStorage } from "@/store/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { SignInMethods } from "@/enums";
import { User } from "firebase/auth";
import { FeedPost, RestaurantRankingPayload, User as UserDb } from "@/interfaces";
import { DocumentData } from "firebase/firestore";

export interface AppState {
  appLoading: boolean;
  setAppLoading: (loading: boolean) => void;
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
  checkIfUserTriedRestaurant: (placeId: string) => boolean;
  userToTryRestaurants: string[];
  setUserToTryRestaurants: (restaurants: string[]) => void;
  checkIfUserToTryRestaurant: (placeId: string) => boolean;
  userFollowing: string[];
  setUserFollowing: (following: string[]) => void;
  userFollowers: string[];
  setUserFollowers: (followers: string[]) => void;
  userPosts: FeedPost[];
  setUserPosts: (posts: FeedPost[]) => void;
  clearStore: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      appLoading: true,
      setAppLoading: (loading: boolean) => {
        set({ appLoading: loading });
      },
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
      checkIfUserTriedRestaurant: (placeId: string) => {
        return get().userTriedRestaurants.find((r) => r.id === placeId) ? true : false;
      },
      userToTryRestaurants: [],
      setUserToTryRestaurants: (restaurants: string[]) => {
        set({ userToTryRestaurants: restaurants });
      },
      checkIfUserToTryRestaurant: (placeId: string) => {
        return get().userToTryRestaurants.includes(placeId);
      },
      userFollowing: [],
      setUserFollowing: (following: string[]) => {
        set({ userFollowing: following });
      },
      userFollowers: [],
      setUserFollowers: (followers: string[]) => {
        set({ userFollowers: followers });
      },
      userPosts: [],
      setUserPosts: (posts: FeedPost[]) => {
        set({ userPosts: posts });
      },
      clearStore: () => {
        set({
          authUser: null,
          userDbInfo: null,
          userTriedRestaurants: [],
          userToTryRestaurants: [],
          userFollowing: [],
          userFollowers: [],
        });
      },
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
