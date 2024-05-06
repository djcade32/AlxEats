import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="restaurantDetails/[id]"
        options={{ headerShown: true, headerTransparent: true }}
      />
      <Stack.Screen name="(modals)/editComment" />
    </Stack>
  );
};

export default _layout;
