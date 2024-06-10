import { create } from "zustand";
import { zustandStorage } from "@/store/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { RestaurantListFilterPayload } from "@/interfaces";

export interface FilterState {
  cuisineFilter: string[];
  updateCuisineFilter: (cuisineFilter: string[]) => void;
  restaurantListFilter: RestaurantListFilterPayload;
  updateRestaurantListFilter: (restaurantListFilter: RestaurantListFilterPayload) => void;
  resetRestaurantListFilter: () => void;
  areFiltersEqual: (list: any) => boolean;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      cuisineFilter: [],
      updateCuisineFilter: (cuisineFilter: string[]) => {
        set({
          cuisineFilter,
        });
      },
      restaurantListFilter: {
        priceMax: "",
        scoreRange: { min: 0, max: 100 },
        sortOrder: "ASC",
        sortBy: "Distance",
        cuisinesFilter: [],
      },
      updateRestaurantListFilter: (restaurantListFilter: RestaurantListFilterPayload) => {
        set({ restaurantListFilter });
      },
      resetRestaurantListFilter: () => {
        set({
          restaurantListFilter: {
            priceMax: "",
            scoreRange: { min: 0, max: 100 },
            sortOrder: "ASC",
            sortBy: "Distance",
            cuisinesFilter: [],
          },
        });
      },
      areFiltersEqual(list) {
        return JSON.stringify(list) === JSON.stringify(get().restaurantListFilter);
      },
    }),

    {
      name: "filter-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
