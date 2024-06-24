import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "@/components/CustomTextInput";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import CustomLoadingButton from "@/components/CustomLoadingButton";
import Font from "@/constants/Font";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Error } from "@/interfaces";
import { createError, hasError } from "@/common-utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import EmailVerificationModal from "@/components/EmailVerificationModal";
import { useAppStore } from "@/store/app-storage";
import { checkIfEmailExists, sendEmailVerification, signIn } from "@/firebase";
import { FirebaseError } from "firebase/app";

const signin = () => {
  const { pendingEmailVerification, setPendingEmailVerification, setAppLoading } = useAppStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorState, setErrorState] = useState<Error[]>([]);
  const [sendingEmailVerification, setSendingEmailVerification] = useState(false);

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
    if (!validateForm()) return;
    setIsSigningIn(true);

    try {
      const authUser = await signIn(email, password);
      if (!authUser.user.emailVerified) {
        console.log("email not verified");
        sendEmailVerification().then(() => setPendingEmailVerification(true));
        return;
      }
      checkIfEmailExists().then((exists) => {
        setAppLoading(true);
        exists ? router.replace("/(authenticated)/(home)/") : router.replace("(onboarding)/");
      });
      console.log("signed in");
    } catch (error: any) {
      const err: FirebaseError = error;
      if (err.code === "auth/invalid-credential") {
        setErrorState((prev) => [
          ...prev,
          createError("email", ""),
          createError("password", ""),
          createError("invalidUser", ""),
        ]);
      }
      console.log("error", err.code);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setEmail("");
      setPassword("");
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
            onChange={(text) => {
              if (hasError(errorState, "invalidUser")) setErrorState([]);
              setEmail(text);
            }}
            errors={errorState}
            setErrors={setErrorState}
            autoFocus
            autoCapitalize="none"
          />
          <CustomTextInput
            name="password"
            value={password}
            placeholder="Password"
            icon={<Ionicons name="lock-closed-outline" size={24} color={Colors.gray} />}
            onChange={(text) => {
              if (hasError(errorState, "invalidUser")) setErrorState([]);
              setPassword(text);
            }}
            password
            errors={errorState}
            setErrors={setErrorState}
          />

          <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
            <Text
              style={{
                color: Colors.primary,
                fontSize: Font.small,
                marginBottom: 20,
                fontWeight: "bold",
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
          <CustomLoadingButton
            text="Sign in"
            buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
            textStyle={[styles.btnText, { color: "white" }]}
            onPress={handleSignin}
            disabled={!email || !password}
            loading={isSigningIn}
          />
        </View>
        <EmailVerificationModal
          isModalVisible={pendingEmailVerification}
          toggleModal={() => setPendingEmailVerification(false)}
          title="Please verify email"
          body="Email verification sent! Please check your email to verify your account."
          onResend={() => {
            setPendingEmailVerification(false);
            setSendingEmailVerification(true);
            sendEmailVerification().then(() => setSendingEmailVerification(false));
          }}
          loading={sendingEmailVerification}
        />
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
    marginTop: 40,
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
