import { FirebaseApp, initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
  limit,
  startAfter,
  DocumentData,
  arrayUnion,
  FieldValue,
  arrayRemove,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
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
  UserCredential,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FeedPost,
  FetchUsersPayload,
  RestaurantItem,
  RestaurantRankingPayload,
  User,
} from "./interfaces";
import { PostActivityTypes, UserRestaurantsList } from "./types";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { v4 } from "uuid";

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

export const createAccount = async (email: string, password: string): Promise<void> => {
  console.log("Creating new account");
  if (!getAuth()) {
    console.log("ERROR: There was a problem getting Firebase auth.");
    return Promise.reject();
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
    await sendEmailVerificationFirebase(userCredential.user);
    return Promise.resolve();
  } catch (error) {
    console.log("ERROR: There was a problem creating new account: ", error);
    return Promise.reject(error);
  }
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  if (!getAuth()) {
    console.log("ERROR: There was a problem getting Firebase auth.");
    return Promise.reject();
  }
  try {
    const user = await signInWithEmailAndPassword(getAuth(), email, password);
    return Promise.resolve(user);
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
  sendEmailVerificationFirebase(user || getAuth().currentUser!)
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
    await setDoc(doc(db, "followings", user.id), {
      following: [],
      followedBy: [],
    });
    await setDoc(doc(db, `userRestaurants/${user.id}/toTry`, "data"), {
      data: [],
    });
    await setDoc(doc(db, `userRestaurants/${user.id}/tried`, "data"), {
      data: [],
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

/* `checkIfEmailExists` is a function that checks if the email of the currently
authenticated user exists in the Firebase database. Here's a breakdown of what the
function does: */
export const checkIfEmailExists = async (email: string): Promise<any> => {
  let emailExists = null;
  const db = getDb();
  if (!db || !email) return emailExists;
  const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return emailExists;
  }
  emailExists = querySnapshot.docs[0].data() as User | null;
  return emailExists;
};

export const fetchUsers = async (
  lastDoc: DocumentData | null = null,
  limitCount?: number
): Promise<FetchUsersPayload> => {
  const db = getDb();
  if (!db) {
    return Promise.reject("Error: Database not found");
  }
  if (!limitCount) limitCount = 25;
  const q = !lastDoc
    ? query(collection(db, "users"), limit(limitCount))
    : query(collection(db, "users"), startAfter(lastDoc), limit(limitCount));
  const querySnapshot = await getDocs(q);
  const users: User[] = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data() as User);
  });
  //TODO: Create a pagination object to return with the users
  const fetchUsersPayload: FetchUsersPayload = {
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
    data: users,
  };
  return fetchUsersPayload;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const db = getDb();
  if (!db) {
    return Promise.reject("Error: Database not found");
  }
  if (!id) return null;
  const q = query(collection(db, "users"), where("id", "==", id));
  const querySnapshot = await getDocs(q);
  let user: User | null = null;
  querySnapshot.forEach((doc) => {
    user = doc.data() as User;
  });
  return user;
};

export const restaurantAdded = async (
  userId: string,
  firstName: string,
  restaurantName: string,
  restaurantLocation: string,
  restaurantId: string,
  list: UserRestaurantsList,
  RestaurantRankingPayload?: RestaurantRankingPayload
): Promise<void> => {
  const db = getDb();
  if (!db) {
    return Promise.reject("Error: Database not found");
  }
  if (!userId || !restaurantId || !list)
    return Promise.reject("Error: Missing user or restaurant id or list");
  if (list === "TRIED" && !RestaurantRankingPayload)
    return Promise.reject("Error: Missing RestaurantRankingPayload for tried restaurant");
  const dbUrl = `userRestaurants/${userId}/${list === "TO_TRY" ? "toTry" : "tried"}/data`;
  const userRef = doc(db, dbUrl);
  const docSnap = await getDoc(userRef);

  let length = 0;
  if (docSnap.exists()) {
    const data = docSnap.data();
    length = data.data.length;
  }
  await setDoc(
    userRef,
    {
      data: list === "TRIED" ? arrayUnion(RestaurantRankingPayload) : arrayUnion(restaurantId),
      length: length + 1,
    },
    { merge: true }
  );
  console.log(`Restaurant ${restaurantId} added to ${list} list for user ${userId}`);
  await createPost(
    userId,
    restaurantId,
    list === "TO_TRY" ? "TO_TRY_POST" : "TRIED_POST",
    firstName,
    restaurantName,
    restaurantLocation,
    RestaurantRankingPayload
  );
  return Promise.resolve();
};

