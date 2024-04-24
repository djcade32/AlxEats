import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";

let app: any = null;

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
  if (!firebase.apps.length) {
    // firebase.initializeApp({});
    // console.log("Firebase initialized");
    app = initializeApp(firebaseConfig);
  } else {
    console.log("Firebase with app: ", firebase.apps);

    // firebase.app(); // if already initialized, use that one
  }
}

export const getDb = () => {
  if (!app) {
    return null;
  }
  return getFirestore(app);
};
