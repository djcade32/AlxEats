import { collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "./firebase";
import { Error } from "./interfaces";

export function createError(field: string, message: string) {
  const error: Error = {
    field,
    message,
  };
  return error;
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function hasError(errors: Error[], field: string) {
  return !!errors?.find((error: Error) => error.field === field);
}

export async function checkIfUserExistsInDB(id: string | undefined) {
  const db = getDb();
  let userExists = false;
  if (!db || !id) return userExists;
  const q = query(collection(db, "users"), where("id", "==", id));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.length > 0;
}

function isArrayOfStrings(arr: any) {
  return Array.isArray(arr) && arr.every((item) => typeof item === "string");
}

function isCoordinate(obj: any) {
  return obj && typeof obj.latitude === "number" && typeof obj.longitude === "number";
}

export function isRestaurantItem(obj: any) {
  return (
    obj &&
    typeof obj.address === "string" &&
    isCoordinate(obj.coordinate) &&
    typeof obj.openNow === "boolean" &&
    typeof obj.price === "number" &&
    typeof obj.name === "string" &&
    isArrayOfStrings(obj.types)
  );
}
