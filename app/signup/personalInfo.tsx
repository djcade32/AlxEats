import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomTextInput from "@/components/CustomTextInput";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import FavoriteCuisineBottomSheet from "@/components/FavoriteCuisineBottomSheet";
import { Criteria, Error } from "@/interfaces";
import { createError, hasError } from "@/common-utils";
import * as Haptics from "expo-haptics";
// import { useAuth, useSignUp } from "@clerk/clerk-expo";
import Font from "@/constants/Font";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "@/components/CustomHeader";
import CustomLoadingButton from "@/components/CustomLoadingButton";
import { User } from "@/classes/User";
import { getDb } from "@/firebase";
import { doc, setDoc } from "@firebase/firestore";
import { useUserStore } from "@/store/userStorage";

const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;

const personalInfo = () => {
  // const router = useRouter();
  // const navigation = useNavigation();
  // const { isLoaded, signUp, setActive } = useSignUp();
  // const { userId } = useAuth();
  // const { updateIsVerified } = useUserStore();
  // const paramObj = useLocalSearchParams() as any;
  // const [bottomSheetOpened, setBottomSheetOpened] = useState(false);
  // const [fullName, setFullName] = useState("");
  // const [email, setEmail] = useState((paramObj.email as string) || "");
  // const [password, setPassword] = useState("");
  // const [birthday, setBirthday] = useState("");
  // const [favoriteCuisine, setFavoriteCuisine] = useState("");
  // const [verificationCode, setVerificationCode] = useState("");
  // const [pendingVerification, setPendingVerification] = useState(false);
  // const [errorState, setErrorState] = useState<Error[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [resendCodeLoading, setResendCodeLoading] = useState(false);
  // useEffect(() => {
  //   if (errorState.length === 0) return;
  //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  // }, [errorState]);
  // useEffect(() => {
  //   if (pendingVerification) {
  //     navigation.setOptions({
  //       header: () => (
  //         <CustomHeader
  //           title="Verify Email"
  //           headerLeft={
  //             <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
  //           }
  //         />
  //       ),
  //     });
  //   }
  // }, [pendingVerification]);
  // useEffect(() => {
  //   // Add user to firebase database
  //   if (userId && email && fullName && birthday && favoriteCuisine && paramObj.criteria) {
  //     updateIsVerified(true);
  //     const userObj = new User(
  //       userId,
  //       email.toLowerCase(),
  //       fullName,
  //       birthday,
  //       favoriteCuisine,
  //       JSON.parse(paramObj.criteria as string) as Criteria[],
  //       new Date().toISOString()
  //     );
  //     console.log("criteria: ", JSON.parse(paramObj.criteria as string));
  //     addUserToFirebase(userObj);
  //   }
  // }, [userId]);
  // const handleContinuePressed = async () => {
  //   try {
  //     setLoading(true);
  //     if (!isLoaded || !signUp || loading) {
  //       return;
  //     }
  //     if (!validateForm()) return;
  //     await signUp.create({
  //       emailAddress: email,
  //       password,
  //     });
  //     // send the email.
  //     await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
  //     setPendingVerification(true);
  //   } catch (err: any) {
  //     console.error(JSON.stringify(err, null, 2));
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleDateChange = (text: string) => {
  //   // Remove any non-numeric characters from the input
  //   const formattedText = text.replace(/\D/g, "");
  //   // Format the input as mm/dd/yyyy
  //   if (formattedText.length <= 2) {
  //     // Format: mm
  //     setBirthday(formattedText);
  //   } else if (formattedText.length <= 4) {
  //     // Format: mm/dd
  //     setBirthday(`${formattedText.slice(0, 2)}/${formattedText.slice(2)}`);
  //   } else if (formattedText.length <= 8) {
  //     // Format: mm/dd/yyyy
  //     setBirthday(
  //       `${formattedText.slice(0, 2)}/${formattedText.slice(2, 4)}/${formattedText.slice(4)}`
  //     );
  //   }
  // };
  // const validateForm = () => {
  //   let errors: Error[] = [];
  //   const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;
  //   if (!fullName) {
  //     errors.push(createError("fullName", "Please enter your full name"));
  //   }
  //   if (!email) {
  //     console.log("email invalid");
  //     errors.push(createError("email", "Please enter your email address"));
  //   }
  //   if ((email && !email.includes("@")) || (email && !email.includes("."))) {
  //     errors.push(createError("email", "Please enter a valid email address"));
  //   }
  //   if (!password) {
  //     errors.push(createError("password", "Please enter a password"));
  //   }
  //   if (password && password.length < 8) {
  //     errors.push(createError("password", "Password must be at least 8 characters long"));
  //   }
  //   if (password && !passwordRegex.test(password)) {
  //     errors.push(
  //       createError("password", "Must contain at least one number and one special character")
  //     );
  //   }
  //   if (!birthday || birthday.length !== 10) {
  //     errors.push(createError("birthday", "Please enter a valid birthday"));
  //   }
  //   if (!favoriteCuisine) {
  //     errors.push(createError("favoriteCuisine", "Please select your favorite cuisine"));
  //   }
  //   setErrorState(errors);
  //   return errors.length === 0;
  // };
  // const handleVerifyPressed = async () => {
  //   try {
  //     setLoading(true);
  //     if (!isLoaded || !signUp || loading) {
  //       return;
  //     }
  //     const completeSignUp = await signUp.attemptEmailAddressVerification({
  //       code: verificationCode.trim(),
  //     });
  //     if (completeSignUp.status !== "complete") {
  //       /*  investigate the response, to see if there was an error
  //        or if the user needs to complete more steps.*/
  //       console.log(JSON.stringify(completeSignUp, null, 2));
  //     }
  //     if (completeSignUp.status === "complete") {
  //       // const user = new User(completeSignUp.i)
  //       await setActive({ session: completeSignUp.createdSessionId });
  //       router.replace("/(authenticated)/(tabs)/home");
  //     }
  //   } catch (err: any) {
  //     // console.error(JSON.stringify(err, null, 2));
  //     console.log("err: ", err);
  //     err.errors[0].code === "form_code_incorrect"
  //       ? Alert.alert("Error", "Incorrect verification code. Please try again.")
  //       : Alert.alert("Error", "An error occurred while verifying your email.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleCodeResend = async () => {
  //   try {
  //     setResendCodeLoading(true);
  //     if (!isLoaded || !signUp || loading) {
  //       return;
  //     }
  //     await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
  //     Alert.alert("Code resent", "We have resent the verification code to your email.");
  //   } catch (err: any) {
  //     console.error(JSON.stringify(err, null, 2));
  //     Alert.alert("Error", "An error occurred while resending the verification code.");
  //   } finally {
  //     setResendCodeLoading(false);
  //   }
  // };
  // const addUserToFirebase = async (user: User) => {
  //   try {
  //     // Add user to firebase database
  //     const db = getDb();
  //     if (!db) return console.log("Error: Database not found");
  //     await setDoc(doc(db, "users", user.id), {
  //       ...user,
  //     });
  //     console.log("User added to firebase database: ", user);
  //   } catch (err: any) {
  //     console.error(err);
  //   }
  // };
  // return (
  //   <KeyboardAvoidingView
  //     behavior={Platform.OS === "ios" ? "padding" : "height"}
  //     style={{ flex: 1, paddingHorizontal: 30 }}
  //     keyboardVerticalOffset={keyboardVerticalOffset}
  //   >
  //     <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
  //       {pendingVerification ? (
  //         <View style={{ flex: 1, paddingHorizontal: 30 }}>
  //           <Text style={styles.directions}>
  //             We have sent a verification code to your email. Please enter the code below.
  //           </Text>
  //           <CustomTextInput
  //             name="verificationInput"
  //             placeholder="Enter code"
  //             value={verificationCode}
  //             onChange={setVerificationCode}
  //             keyboardType="numeric"
  //             customStyles={{ marginTop: 35, width: 250, alignSelf: "center" }}
  //           />
  //           <CustomLoadingButton
  //             text="Verify"
  //             loading={loading}
  //             buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
  //             textStyle={[styles.btnText, { color: "white" }]}
  //             onPress={handleVerifyPressed}
  //             disabled={!verificationCode}
  //           />
  //           <CustomLoadingButton
  //             text="Resend code"
  //             loading={resendCodeLoading}
  //             buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
  //             textStyle={[styles.btnText, { color: "white" }]}
  //             onPress={handleCodeResend}
  //           />
  //         </View>
  //       ) : (
  //         <>
  //           <View
  //             style={{
  //               flex: 1,
  //               paddingBottom: 100,
  //             }}
  //           >
  //             <Text style={styles.directions}>
  //               Let's get to know each other! Share a bit about yourself.
  //             </Text>
  //             <ScrollView contentInset={{ bottom: 10 }} showsVerticalScrollIndicator={false}>
  //               <View style={{ height: "65%", gap: 5 }}>
  //                 <View>
  //                   <Text style={styles.textInputLabel}>Full name</Text>
  //                   <CustomTextInput
  //                     name="fullName"
  //                     placeholder="Full name"
  //                     icon={<Ionicons name="person-circle-outline" size={24} color={Colors.gray} />}
  //                     value={fullName}
  //                     onChange={setFullName}
  //                     errors={errorState}
  //                     setErrors={setErrorState}
  //                   />
  //                 </View>
  //                 <View>
  //                   <Text style={styles.textInputLabel}>Email</Text>
  //                   <CustomTextInput
  //                     name="email"
  //                     placeholder="Email"
  //                     icon={<Ionicons name="mail-outline" size={24} color={Colors.gray} />}
  //                     // @ts-ignore
  //                     value={email}
  //                     onChange={setEmail}
  //                     errors={errorState}
  //                     setErrors={setErrorState}
  //                     disabled={!!paramObj.email}
  //                   />
  //                 </View>
  //                 <View>
  //                   <Text style={styles.textInputLabel}>Password</Text>
  //                   <CustomTextInput
  //                     name="password"
  //                     value={password}
  //                     placeholder="Password"
  //                     icon={<Ionicons name="lock-closed-outline" size={24} color={Colors.gray} />}
  //                     onChange={setPassword}
  //                     password
  //                     errors={errorState}
  //                     setErrors={setErrorState}
  //                   />
  //                 </View>
  //                 <View>
  //                   <Text style={styles.textInputLabel}>Birthday</Text>
  //                   <CustomTextInput
  //                     name="birthday"
  //                     placeholder="mm/dd/yyyy"
  //                     icon={
  //                       <MaterialCommunityIcons
  //                         name="cake-variant-outline"
  //                         size={24}
  //                         color={Colors.gray}
  //                       />
  //                     }
  //                     value={birthday}
  //                     onChange={handleDateChange}
  //                     keyboardType="numeric" // Allow only numeric input
  //                     maxLength={10} // Limit the input length to 10 characters
  //                     errors={errorState}
  //                     setErrors={setErrorState}
  //                   />
  //                 </View>
  //                 <TouchableWithoutFeedback onPress={() => setBottomSheetOpened(true)}>
  //                   <View>
  //                     <Text style={styles.textInputLabel}>Favorite cuisine</Text>
  //                     <View
  //                       style={[
  //                         styles.favCuisineBtn,
  //                         {
  //                           borderColor:
  //                             hasError(errorState, "favoriteCuisine") && !favoriteCuisine
  //                               ? Colors.error
  //                               : Colors.gray,
  //                         },
  //                       ]}
  //                     >
  //                       <Ionicons name="fast-food-outline" size={24} color={Colors.gray} />
  //                       <Text
  //                         style={{
  //                           fontSize: 18,
  //                           color: favoriteCuisine ? Colors.black : Colors.gray,
  //                         }}
  //                       >
  //                         {favoriteCuisine ? favoriteCuisine : "Favorite cuisine"}
  //                       </Text>
  //                     </View>
  //                     {!favoriteCuisine && (
  //                       <Text style={{ fontSize: 12, color: Colors.error, marginTop: 5 }}>
  //                         {errorState.find((e) => e.field === "favoriteCuisine")?.message}
  //                       </Text>
  //                     )}
  //                   </View>
  //                 </TouchableWithoutFeedback>
  //               </View>
  //             </ScrollView>
  //             <CustomLoadingButton
  //               text="Create account"
  //               buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
  //               textStyle={[styles.btnText, { color: "white" }]}
  //               onPress={handleContinuePressed}
  //               loading={loading}
  //               disabled={!email || !password || !fullName || !birthday || !favoriteCuisine}
  //             />
  //           </View>
  //           <FavoriteCuisineBottomSheet
  //             bottomSheetOpened={bottomSheetOpened}
  //             setBottomSheetOpened={setBottomSheetOpened}
  //             selectedCuisine={favoriteCuisine}
  //             setSelectedCuisine={setFavoriteCuisine}
  //           />
  //         </>
  //       )}
  //     </TouchableWithoutFeedback>
  //   </KeyboardAvoidingView>
  // );
};

const styles = StyleSheet.create({
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
  },
});

export default personalInfo;
