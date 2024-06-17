export type RestaurantPriceLevel =
  | "PRICE_LEVEL_UNSPECIFIED"
  | "PRICE_LEVEL_FREE"
  | "PRICE_LEVEL_INEXPENSIVE"
  | "PRICE_LEVEL_MODERATE"
  | "PRICE_LEVEL_EXPENSIVE"
  | "PRICE_LEVEL_VERY_EXPENSIVE";

export type UserRestaurantsList = "TO_TRY" | "TRIED";

export type RestaurantCriteriaTypes =
  | "Taste"
  | "Service"
  | "Atmosphere"
  | "Price"
  | "Overall Experience";

export type RestaurantFilterSortByTypes = "Distance" | "Score" | "Price";

export type RestaurantFilterSortOrder = "ASC" | "DESC";

export type PostActivityTypes = "TRIED_POST" | "TO_TRY_POST";
