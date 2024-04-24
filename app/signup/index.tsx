import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useState } from "react";
import Font from "@/constants/Font";
import CustomTextInput from "@/components/CustomTextInput";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Error } from "@/interfaces";
import { createError } from "@/common-utils";
import { getDb } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import useWarmupBrowser from "@/hooks/useWarmupBrowser";
import { useAuth, useOAuth, useUser } from "@clerk/clerk-expo";
import { SignInMethods, Strategy } from "@/enums";
import { useUserStore } from "@/store/userStorage";
import { useAppStore } from "@/store/app-storage";

const index = () => {
  useWarmupBrowser();
  const router = useRouter();
  const { updateSignInMethod } = useAppStore();
  const db = getDb();

  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: Strategy.Apple });
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: Strategy.Google });

  const [email, setEmail] = useState("");
  const [errorState, setErrorState] = useState<Error[]>([]);

  const validateForm = (): boolean => {
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

  const handleContinueWithEmail = async (): Promise<void> => {
    if (!validateForm()) return;
    const emailExists = await checkIfEmailExists();
    if (emailExists) return;
    router.push({ pathname: "/signup/restaurantCriteria", params: { emailParam: email } });
    setErrorState([]);
  };

  const checkIfEmailExists = async (): Promise<boolean> => {
    let emailExists = false;
    if (!db || !email) return emailExists;
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    emailExists = querySnapshot.docs.length > 0;
    if (emailExists) {
      setErrorState((prev) => [
        ...prev,
        createError("email", "Email already exists. Please log in."),
      ]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    return emailExists;
  };

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Apple]: appleAuth,
      [Strategy.Google]: googleAuth,
    }[strategy];
    try {
      const { createdSessionId, setActive } = await selectedAuth();
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (e) {
      console.log("OAuth error: ", e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.directions}>Sign up with one of the provided options</Text>
        <CustomTextInput
          name="email"
          placeholder="Email"
          icon={<Ionicons name="mail-outline" size={24} color={Colors.gray} />}
          customStyles={{ marginTop: 35 }}
          value={email}
          onChange={setEmail}
          errors={errorState}
          setErrors={setErrorState}
        />
        <CustomButton
          text="Continue"
          buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
          textStyle={[styles.btnText, { color: "white" }]}
          onPress={handleContinueWithEmail}
          disabled={!email}
        />
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={{ fontFamily: "nm-sb", fontSize: Font.medium, color: Colors.gray }}>or</Text>
          <View style={styles.separator} />
        </View>
        <CustomButton
          text="Continue with Apple"
          buttonStyle={[
            styles.btnContainer,
            { backgroundColor: "white", borderWidth: 1, borderColor: Colors.black },
          ]}
          textStyle={[styles.btnText, { color: Colors.black }]}
          onPress={() => {
            onSelectAuth(Strategy.Apple);
            updateSignInMethod(SignInMethods.Apple);
          }}
          icon={<Ionicons name="logo-apple" size={24} color={Colors.black} />}
        />
        <CustomButton
          text="Continue with Google"
          buttonStyle={[
            styles.btnContainer,
            { backgroundColor: "white", borderWidth: 1, borderColor: Colors.black },
          ]}
          textStyle={[styles.btnText, { color: Colors.black }]}
          onPress={() => {
            onSelectAuth(Strategy.Google);
            updateSignInMethod(SignInMethods.Google);
          }}
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
    borderRadius: 25,
    paddingVertical: 10,
  },
  btnText: {
    fontSize: 18,
  },
});
