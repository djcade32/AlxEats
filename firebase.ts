import { FirebaseApp, initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification as sendEmailVerificationFirebase,
  //@ts-ignore
  getReactNativePersistence,
  initializeAuth,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail as sendPasswordResetEmailFirebase,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "./interfaces";

export let app: FirebaseApp | null = null;
export let auth: Auth | null = null;

export function initializeFirebase() {
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "alxeats-cb5e6.firebaseapp.com",
    projectId: "alxeats-cb5e6",
    storageBucket: "alxeats-cb5e6.appspot.com",
    messagingSenderId: "397672290034",
    appId: "1:397672290034:web:0d1be2c4503edb2a32226b",
    measurementId: "G-DEE5TSG4K3",
  };
  if (firebase.apps.length === 0) {
    console.log("Initializing Firebase");
    app = initializeApp(firebaseConfig);

    // auth = initializeAuth(app);
  } else {
    console.log("Firebase already initialized");
    // firebase.app(); // if already initialized, use that one
  }
  return app;
}

export const getDb = () => {
  if (!app) {
    return null;
  }
  return getFirestore(app);
};

export const signUpUser = async (auth: Auth, email: string, password: string) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      // ...
      console.log("User signed up: ", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};

export const createAccount = async (
  email: string,
  password: string
  // fullName: string
): Promise<void> => {
  console.log("Creating new account");
  if (!getAuth()) {
    console.log("ERROR: There was a problem getting Firebase auth.");
    return Promise.reject();
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
    // updateProfile(userCredential.user!, { displayName: fullName });
    console.log("User created: ", userCredential.user);
    await sendEmailVerificationFirebase(userCredential.user);
    return Promise.resolve();
  } catch (error) {
    console.log("ERROR: There was a problem creating new account: ", error);
    return Promise.reject(error);
  }
};

export const signIn = async (email: string, password: string): Promise<void> => {
  if (!getAuth()) {
    console.log("ERROR: There was a problem getting Firebase auth.");
    return Promise.reject();
  }
  try {
    await signInWithEmailAndPassword(getAuth(), email, password);
    return Promise.resolve();
  } catch (error) {
    console.log("ERROR: There was a problem signing in: ", error);
    return Promise.reject(error);
  }
};

export const sendEmailVerification = async (): Promise<void> => {
  if (!getAuth() || !getAuth().currentUser) {
    console.log("ERROR: There was a problem getting the current user.");
    return Promise.resolve();
  }
  sendEmailVerificationFirebase(getAuth().currentUser!)
    .then(() => {
      console.log("Email verification sent!");
      return Promise.resolve();
    })
    .catch((error) => {
      console.log("ERROR: There was a problem sending email verification: ", error);
      return Promise.resolve();
    });
};

export const addUserToFirebase = async (user: User): Promise<void> => {
  try {
    // Add user to firebase database
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    await setDoc(doc(db, "users", user.id), {
      ...user,
    });
    console.log("User added to firebase database: ", user);
    return Promise.resolve();
  } catch (err: any) {
    return Promise.reject(err);
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  if (!getAuth()) {
    console.log("ERROR: There was a problem getting Firebase auth.");
    return Promise.reject();
  }
  sendPasswordResetEmailFirebase(getAuth(), email)
    .then(() => {
      Promise.resolve();
    })
    .catch((error) => {
      Promise.reject(error);
    });
};
