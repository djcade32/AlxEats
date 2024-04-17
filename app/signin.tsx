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

const signin = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", error);
    }
  }, [error]);

  const validateForm = () => {
    if (!emailAddress.includes("@") || !emailAddress.includes(".")) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSignin = async () => {
    if (!validateForm() || isSigningIn) return;
    setIsSigningIn(true);

    if (!isLoaded) return;
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
      router.replace("/home");
    } catch (err: any) {
      console.log("error", JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        if (
          err.errors[0].code === "form_identifier_not_found" ||
          err.errors[0].code === "form_password_incorrect" ||
          err.errors[0].code === "form_param_format_invalid"
        ) {
          setError("Invalid email or password. Please try again.");
        }
      }
    } finally {
      setIsSigningIn(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={{ marginTop: 45, gap: 20 }}>
          <CustomTextInput
            value={emailAddress}
            placeholder="Email"
            icon={<Ionicons name="mail-outline" size={24} color={Colors.gray} />}
            onChange={setEmailAddress}
            error={error !== null}
          />
          <CustomTextInput
            value={password}
            placeholder="Password"
            icon={<Ionicons name="lock-closed-outline" size={24} color={Colors.gray} />}
            onChange={setPassword}
            password
            error={error !== null}
          />
          <CustomLoadingButton
            text="Sign in"
            buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
            textStyle={[styles.btnText, { color: "white" }]}
            onPress={handleSignin}
            disabled={!emailAddress || !password}
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
