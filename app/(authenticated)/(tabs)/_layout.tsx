import { TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomAuthenticatedHeader from "@/components/CustomAuthenticatedHeader";
import * as Location from "expo-location";
import { getDb } from "@/firebase";

const Layout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const db = getDb();

  // if (isLoading) return <Text style={{ paddingTop: 30 }}>Loading...</Text>;
  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        // You may handle the denial of permission here
        return;
      }

      // let location = await Location.getCurrentPositionAsync({});
      // console.log("Current location:", location.coords);
      // You may use the current location here
    } catch (error) {
      console.error("Error getting location:", error);
      // You may handle errors related to location access here
    }
  };

  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          height: 80,
          paddingBottom: 30,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          headerShown: false,
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(yourLists)"
        options={{
          headerShown: false,
          title: "Your Lists",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="currentUser"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
