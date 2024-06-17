import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Font from "@/constants/Font";
import CustomTextInput from "@/components/CustomTextInput";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Error } from "@/interfaces";
import { createError } from "@/common-utils";
import { createAccount, getDb } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAppStore } from "@/store/app-storage";
import { FirebaseError } from "firebase/app";
import CustomLoadingButton from "@/components/CustomLoadingButton";

/**
 * The `index` component is responsible for rendering the signup page.
 * It includes form validation, handling user input, and creating a new account.
 */
const index = () => {
  const router = useRouter();
  const db = getDb();
  const { setPendingEmailVerification } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorState, setErrorState] = useState<Error[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (errorState.length === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, [errorState]);

  /**
   * The function `validateForm` checks if the email and password inputs meet certain criteria and
   * returns true if there are no errors.
   * @returns The `validateForm` function is returning a boolean value. It returns `true` if there are
   * no errors in the form validation process, and `false` if there are any errors present.
   */
  const validateForm = (): boolean => {
    let errors: Error[] = [];
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;

    if (!email) {
      console.log("email invalid");
      errors.push(createError("email", "Please enter your email address"));
    }
    if ((email && !email.includes("@")) || (email && !email.includes("."))) {
      errors.push(createError("email", "Please enter a valid email address"));
    }

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

  /**
   * The function `handleCreateAccount` is an asynchronous function that handles creating a new
   * account, validating the form, and setting pending email verification.
   * @returns Error: Auth not found
   */
  const handleCreateAccount = async () => {
    try {
      if (!getAuth()) return console.log("Error: Auth not found");
      setLoading(true);
      if (!validateForm()) return;
      await createAccount(email, password);
      setPendingEmailVerification(true);
      router.replace("/signin");
    } catch (error: any) {
      const err: FirebaseError = error;
      console.log(JSON.stringify(err, null, 2));
      if (err.code === "auth/email-already-in-use") {
        setErrorState((prev) => [
          ...prev,
          createError("email", "Email already exists. Please log in."),
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.directions}>
        Sign up with your email to start your culinary journey with AlxEats!
      </Text>
      <View style={{ gap: 10 }}>
        <CustomTextInput
          name="email"
          placeholder="Email"
          icon={<Ionicons name="mail-outline" size={24} color={Colors.gray} />}
          customStyles={{ marginTop: 35, borderWidth: 1 }}
          value={email}
          onChange={setEmail}
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
          onChange={setPassword}
          password
          errors={errorState}
          setErrors={setErrorState}
        />
      </View>

      <CustomLoadingButton
        text="Create Account"
        buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
        textStyle={[styles.btnText, { color: "white" }]}
        onPress={handleCreateAccount}
        disabled={!email || !password}
        loading={loading}
      />
    </View>
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
    marginTop: 50,
    borderRadius: 25,
    paddingVertical: 10,
  },
  btnText: {
    fontSize: 18,
  },
});
