export interface CreatingUserPayload {
  birthday: string;
  email: string;
  password: string;
  name: string;
  favoriteCuisine: string;
  criteria?: Criteria[];
}

export interface Criteria {
  index: number;
  critera: string;
}

export interface Error {
  field: string;
  message: string;
}
