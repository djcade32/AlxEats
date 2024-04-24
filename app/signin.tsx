import { Alert, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomTextInput from "@/components/CustomTextInput";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import CustomLoadingButton from "@/components/CustomLoadingButton";
import Font from "@/constants/Font";
import { useRouter } from "expo-router";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import CustomButton from "@/components/CustomButton";
import * as Haptics from "expo-haptics";
import { Error } from "@/interfaces";
import { createError, hasError } from "@/common-utils";

const signin = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorState, setErrorState] = useState<Error[]>([]);

  const validateForm = () => {
    if (!email.includes("@") || !email.includes(".")) {
      setErrorState((prev) => [
        ...prev,
        createError("email", "Please enter a valid email address."),
      ]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      return false;
    }
    return true;
  };

  const handleSignin = async () => {
    const emailAddress = email.trim();
    const pass = password.trim();
    if (!validateForm() || isSigningIn) return;
    setIsSigningIn(true);

    if (!isLoaded) return;
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password: pass,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
      setErrorState([]);
      router.replace("/home");
    } catch (err: any) {
      console.log("error", JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        if (
          err.errors[0].code === "form_identifier_not_found" ||
          err.errors[0].code === "form_password_incorrect" ||
          err.errors[0].code === "form_param_format_invalid"
        ) {
          setErrorState((prev) => [
            ...prev,
            createError("password", ""),
            createError("email", ""),
            createError("invalidUser", ""),
          ]);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    } finally {
      setIsSigningIn(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={{ marginTop: 45 }}>
          <View style={{ height: 20 }}>
            {hasError(errorState, "invalidUser") && (
              <Text style={{ fontSize: 12, color: Colors.error, textAlign: "center" }}>
                Invalid email or password. Please try again.
              </Text>
            )}
          </View>
          <CustomTextInput
            name="email"
            value={email}
            placeholder="Email"
            icon={<Ionicons name="mail-outline" size={24} color={Colors.gray} />}
            onChange={setEmail}
            errors={errorState}
            setErrors={setErrorState}
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

          <CustomLoadingButton
            text="Sign in"
            buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
            textStyle={[styles.btnText, { color: "white" }]}
            onPress={handleSignin}
            disabled={!email || !password}
            loading={isSigningIn}
          />
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={{ fontFamily: "nm-sb", fontSize: Font.medium, color: Colors.gray }}>or</Text>
          <View style={styles.separator} />
        </View>
        <View style={{ gap: 35, paddingTop: 15 }}>
          <CustomButton
            text="Sign in with Apple"
            buttonStyle={[
              styles.btnContainer,
              { backgroundColor: "white", borderWidth: 1, borderColor: Colors.black },
            ]}
            textStyle={[styles.btnText, { color: Colors.black }]}
            onPress={() => {}}
            icon={<Ionicons name="logo-apple" size={24} color={Colors.black} />}
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
    height: 40,
  },
  btnText: {
    fontSize: 18,
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
