import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { getDb } from "@/firebase";
import { collection, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
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
    setAppLoading,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  // Get user to try restaurants
  useEffect(() => {
    (async () => {
      setUserToTryRestaurants([]);
      setUserTriedRestaurants([]);
      setUserFollowing([]);
      setUserFollowers([]);
      setUserPosts([]);

      if (!userDbInfo) return;
      let db = getDb();

      const unsubscribeList: any = [];

      const handleDataRetrieval = async () => {
        let promises = [];

        let q = query(collection(db!, `userRestaurants/${userDbInfo.id}/toTry`));
        promises.push(
          new Promise((resolve) => {
            const unsubscribe = onSnapshot(q, (snapshot) => {
              snapshot.docChanges().forEach((change) => {
                setUserToTryRestaurants(change.doc.data().data);
                console.log("User to try restaurants retrieved");
              });
              resolve("done");
            });
            unsubscribeList.push(unsubscribe);
          })
        );

        q = query(collection(db!, `userRestaurants/${userDbInfo.id}/tried`));
        promises.push(
          new Promise((resolve) => {
            const unsubscribe = onSnapshot(q, (snapshot) => {
              snapshot.docChanges().forEach((change) => {
                setUserTriedRestaurants(change.doc.data().data);
                console.log("User tried restaurants retrieved");
              });
              resolve("done");
            });
            unsubscribeList.push(unsubscribe);
          })
        );

        let dbUrl = `followings/${userDbInfo.id}`;
        let userRef = doc(db!, dbUrl);
        promises.push(
          new Promise((resolve) => {
            const unsubscribe = onSnapshot(userRef, (snapshot) => {
              if (!snapshot.exists()) return;
              setUserFollowing(snapshot.data().following);
              resolve("done");
            });
            unsubscribeList.push(unsubscribe);
          })
        );

        promises.push(
          new Promise((resolve) => {
            const unsubscribe = onSnapshot(userRef, (snapshot) => {
              if (!snapshot.exists()) return;
              setUserFollowers(snapshot.data().followedBy);
              resolve("done");
            });
            unsubscribeList.push(unsubscribe);
          })
        );

        q = query(
          collection(db!, `feed`),
          where("userId", "==", userDbInfo.id),
          orderBy("createdAt", "desc")
        );
        promises.push(
          new Promise((resolve) => {
            const unsubscribe = onSnapshot(q, (snapshot) => {
              setUserPosts([...snapshot.docs.map((doc) => doc.data() as FeedPost)]);
              console.log("User's posts retrieved");
              resolve("done");
            });
            unsubscribeList.push(unsubscribe);
          })
        );

        await Promise.all(promises);
        setAppLoading(false);
      };

      handleDataRetrieval();

      return () => {
        unsubscribeList.forEach((unsubscribe: any) => unsubscribe());
      };
    })();
  }, [userDbInfo]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="restaurantDetails"
        options={{ headerShown: false, headerTransparent: true }}
      />
      <Stack.Screen
        name="EditProfile/index"
        options={{
          header: () => (
            <CustomHeader
              title="Edit Profile"
              headerLeft={
                <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
              }
            />
          ),
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="(modals)/Filter/index"
        options={{
          headerShown: true,
          headerTransparent: true,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="(modals)/Filter/cuisinesFilter"
        options={{ headerShown: true, headerTransparent: true, presentation: "modal" }}
      />
      <Stack.Screen
        name="(settings)/index"
        options={{ headerShown: true, headerTransparent: true }}
      />
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
      <Stack.Screen
        name="(settings)/changeEmail"
        options={{
          headerShown: true,
          headerTransparent: true,
          contentStyle: { backgroundColor: "white" },
        }}
      />
    </Stack>
  );
};

export default _layout;