export const updateRestaurantComment = async (
  userId: string,
  restaurantId: string,
  updatedComment: string
): Promise<void> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !updatedComment || !restaurantId)
      return Promise.reject("Error: Missing user id or restaurantId or updatedComment");
    const dbUrl = `userRestaurants/${userId}/tried/data`;
    const userRef = doc(db, dbUrl);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const triedRestaurants = data.data;
      const updatedTriedRestaurants = triedRestaurants.map(
        (restaurant: RestaurantRankingPayload) => {
          if (restaurantId === restaurant.id) {
            console.log(`Restaurant ${restaurant.id} updated for user ${userId}`);
            return { ...restaurant, comment: updatedComment };
          }
          return restaurant;
        }
      );
      await setDoc(userRef, {
        data: updatedTriedRestaurants,
      });
      return Promise.resolve();
    } else {
      console.log("Document does not exist");
      return Promise.reject("Error: Document does not exist");
    }
  } catch (error) {
    console.log("Error updating restaurant: ", error);
    return Promise.reject(error);
  }
};

// update restaurant photos
export const updateRestaurantPhotos = async (
  userId: string,
  restaurantId: string,
  updatedPhotos: string[]
): Promise<void> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !updatedPhotos || !restaurantId)
      return Promise.reject("Error: Missing user id or restaurantId or updatedPhotos");
    const dbUrl = `userRestaurants/${userId}/tried/data`;
    const userRef = doc(db, dbUrl);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const triedRestaurants = data.data;
      const updatedTriedRestaurants = triedRestaurants.map(
        (restaurant: RestaurantRankingPayload) => {
          if (restaurantId === restaurant.id) {
            console.log(`Restaurant ${restaurant.id} updated for user ${userId}`);
            return { ...restaurant, photos: updatedPhotos };
          }
          return restaurant;
        }
      );
      await setDoc(userRef, {
        data: updatedTriedRestaurants,
      });
      return Promise.resolve();
    } else {
      console.log("Document does not exist");
      return Promise.reject("Error: Document does not exist");
    }
  } catch (error) {
    console.log("Error updating restaurant: ", error);
    return Promise.reject(error);
  }
};

export const createPost = async (
  userId: string,
  restaurantId: string,
  activityType: PostActivityTypes,
  firstName: string,
  restaurantName: string,
  restaurantLocation: string,
  restaurantRankingPayload?: RestaurantRankingPayload
): Promise<void> => {
  const db = getDb();
  if (!db) {
    return Promise.reject("Error: Database not found");
  }
  if (!userId || !restaurantId || !activityType || !firstName || !restaurantName)
    return Promise.reject(
      "Error: Missing user or restaurant id or activity type or firstName or restaurantName"
    );
  if (activityType === "TRIED_POST" && !restaurantRankingPayload)
    return Promise.reject("Error: Missing RestaurantRankingPayload for tried post");

  const activityId = v4();
  const dbUrl = `feed/${activityId}`;
  const userRef = doc(db, dbUrl);

  const post: FeedPost = restaurantRankingPayload
    ? {
        restaurantId,
        comment: restaurantRankingPayload.comment,
        photos: restaurantRankingPayload.photos,
        ranking: restaurantRankingPayload.ranking,
        activityType,
        userId,
        restaurantName,
        restaurantLocation,
        activityId,
        createdAt: new Date().toISOString(),
        likes: [],
        shares: [],
      }
    : {
        restaurantId,
        activityType,
        userId,
        activityId,
        restaurantName,
        restaurantLocation,
        createdAt: new Date().toISOString(),
        likes: [],
        shares: [],
      };
  await setDoc(userRef, post, { merge: true });
  console.log(`Post created for user ${userId}`);
  return Promise.resolve();
};

