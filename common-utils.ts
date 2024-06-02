import { collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "./firebase";
import { Coordinate, Error } from "./interfaces";
import { app, addUserToFirebase } from "@/firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

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

export const capitalizeFirstLetter = (string: string) => {
  if (typeof string !== "string" || !string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function distanceBetweenCoordinates(coord1: Coordinate, coord2: Coordinate) {
  const R = 3958.8; // Radius of the Earth in miles
  const lat1 = coord1.latitude * (Math.PI / 180); // Convert degrees to radians
  const lon1 = coord1.longitude * (Math.PI / 180); // Convert degrees to radians
  const lat2 = coord2.latitude * (Math.PI / 180); // Convert degrees to radians
  const lon2 = coord2.longitude * (Math.PI / 180); // Convert degrees to radians

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
}

export async function uploadImageAsync(uri: string, storageUrl: string) {
  try {
    if (!uri || app == null) return;
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(getStorage(), storageUrl);
    const result = await uploadBytes(fileRef, blob as Blob);

    // We're done with the blob, close and release it
    //@ts-ignore
    blob.close();
    return await getDownloadURL(fileRef).then((url) => {
      if (url) {
        console.log("Image uploaded: ", url);
        return url;
      }
    });
  } catch (error) {
    console.log("ERROR: There was a problem uploading the image: ", error);
  }
}

export const uploadImages = async (images: string[], storageUrl: string) => {
  try {
    if (images.length === 0) return [];
    let downloadUrls: string[] = [];
    const uploadPromises = images.map(async (imageUri, index) => {
      const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const downloadURL = await uploadImageAsync(imageUri, `${storageUrl}/${filename}`);
      if (downloadURL) {
        downloadUrls.push(downloadURL);
      }
      console.log(`Image ${index + 1} uploaded successfully: ${downloadURL}`);
    });

    await Promise.all(uploadPromises);
    console.log("All images uploaded!");
    return downloadUrls;
  } catch (error) {
    console.log("ERROR: There was a problem uploading the images: ", error);
    return [];
  }
};

export function wait(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}
