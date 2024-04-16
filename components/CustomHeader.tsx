import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import Font from "@/constants/Font";
import { useRouter } from "expo-router";

interface CustomHeaderProps {
  title: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

const CustomHeader = ({ title, headerLeft, headerRight }: CustomHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.iconContainer}>
        {headerLeft}
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.iconContainer}>{headerRight}</TouchableOpacity>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 35,
  },
  title: {
    fontSize: Font.medium,
    fontFamily: "nm-b",
    textAlign: "center",
    flex: 1,
  },
});
