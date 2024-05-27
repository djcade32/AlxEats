import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import CustomTextInput from "@/components/CustomTextInput";
import Colors from "@/constants/Colors";

import Font from "@/constants/Font";
import CustomButton from "@/components/CustomButton";

const fullname = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleContinuePressed = async () => {
    if (!firstName || !lastName) return;
    router.push({
      pathname: "/(authenticated)/(onboarding)/profilePic",
      params: { firstName, lastName },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.directions}>Hi there! What should we call you?</Text>
      <View style={{ height: "65%", gap: 10 }}>
        <View>
          <Text style={styles.textInputLabel}>First name</Text>
          <CustomTextInput
            name="firstName"
            placeholder="First name"
            value={firstName}
            onChange={setFirstName}
            autoFocus
            showErrorMessage={false}
          />
        </View>
        <View>
          <Text style={styles.textInputLabel}>Last name</Text>
          <CustomTextInput
            name="lastName"
            placeholder="Last name"
            value={lastName}
            onChange={setLastName}
            showErrorMessage={false}
          />
        </View>
        <CustomButton
          text="Continue"
          buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
          textStyle={[styles.btnText, { color: "white" }]}
          onPress={handleContinuePressed}
          disabled={!firstName || !lastName}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
    paddingTop: 20,
    paddingHorizontal: 30,
  },

  textInputLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  btnContainer: {
    marginTop: 35,
    borderRadius: 25,
    height: 40,
  },
  btnText: {
    fontSize: 18,
  },
  favCuisineBtn: {
    borderWidth: 1,
    borderRadius: 15,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
  },
  directions: {
    fontSize: Font.small,
    marginVertical: 20,
    textAlign: "center",
    color: Colors.black,
    alignSelf: "center",
  },
});

export default fullname;
