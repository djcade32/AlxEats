import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import Font from "@/constants/Font";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";

interface CustomAuthenticatedHeaderProps {
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

const CustomAuthenticatedHeader = ({ headerLeft, headerRight }: CustomAuthenticatedHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Image
        source={require("@/assets/images/alxeats-logo-black-text.png")}
        style={styles.alxeatsLogo}
      />
      <TouchableOpacity style={styles.iconContainer}>{headerRight}</TouchableOpacity>
    </View>
  );
};

export default CustomAuthenticatedHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray,
    justifyContent: "space-between",
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
  alxeatsLogo: {
    width: 130,
    height: 46,
  },
});
