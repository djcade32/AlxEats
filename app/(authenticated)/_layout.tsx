import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { checkIfEmailExists, getDb, getUserRestaurantsToTryList } from "@/firebase";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { TouchableOpacity } from "react-native";
import { useAppStore } from "@/store/app-storage";

const _layout = () => {
  const {
    userDbInfo,
    setAuthUser,
    setUserDbInfo,
    setUserToTryRestaurants,
    setUserTriedRestaurants,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (isLoading) return;
  //   setIsLoading(true);
  //   (async () => {
  //     if (userDbInfo) {
  //       setUserToTryRestaurants(await getUserRestaurantsToTryList(userDbInfo.id));
  //       console.log("User to try restaurants retrieved");
  //     }
  //   })();
  // }, []);

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
  }, []);

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
  }, []);

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
