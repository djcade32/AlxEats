import { Criteria } from "@/interfaces";

interface UserInterface {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  favoriteCuisine: string;
  criteria: Criteria[];
  createdAt: string;
  photoUrl?: string;
}

export class User implements UserInterface {
  constructor(
    public id: string,
    public email: string,
    public firstName: string | null = null,
    public lastName: string | null = null,
    public favoriteCuisine: string,
    public criteria: Criteria[],
    public createdAt: string,
    public photoUrl?: string
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.favoriteCuisine = favoriteCuisine;
    this.criteria = criteria;
    this.createdAt = createdAt;
    this.photoUrl = photoUrl;
  }
}