export const restaurantRemoved = async (
  userId: string,
  restaurantId: string,
  list: UserRestaurantsList,
  restaurantItem?: RestaurantItem,
  ranking?: number
): Promise<void> => {
  const db = getDb();
  try {
    console.log("Removing restaurant from list: ", list);
    console.log("Restaurant obj", { ...restaurantItem, ranking });
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !restaurantId || !list)
      return Promise.reject("Error: Missing user or restaurant id or list");
    if (list === "TRIED" && !ranking)
      return Promise.reject("Error: Missing ranking for tried restaurant");
    const dbUrl = `userRestaurants/${userId}/${list === "TO_TRY" ? "toTry" : "tried"}/data`;
    const userRef = doc(db, dbUrl);
    const docSnap = await getDoc(userRef);
    let length = 0;
    if (docSnap.exists()) {
      const data = docSnap.data();
      length = data.data.length;
    }

    await setDoc(
      userRef,
      {
        data:
          list === "TRIED"
            ? arrayRemove({ ...restaurantItem, ranking })
            : arrayRemove(restaurantId),
        length: length - 1,
      },
      { merge: true }
    );
    console.log(`Restaurant ${restaurantId} removed from ${list} list for user ${userId}`);
    return Promise.resolve();
  } catch (error) {
    console.log("Error removing restaurant from list: ", error);
  }
};

// Remove restaurant from user's tried list
export const removeRestaurantFromTriedList = async (
  userId: string,
  restaurantId: string
): Promise<void> => {
  try {
    console.log("Removing restaurant from tried list");
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !restaurantId) return Promise.reject("Error: Missing user or restaurant id");
    const dbUrl = `userRestaurants/${userId}/tried/data`;
    const userRef = doc(db, dbUrl);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const triedRestaurants = data.data;
      const updatedTriedRestaurants = triedRestaurants.filter(
        (restaurant: RestaurantRankingPayload) => {
          console.log("restaurantId: ", restaurantId, "restaurant.id: ", restaurant.id);
          return restaurantId !== restaurant.id;
        }
      );
      await setDoc(userRef, {
        data: updatedTriedRestaurants,
      });
      console.log(`Restaurant ${restaurantId} removed from tried list for user ${userId}`);
      // remove restaurant from user's feed
      await removePost(userId, restaurantId);
      return Promise.resolve();
    } else {
      console.log("Document does not exist");
      return Promise.reject("Error: Document does not exist");
    }
  } catch (error) {
    console.log("Error removing restaurant from tried list: ", error);
    return Promise.reject(error);
  }
};

// check if restaurant is in user's list
export const checkIfRestaurantInList = async (
  userId: string,
  restaurantId: string,
  list: "TO_TRY" | "TRIED" // Update this type as necessary
): Promise<any> => {
  const db = getDb();
  try {
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !restaurantId || !list) {
      return Promise.reject("Error: Missing user or restaurant id or list");
    }

    const dbUrl = `userRestaurants/${userId}/${list === "TO_TRY" ? "toTry" : "tried"}/data`;
    const userRef = doc(db, dbUrl);

    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();

      return data.data.filter((item: any) => {
        if (list === "TO_TRY" && item === restaurantId) {
          return Promise.resolve(item);
        } else if (list === "TRIED" && item.id === restaurantId) {
          return item;
        }
      })[0];
    } else {
      console.log("Document does not exist");
      return; // Document does not exist
    }
  } catch (error: any) {
    return Promise.reject(`Error: ${error.message}`);
  }
};

export const getUserRestaurantsToTryList = async (userId: string): Promise<string[]> => {
  const db = getDb();
  if (!db) {
    return Promise.reject("Error: Database not found");
  }
  if (!userId) return Promise.reject("Error: Missing user id");
  const dbUrl = `userRestaurants/${userId}/toTry/data`;
  const userRef = doc(db, dbUrl);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.data;
  } else {
    console.log("Document does not exist");
    return []; // Document does not exist
  }
};

export const getUserRestaurantsTriedList = async (
  userId: string
): Promise<RestaurantRankingPayload[]> => {
  const db = getDb();
  if (!db) {
    return Promise.reject("Error: Database not found");
  }
  if (!userId) return Promise.reject("Error: Missing user id");
  const dbUrl = `userRestaurants/${userId}/tried/data`;
  const userRef = doc(db, dbUrl);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.data;
  } else {
    console.log("Document does not exist");
    return []; // Document does not exist
  }
};

export const getUserPosts = async (userId: string): Promise<FeedPost[]> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId) return Promise.reject("Error: Missing user id");

    const q = query(
      collection(db, "feed"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const posts: FeedPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push(doc.data() as FeedPost);
    });
    return posts;
  } catch (error) {
    return Promise.reject(error);
  }
};

