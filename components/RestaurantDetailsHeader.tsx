import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import Font from "@/constants/Font";
import { Stack, useRouter } from "expo-router";

interface RestaurantDetailsHeaderProps {
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

const RestaurantDetailsHeader = ({ headerLeft, headerRight }: RestaurantDetailsHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Stack.Screen
      options={{
        header: () => (
          <View style={[styles.container, { paddingTop: top }]}>
            <View>
              <TouchableOpacity onPress={() => router.back()}>{headerLeft}</TouchableOpacity>
            </View>

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
