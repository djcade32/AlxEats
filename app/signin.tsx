import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React from "react";
import CustomTextInput from "@/components/CustomTextInput";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import Font from "@/constants/Font";

const signin = () => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={{ marginTop: 45, gap: 20 }}>
          <CustomTextInput
            placeholder="Email"
            icon={<Ionicons name="mail-outline" size={24} color={Colors.gray} />}
          />
          <CustomTextInput
            placeholder="Password"
            icon={<Ionicons name="lock-closed-outline" size={24} color={Colors.gray} />}
            password
          />
          <CustomButton
            text="Sign in"
            buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
            textStyle={[styles.btnText, { color: "white" }]}
            onPress={() => {}}
          />
        </View>
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={{ fontFamily: "nm-sb", fontSize: Font.medium, color: Colors.gray }}>or</Text>
          <View style={styles.separator} />
        </View>
        <View style={{ gap: 35, paddingTop: 15 }}>
          <CustomButton
            text="Sign in with Phone"
            buttonStyle={[
              styles.btnContainer,
              { backgroundColor: "white", borderWidth: 1, borderColor: Colors.black },
            ]}
            textStyle={[styles.btnText, { color: Colors.black }]}
            onPress={() => {}}
            icon={<Ionicons name="phone-portrait-outline" size={24} color={Colors.black} />}
          />
          <CustomButton
            text="Sign in with Google"
            buttonStyle={[
              styles.btnContainer,
              { backgroundColor: "white", borderWidth: 1, borderColor: Colors.black },
            ]}
            textStyle={[styles.btnText, { color: Colors.black }]}
            onPress={() => {}}
            icon={<Ionicons name="logo-google" size={24} color={Colors.black} />}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default signin;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    flex: 1,
  },
  btnContainer: {
    borderRadius: 25,
  },
  btnText: {
    fontSize: 18,
    paddingVertical: 10,
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
});
