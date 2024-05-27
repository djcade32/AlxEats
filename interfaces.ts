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
  firstName: string | null;
  lastName: string | null;
  favoriteCuisine: string;
  criteria: Criteria[] | string;
  createdAt: string;
  profilePic?: string;
}

export interface Criteria {
  index: number;
  criteria: string;
}

export interface Error {
  field: string;
  message: string;
}

export interface RestaurantItem {
  address: string;
  coordinate: Coordinate;
  openNow: boolean;
  price: number;
  name: string;
  types: string[];
  primaryType: string;
  phoneNumber: string;
  website: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}
