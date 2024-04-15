import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Font from "@/constants/Font";
import Button from "@/components/Button";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedWords from "@/components/AnimatedWords";

const index = () => {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[Colors.primary, "#051822"]} style={styles.background} />
      <SafeAreaView style={styles.container}>
        <View
          style={{
            marginTop: 276,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/images/alxeats-logo-white-text.png")}
            style={styles.alxeatsLogo}
          />

          <AnimatedWords />
          <Text style={styles.tagLine}>Your Culinary Adventure Starts Here</Text>
        </View>

        <View
          style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 100, alignItems: "center" }}
        >
          <Button text={"Get started"} buttonStyle={styles.button} textStyle={styles.buttonText} />
          <TouchableOpacity>
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
    maxWidth: "75%",
    letterSpacing: 1.25,
    marginTop: 40,
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
