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
// import { useSignIn } from "/clerk-expo";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "@/firebase";
import CustomLoadingButton from "@/components/CustomLoadingButton";

const forgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorState, setErrorState] = useState<Error[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendLinkPressed = async () => {
    setIsLoading(true);
    if (!email.includes("@") || !email.includes(".")) {
      setErrorState((prev) => [
        ...prev,
        createError("email", "Please enter a valid email address."),
      ]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }
    try {
      sendPasswordResetEmail(email);
      Alert.alert("Email Sent", "We have sent the password reset link to your email.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Failed to send link. Please try again later.");
      console.log(err.errors[0].message);
    } finally {
      setEmail("");
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.directions}>
        Forgot your password? Enter your email address and we will email you a password reset link.
      </Text>

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
          autoCapitalize="none"
        />
      </>
      <CustomLoadingButton
        text="Send link"
        buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
        textStyle={[styles.btnText, { color: "white" }]}
        onPress={handleSendLinkPressed}
        disabled={!email}
        loading={isLoading}
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
