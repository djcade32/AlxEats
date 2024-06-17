import { RestaurantPriceLevel } from "./types";

export const restaurantPriceLevels: Record<RestaurantPriceLevel, string> = {
  PRICE_LEVEL_UNSPECIFIED: "",
  PRICE_LEVEL_FREE: "$",
  PRICE_LEVEL_INEXPENSIVE: "$",
  PRICE_LEVEL_MODERATE: "$$",
  PRICE_LEVEL_EXPENSIVE: "$$$",
  PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
};
