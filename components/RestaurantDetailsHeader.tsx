import { StyleSheet, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";

interface RestaurantDetailsHeaderProps {
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

const RestaurantDetailsHeader = ({ headerLeft, headerRight }: RestaurantDetailsHeaderProps) => {
  const { top } = useSafeAreaInsets();

  return (
    <Stack.Screen
      options={{
        headerTransparent: true,
        header: () => (
          <View style={[styles.container, { paddingTop: top }]}>
            <View>{headerLeft}</View>

            <View style={{ alignItems: "flex-end", flex: 1 }}>{headerRight}</View>
          </View>
        ),
      }}
    ></Stack.Screen>
  );
};

export default RestaurantDetailsHeader;

const styles = StyleSheet.create({
  container: {
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
