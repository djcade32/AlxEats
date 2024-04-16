import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import Font from "@/constants/Font";
import CustomTextInput from "@/components/CustomTextInput";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();

  const handleContinueWithEmail = () => {
    router.push({ pathname: "/signup/[email]", params: { email: "Test" } });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.directions}>Sign up with one of the provided options</Text>
        <CustomTextInput
          placeholder="Email"
          icon={<Ionicons name="mail-outline" size={24} color={Colors.gray} />}
          customStyles={{ marginTop: 35 }}
        />
        <CustomButton
          text="Continue"
          buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
          textStyle={[styles.btnText, { color: "white" }]}
          onPress={handleContinueWithEmail}
        />
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={{ fontFamily: "nm-sb", fontSize: Font.medium, color: Colors.gray }}>or</Text>
          <View style={styles.separator} />
        </View>
        <CustomButton
          text="Continue with Phone"
          buttonStyle={[
            styles.btnContainer,
            { backgroundColor: "white", borderWidth: 1, borderColor: Colors.black },
          ]}
          textStyle={[styles.btnText, { color: Colors.black }]}
          onPress={() => {}}
          icon={<Ionicons name="phone-portrait-outline" size={24} color={Colors.black} />}
        />
        <CustomButton
          text="Continue with Google"
          buttonStyle={[
            styles.btnContainer,
            { backgroundColor: "white", borderWidth: 1, borderColor: Colors.black },
          ]}
          textStyle={[styles.btnText, { color: Colors.black }]}
          onPress={() => {}}
          icon={<Ionicons name="logo-google" size={24} color={Colors.black} />}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  directions: {
    fontSize: Font.small,
    marginTop: 45,
    textAlign: "center",
    color: Colors.black,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginVertical: 20,
  },
  separator: {
    height: 1,
    borderColor: Colors.gray,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
  btnContainer: {
    marginTop: 35,
    width: "100%",
    borderRadius: 25,
  },
  btnText: {
    fontSize: 18,
    paddingVertical: 10,
  },
});
