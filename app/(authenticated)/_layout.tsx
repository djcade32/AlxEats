import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { checkIfEmailExists, getDb, getUserRestaurantsToTryList } from "@/firebase";
import { collection, doc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { TouchableOpacity } from "react-native";
import { useAppStore } from "@/store/app-storage";
import { FeedPost } from "@/interfaces";

const _layout = () => {
  const {
    userDbInfo,
    setUserToTryRestaurants,
    setUserTriedRestaurants,
    setUserFollowers,
    setUserFollowing,
    setUserPosts,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUserToTryRestaurants([]);

    if (!userDbInfo) return;
    let db = getDb();
    const q = query(collection(db!, `userRestaurants/${userDbInfo?.id}/toTry`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        setUserToTryRestaurants(change.doc.data().data);
        console.log("User to try restaurants retrieved");
      });
    });
    return () => unsubscribe();
  }, [userDbInfo]);

  useEffect(() => {
    if (!userDbInfo) return;
    setUserTriedRestaurants([]);

    let db = getDb();
    const q = query(collection(db!, `userRestaurants/${userDbInfo?.id}/tried`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        setUserTriedRestaurants(change.doc.data().data);
        console.log("User tried restaurants retrieved");
      });
    });

    return () => unsubscribe();
  }, [userDbInfo]);

  useEffect(() => {
    if (!userDbInfo) return;

    setUserFollowing([]);
    let db = getDb();
    const dbUrl = `followings/${userDbInfo?.id}`;
    const userRef = doc(db!, dbUrl);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (!snapshot.exists()) return;
      setUserFollowing(snapshot.data().following);
    });

    return () => unsubscribe();
  }, [userDbInfo]);

  useEffect(() => {
    if (!userDbInfo) return;

    setUserFollowers([]);

    let db = getDb();
    const dbUrl = `followings/${userDbInfo?.id}`;
    const userRef = doc(db!, dbUrl);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (!snapshot.exists()) return;
      setUserFollowers(snapshot.data().followedBy);
    });

    return () => unsubscribe();
  }, [userDbInfo]);

  //Get user posts
  useEffect(() => {
    if (!userDbInfo) return;
    let db = getDb();
    const q = query(
      collection(db!, `feed`),
      where("userId", "==", userDbInfo.id),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserPosts([...snapshot.docs.map((doc) => doc.data() as FeedPost)]);
      console.log("User's posts retrieved");
    });

    return () => unsubscribe();
  }, [userDbInfo]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="restaurantDetails/[id]"
        options={{ headerShown: true, headerTransparent: true }}
      />
      <Stack.Screen
        name="(modals)/Filter/index"
        options={{ headerShown: true, headerTransparent: true, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="(modals)/Filter/cuisinesFilter"
        options={{ headerShown: true, headerTransparent: true, presentation: "modal" }}
      />
      <Stack.Screen name="settings" options={{ headerShown: true, headerTransparent: true }} />
      <Stack.Screen
        name="(modals)/editComment"
        options={{ presentation: "modal", gestureEnabled: false }}
      />
      <Stack.Screen
        name="(modals)/RankRestaurant/index"
        options={{
          presentation: "modal",
          headerTransparent: true,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(modals)/RankRestaurant/selectedPhotos"
        options={{
          headerShown: true,
          headerTransparent: true,
          presentation: "modal",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(onboarding)/index"
        options={{
          header: () => <CustomHeader title="Onboarding" />,
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="(onboarding)/fullname"
        options={{
          header: () => (
            <CustomHeader
              title="What is your name?"
              headerLeft={
                <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
              }
            />
          ),
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="(onboarding)/profilePic"
        options={{
          header: () => (
            <CustomHeader
              title="Profile picture"
              headerLeft={
                <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
              }
            />
          ),
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="(onboarding)/favoriteCuisine"
        options={{
          header: () => (
            <CustomHeader
              title="Favorite cuisine?"
              headerLeft={
                <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
              }
            />
          ),
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="(onboarding)/restaurantCriteria"
        options={{
          header: () => (
            <CustomHeader
              title="Restaurant criteria"
              headerLeft={
                <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
              }
            />
          ),
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="(onboarding)/getStarted"
        options={{
          header: () => <CustomHeader title="" />,
          contentStyle: { backgroundColor: "white" },
        }}
      />
    </Stack>
  );
};

export default _layout;
