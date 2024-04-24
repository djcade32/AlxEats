import profile from "@/app/(authenticated)/(tabs)/profile";
import { Criteria } from "@/interfaces";

interface UserInterface {
  id: string;
  email: string;
  name: string | null;
  birthday: string;
  favoriteCuisine: string;
  criteria: Criteria[];
  createdAt: string;
  profilePicture: string | null;
}

export class User implements UserInterface {
  constructor(
    public id: string,
    public email: string,
    public name: string | null = null,
    public birthday: string,
    public favoriteCuisine: string,
    public criteria: Criteria[],
    public createdAt: string,
    public profilePicture: string | null = null
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.birthday = birthday;
    this.favoriteCuisine = favoriteCuisine;
    this.criteria = criteria;
    this.createdAt = createdAt;
    this.profilePicture = profilePicture;
  }
}
