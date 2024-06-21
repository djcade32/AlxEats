import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import Font from "@/constants/Font";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import LoadingText from "./LoadingText";

interface CustomHeaderProps {
  title: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  loading?: boolean;
}

const CustomHeader = ({ title, headerLeft, headerRight, loading = false }: CustomHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <TouchableOpacity onPress={() => router.dismiss()} style={styles.iconContainer}>
        {headerLeft}
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LoadingText
          title={title}
          loading={loading}
          textStyle={styles.title}
          containerStyle={{ height: 25, width: 150, borderRadius: 15 }}
        />
      </View>
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
    backgroundColor: "white",
  },
  iconContainer: {
    width: 35,
  },
  title: {
    fontSize: Font.medium,
    fontFamily: "nm-b",
    textAlign: "center",
    // flex: 1,
  },
});