//Remove post from user's feed
export const removePost = async (userId: string, restaurantId: string): Promise<void> => {
  const db = getDb();
  if (!db) {
    return Promise.reject("Error: Database not found");
  }
  if (!userId || !restaurantId) return Promise.reject("Error: Missing user or restaurant id");
  const q = query(
    collection(db, "feed"),
    where("userId", "==", userId),
    where("restaurantId", "==", restaurantId)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });

  console.log(`Post ${restaurantId} removed from user ${userId}'s feed`);
  return Promise.resolve();
};

// Follow user
export const followUser = async (userId: string, followingId: string): Promise<void> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !followingId) return Promise.reject("Error: Missing user or following id");
    const dbUrl = `followings/${userId}`;
    const userRef = doc(db, dbUrl);

    await setDoc(
      userRef,
      {
        following: arrayUnion(followingId),
      },
      { merge: true }
    );
    console.log(`User ${userId} followed user ${followingId}`);
    await addUserToFollowedByList(followingId, userId);
    return Promise.resolve();
  } catch (error) {
    console.log("Error following user: ", error);
    return Promise.reject(error);
  }
};

// Unfollow user
export const unfollowUser = async (userId: string, followingId: string): Promise<void> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !followingId) return Promise.reject("Error: Missing user or following id");
    const dbUrl = `followings/${userId}`;
    const userRef = doc(db, dbUrl);

    await setDoc(
      userRef,
      {
        following: arrayRemove(followingId),
      },
      { merge: true }
    );
    console.log(`User ${userId} unfollowed user ${followingId}`);
    removeUserFromFollowedByList(followingId, userId);
    return Promise.resolve();
  } catch (error) {
    console.log("Error unfollowing user: ", error);
    return Promise.reject(error);
  }
};

// Add user to followers list
export const addUserToFollowedByList = async (
  userId: string,
  followerId: string
): Promise<void> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !followerId) return Promise.reject("Error: Missing user or follower id");
    const dbUrl = `followings/${userId}`;
    const userRef = doc(db, dbUrl);

    await setDoc(
      userRef,
      {
        followedBy: arrayUnion(followerId),
      },
      { merge: true }
    );
    console.log(`User ${userId} added to user ${followerId}'s followedBy list`);
    return Promise.resolve();
  } catch (error) {
    console.log("Error adding user to followedBy list: ", error);
    return Promise.reject(error);
  }
};

// Remove user from followers list
export const removeUserFromFollowedByList = async (
  userId: string,
  followerId: string
): Promise<void> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !followerId) return Promise.reject("Error: Missing user or follower id");
    const dbUrl = `followings/${userId}`;
    const userRef = doc(db, dbUrl);

    await setDoc(
      userRef,
      {
        followedBy: arrayRemove(followerId),
      },
      { merge: true }
    );
    console.log(`User ${userId} removed from user ${followerId}'s followedBy list`);
    return Promise.resolve();
  } catch (error) {
    console.log("Error removing user from followedBy list: ", error);
    return Promise.reject(error);
  }
};

// Get given user's followers
export const getUserFollowers = async (userId: string): Promise<string[]> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId) return Promise.reject("Error: Missing user id");
    const dbUrl = `followings/${userId}`;
    const userRef = doc(db, dbUrl);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.followedBy;
    } else {
      console.log("Document does not exist");
      return []; // Document does not exist
    }
  } catch (error: any) {
    return Promise.reject(`Error: ${error.message}`);
  }
};

// Get given user's followings
export const getUserFollowings = async (userId: string): Promise<string[]> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId) return Promise.reject("Error: Missing user id");
    const dbUrl = `followings/${userId}`;
    const userRef = doc(db, dbUrl);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.following;
    } else {
      console.log("Document does not exist");
      return []; // Document does not exist
    }
  } catch (error: any) {
    return Promise.reject(`Error: ${error.message}`);
  }
};

//Add like to post
export const likePost = async (userId: string, postId: string): Promise<void> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !postId) return Promise.reject("Error: Missing user or post id");
    const dbUrl = `feed/${postId}`;
    const userRef = doc(db, dbUrl);

    await setDoc(
      userRef,
      {
        likes: arrayUnion(userId),
      },
      { merge: true }
    );
    console.log(`User ${userId} liked post ${postId}`);
    return Promise.resolve();
  } catch (error) {
    console.log("Error liking post: ", error);
    return Promise.reject(error);
  }
};

