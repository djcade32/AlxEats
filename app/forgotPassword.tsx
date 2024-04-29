import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";
import CustomTextInput from "@/components/CustomTextInput";
import { Ionicons } from "@expo/vector-icons";
import { Error } from "@/interfaces";
import CustomButton from "@/components/CustomButton";
import { createError } from "@/common-utils";
import * as Haptics from "expo-haptics";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const forgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorState, setErrorState] = useState<Error[]>([]);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const { signIn, isLoaded } = useSignIn();

  const router = useRouter();

  const handleSendLinkPressed = async () => {
    if (!isLoaded || !signIn) return;
    if (!email.includes("@") || !email.includes(".")) {
      setErrorState((prev) => [
        ...prev,
        createError("email", "Please enter a valid email address."),
      ]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
      Alert.alert("Code sent", "We have sent the verification code to your email.");
    } catch (err: any) {
      Alert.alert("Password reset failed. Please try again later.");
      console.log(err.errors[0].message);
    }
  };

  const handleResetPassword = async () => {
    if (!isLoaded || !signIn) return;

    if (!validateForm()) return;

    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      Alert.alert("Password reset successfully");

      router.replace("/signin");
    } catch (err: any) {
      console.log(err.errors[0].message);
      err.errors[0].code === "form_code_incorrect"
        ? Alert.alert("Error", "Incorrect verification code. Please try again.")
        : Alert.alert("Error", "An error occurred while verifying your email.");
    }
  };

  const validateForm = () => {
    let errors: Error[] = [];
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;

    if (!password) {
      errors.push(createError("password", "Please enter a password"));
    }
    if (password && password.length < 8) {
      errors.push(createError("password", "Password must be at least 8 characters long"));
    }
    if (password && !passwordRegex.test(password)) {
      errors.push(
        createError("password", "Must contain at least one number and one special character")
      );
    }

    setErrorState(errors);
    return errors.length === 0;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.directions}>
        {successfulCreation
          ? "Enter the code sent to your email and your new password."
          : "Forgot your password? Enter your email address and we will email you a code to reset it."}{" "}
      </Text>
      {successfulCreation ? (
        <>
          <CustomTextInput
            name="verificationInput"
            placeholder="Enter code"
            value={code}
            onChange={setCode}
            keyboardType="numeric"
            customStyles={{ marginTop: 35 }}
            autoFocus
          />
          <CustomTextInput
            name="password"
            value={password}
            placeholder="Password"
            icon={<Ionicons name="lock-closed-outline" size={24} color={Colors.gray} />}
            onChange={setPassword}
            password
            errors={errorState}
            setErrors={setErrorState}
          />
        </>
      ) : (
        <>
          <CustomTextInput
            name="email"
            placeholder="Email"
            icon={<Ionicons name="mail-outline" size={24} color={Colors.gray} />}
            customStyles={{ marginTop: 35 }}
            value={email}
            onChange={setEmail}
            errors={errorState}
            setErrors={setErrorState}
            autoFocus
          />
        </>
      )}
      <CustomButton
        text={successfulCreation ? "Reset password" : "Send link"}
        buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
        textStyle={[styles.btnText, { color: "white" }]}
        onPress={successfulCreation ? handleResetPassword : handleSendLinkPressed}
        disabled={!email}
      />
    </View>
  );
};

export default forgotPassword;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    flex: 1,
  },
  directions: {
    fontSize: Font.small,
    marginTop: 45,
    textAlign: "center",
    color: Colors.black,
  },
  btnContainer: {
    marginTop: 50,
    borderRadius: 25,
    paddingVertical: 10,
  },
  btnText: {
    fontSize: 18,
  },
});
