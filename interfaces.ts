import { DocumentData } from "firebase/firestore";
import { RestaurantCriteriaTypes, RestaurantPriceLevel } from "./types";

export interface CreatingUserPayload {
  email: string;
  password: string;
  name: string;
  favoriteCuisine: string;
  criteria?: Criteria[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  favoriteCuisine: string;
  criteria: Criteria[];
  createdAt: string;
  profilePic?: string;
}

export interface Criteria {
  index: number;
  criteria: RestaurantCriteriaTypes;
}

export interface Error {
  field: string;
  message: string;
}

export interface RestaurantItem {
  placeId: string;
  address: string;
  coordinate: Coordinate;
  openNow: boolean;
  price: RestaurantPriceLevel;
  name: string;
  types: string[];
  primaryType: string;
  phoneNumber: string;
  website: string;
  distance: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface FetchUsersPayload {
  lastDoc?: DocumentData | null;
  data: User[];
}

export interface RestaurantRankingPayload {
  id: string;
  ranking: number;
  photos: string[];
  comment: string;
  criteriaReference: Record<RestaurantCriteriaTypes, number>;
}