//Remove like from post
export const removeLikePost = async (userId: string, postId: string): Promise<void> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !postId) return Promise.reject("Error: Missing user or post id");
    const dbUrl = `feed/${postId}`;
    const userRef = doc(db, dbUrl);

    await setDoc(
      userRef,
      {
        likes: arrayRemove(userId),
      },
      { merge: true }
    );
    console.log(`User ${userId} removed like from post ${postId}`);
    return Promise.resolve();
  } catch (error) {
    console.log("Error removing like from post: ", error);
    return Promise.reject(error);
  }
};

//Check if user liked post
export const checkIfUserLikedPost = async (userId: string, postId: string): Promise<boolean> => {
  try {
    const db = getDb();
    if (!db) {
      return Promise.reject("Error: Database not found");
    }
    if (!userId || !postId) return Promise.reject("Error: Missing user or post id");
    const dbUrl = `feed/${postId}`;
    const userRef = doc(db, dbUrl);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.likes.includes(userId);
    } else {
      console.log("Document does not exist");
      return false; // Document does not exist
    }
  } catch (error: any) {
    return Promise.reject(`Error: ${error.message}`);
  }
};

export const getFeed = async (currentUserId: string) => {
  try {
    const db = getDb();
    if (!db) return Promise.reject("Error: Database not found");

    const following = await getUserFollowings(currentUserId);
    following.push(currentUserId);

    if (following.length > 0) {
      const activitiesRef = collection(db, "feed");
      const q = query(
        activitiesRef,
        where("userId", "in", following),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const feed = querySnapshot.docs.map((doc) => doc.data() as FeedPost);

      // Optionally, cache the feed data
      // const feedRef = doc(db, "feed", currentUserId);
      // await setDoc(feedRef, { feed }, { merge: true });

      return feed;
    }
    return [];
  } catch (error) {
    console.log("Error getting feed: ", error);
    return Promise.reject(error);
  }
};

//Change user's profile picture
export const changeProfilePicture = async (userId: string, profilePic: string | null) => {
  try {
    const db = getDb();
    if (!db) return Promise.reject("Error: Database not found");

    const dbUrl = `users/${userId}`;
    const userRef = doc(db, dbUrl);

    await setDoc(
      userRef,
      {
        profilePic,
      },
      { merge: true }
    );
    console.log(`User ${userId} changed profile picture`);
    return Promise.resolve();
  } catch (error) {
    console.log("Error changing profile picture: ", error);
    return Promise.reject(error);
  }
};

//Change user's profile info
export const changeProfileInfo = async (userId: string, profileInfo: any) => {
  try {
    const db = getDb();
    if (!db) return Promise.reject("Error: Database not found");

    const dbUrl = `users/${userId}`;
    const userRef = doc(db, dbUrl);

    await setDoc(
      userRef,
      {
        ...profileInfo,
      },
      { merge: true }
    );
    console.log(`User ${userId} changed profile info`);
    return Promise.resolve();
  } catch (error) {
    console.log("Error changing profile info: ", error);
    return Promise.reject(error);
  }
};

//Check if username exists
export const checkIfUsernameExists = async (username: string) => {
  try {
    const db = getDb();
    if (!db) return Promise.reject("Error: Database not found");

    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);

    return querySnapshot.size > 0;
  } catch (error) {
    console.log("Error checking if username exists: ", error);
    return Promise.reject(error);
  }
};

// Update user email
export const updateUserEmail = async (email: string) => {
  const auth = getAuth();
  if (!auth.currentUser) return Promise.reject("Error: User not found");
  await sendEmailVerificationFirebase(auth.currentUser);

  // updateEmail(auth.currentUser, email)
  //   .then(() => {
  //     console.log("Email updated");
  //   })
  //   .catch((error) => {
  //     console.log("Error updating email: ", error);
  //     return Promise.reject(error);
  //   });
  return Promise.resolve();
};

//Reauthenticate user
export const reauthenticateUser = async (email: string, password: string) => {
  const auth = getAuth();
  if (!auth.currentUser) return Promise.reject("Error: User not found");
  const credential = EmailAuthProvider.credential(email, password);

  return await reauthenticateWithCredential(auth.currentUser, credential);
};
