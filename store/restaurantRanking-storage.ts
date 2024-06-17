import { create } from "zustand";
import { zustandStorage } from "@/store/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

export interface RestaurantRankingState {
  comment: string;
  updateComment: (comment: string) => void;
  photos: string[];
  addPhoto: (photo: string | string[]) => void;
  updatePhotos: (photos: string[]) => void;
  emptyPhotos: () => void;
}

export const useRestaurantRankingStore = create<RestaurantRankingState>()(
  persist(
    (set, get) => ({
      comment: "",
      updateComment: (comment: string) => {
        set({ comment });
      },
      photos: [],
      addPhoto: (photo: string | string[]) => {
        if (Array.isArray(photo)) {
          set((state) => ({ photos: [...state.photos, ...photo] }));
          return;
        }
        set((state) => ({ photos: [...state.photos, photo] }));
      },
      updatePhotos: (photos: string[]) => {
        set({ photos });
      },
      emptyPhotos: () => {
        set({ photos: [] });
      },
    }),

    {
      name: "restaurantRanking-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
