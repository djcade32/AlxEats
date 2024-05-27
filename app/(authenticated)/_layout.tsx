import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { getDb } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const _layout = () => {
  const router = useRouter();
  const db = getDb();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    setIsLoading(true);
    checkIfEmailExists()
      .then((exists) =>
        exists ? router.replace("/(authenticated)/home") : router.replace("(onboarding)/")
      )
      .finally(() => setIsLoading(false));
  }, []);

  const checkIfEmailExists = async (): Promise<boolean> => {
    let emailExists = false;
    const email = getAuth().currentUser?.email;
    if (!db || !email) return emailExists;
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    emailExists = querySnapshot.docs.length > 0;
    return emailExists;
  };
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
      <Stack.Screen name="(modals)/editComment" />
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
