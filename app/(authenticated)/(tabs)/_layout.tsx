import { Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeader from "@/components/CustomHeader";
import CustomAuthenticatedHeader from "@/components/CustomAuthenticatedHeader";

const Layout = () => {
  return (
    <Tabs
      initialRouteName="home"
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
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          header: () => (
            <CustomAuthenticatedHeader
              headerRight={<Ionicons name="notifications-outline" size={22} color={Colors.black} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
          headerTransparent: true,
          //   headerShown: false,
        }}
      />
      <Tabs.Screen
        name="yourLists"
        options={{
          title: "Your Lists",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
          headerTransparent: true,
          //   headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          headerTransparent: true,
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;
