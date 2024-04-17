import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Font from "@/constants/Font";
import Button from "@/components/CustomButton";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedWords from "@/components/AnimatedWords";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";

const index = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[Colors.primary, "#051822"]} style={styles.background} />
      <SafeAreaView style={styles.container}>
        <View
          style={{
            marginTop: 175,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/images/alxeats-logo-white-text.png")}
            style={styles.alxeatsLogo}
          />

          <AnimatedWords />
          <View style={{ marginTop: 40, gap: 5 }}>
            <Text style={styles.tagLine}>Your Culinary Adventure </Text>
            <Text style={styles.tagLine}>Starts Here</Text>
          </View>
        </View>

        <View
          style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 100, alignItems: "center" }}
        >
          <CustomButton
            text={"Get started"}
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
            onPress={() => router.push("/signup/")}
          />
          <TouchableOpacity onPress={() => router.push("/signin")}>
            <Text style={{ color: Colors.gray, fontSize: Font.small, marginTop: 15 }}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  alxeatsLogo: {
    width: 346,
    height: 62,
    alignSelf: "center",
  },
  tagLine: {
    color: "white",
    fontSize: Font.medium,
    fontFamily: "nm",
    textAlign: "center",
    letterSpacing: 1.25,
  },
  button: {
    backgroundColor: Colors.secondary,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: Font.medium,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 75,
    paddingVertical: 10,
  },
});
