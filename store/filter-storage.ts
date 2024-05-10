import { create } from "zustand";
import { zustandStorage } from "@/store/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "@/classes/User";

export interface FilterState {
  cuisineFilter: string[];
  updateCuisineFilter: (cuisineFilter: string[]) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      cuisineFilter: [],
      updateCuisineFilter: (cuisineFilter: string[]) => {
        set({ cuisineFilter });
      },
    }),

    {
      name: "filter-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
