import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

import Colors from "@/constants/Colors";

import Font from "@/constants/Font";

import CustomButton from "@/components/CustomButton";

const index = () => {
  const router = useRouter();

  const handleContinuePressed = async () => {
    router.push("/(authenticated)/(onboarding)/fullname");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Ready to embark on your journey with us? Let's get you started with a quick onboarding!
      </Text>

      <CustomButton
        text="Continue"
        buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
        textStyle={[styles.btnText, { color: "white" }]}
        onPress={handleContinuePressed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 30,
    justifyContent: "space-around",
  },

  text: {
    color: Colors.black,
    fontSize: Font.medium,
    textAlign: "center",
    lineHeight: 35,
  },

  btnContainer: {
    marginTop: 35,
    borderRadius: 25,
    height: 40,
  },
  btnText: {
    fontSize: 18,
  },
});

export default index;
