import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomTextInput from "@/components/CustomTextInput";
import { useAppStore } from "@/store/app-storage";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { createError, hasError } from "@/common-utils";
import { Error } from "@/interfaces";
import {
  changeProfileInfo,
  checkIfEmailExists,
  reauthenticateUser,
  updateUserEmail,
} from "@/firebase";
import { FirebaseError } from "firebase/app";

export default function emailAndPassword() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const { userDbInfo, setUserDbInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);
  const [password, setPassword] = useState("");
  const [reauthenticated, setReauthenticated] = useState(false);

  const handleEmailChange = async () => {
    if (!isValidEmail()) return;
    const emailExists = await checkIfEmailExists(email);
    if (emailExists !== null) {
      setErrors((prev) => [...prev, createError("email", "Email already exists")]);
      return;
    }

    //Change email
    await updateUserEmail(email);
    //Update userDbInfo
    //Update user email in db
    await changeProfileInfo(userDbInfo?.id!, {
      email,
    });
    setUserDbInfo({ ...userDbInfo!, email });
  };

  const isValidEmail = () => {
    if (!email) {
      setErrors((prev) => [...prev, createError("email", "Please enter your email address")]);
      return false;
    }
    if ((email && !email.includes("@")) || (email && !email.includes("."))) {
      setErrors((prev) => [...prev, createError("email", "Please enter a valid email address")]);
      return false;
    }
    return true;
  };

  const reauthenticate = async (email: string, password: string) => {
    try {
      const user = await reauthenticateUser(email, password);
      user && setReauthenticated(true);
    } catch (error: any) {
      const err: FirebaseError = error;
      if (err.code === "auth/invalid-credential") {
        setErrors((prev) => [
          ...prev,
          createError("invalidUser", "Invalid email or password. Please try again."),
        ]);
      }
    }
  };

  const handleButtonPress = async () => {
    if (reauthenticated) {
      handleEmailChange();
      return;
    }
    reauthenticate(email, password);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          title: "Change Email",
          headerTitleStyle: { fontFamily: "nm-b", fontSize: Font.medium },
          headerLeft: () => (
            <View style={styles.headerIconContainer}>
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <Ionicons name="chevron-back-circle-outline" size={30} color={Colors.black} />
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>
      <View style={{ marginTop: top, marginHorizontal: 20 }}>
        {reauthenticated ? (
          <View>
            <Text style={[styles.textSmall, { marginBottom: 5 }]}>Email</Text>
            <View>
              <CustomTextInput
                icon={<Ionicons name="mail-outline" size={24} color={Colors.gray} />}
                name="email"
                placeholder="Email"
                value={email}
                onChange={setEmail}
                autoFocus={false}
                showErrorMessage={true}
                autoCapitalize="none"
                errors={errors}
                setErrors={setErrors}
              />
            </View>
          </View>
        ) : (
          <View style={{ marginTop: 45, display: "flex" }}>
            <Text style={[styles.textSmall, { textAlign: "center" }]}>
              Reauthenticate to change email
            </Text>

            <View style={{ height: 20 }}>
              {hasError(errors, "invalidUser") && (
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
                if (hasError(errors, "invalidUser")) setErrors([]);
                setEmail(text);
              }}
              errors={errors}
              setErrors={setErrors}
              autoFocus
              autoCapitalize="none"
            />
            <CustomTextInput
              name="password"
              value={password}
              placeholder="Password"
              icon={<Ionicons name="lock-closed-outline" size={24} color={Colors.gray} />}
              onChange={(text) => {
                if (hasError(errors, "invalidUser")) setErrors([]);
                setPassword(text);
              }}
              password
              errors={errors}
              setErrors={setErrors}
            />
          </View>
        )}

        <CustomButton
          text={reauthenticated ? "Change" : "Reauthenticate"}
          buttonStyle={[styles.changeBtnContainer, { backgroundColor: Colors.primary }]}
          textStyle={[styles.changeBtnText, { color: "white" }]}
          onPress={handleButtonPress}
          disabled={!email || !password}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },

  textSmall: {
    fontSize: 18,
    color: Colors.black,
  },

  changeBtnContainer: {
    marginTop: 35,
    borderRadius: 25,
    height: 40,
  },

  changeBtnText: {
    fontSize: 18,
  },
});
