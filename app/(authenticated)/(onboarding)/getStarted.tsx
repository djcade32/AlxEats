import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Criteria, User } from "@/interfaces";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { app, addUserToFirebase } from "@/firebase";
import CustomLoadingButton from "@/components/CustomLoadingButton";
import { getAuth } from "firebase/auth";
import { uploadImageAsync } from "@/common-utils";

const getStarted = () => {
  const paramObj = useLocalSearchParams() as any as User;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  console.log(paramObj);

  const handleGetStartedPressed = async () => {
    console.log("Get started pressed");
    setIsLoading(true);
    const user: User = paramObj;
    // Save the user to the database
    if (!user) {
      console.log("ERROR: There was a problem getting the user object.");
      return;
    }
    try {
      if (user.profilePic) {
        await prepPhotoUrl(user.profilePic);
      }
      user.id = getAuth().currentUser?.uid!;
      user.email = getAuth().currentUser?.email!;
      user.createdAt = new Date().toISOString();
      user.criteria = paramObj.criteria;
      console.log("User: ", user);
      addUserToFirebase(user);
      router.replace("/(authenticated)/home");
    } catch (error) {
      console.log("ERROR: There was a problem saving the user to the database: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const prepPhotoUrl = async (profilePic: string): Promise<void> => {
    try {
      const url = await uploadImageAsync(profilePic, `user-profile-pics/${uuidv4()}`);
      paramObj.profilePic = url;
      return Promise.resolve();
    } catch (error) {
      console.log("ERROR: There was a problem uploading the photo: ", error);
      return Promise.reject();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Congratulations, you're all set! 🎉 Let's jump in and start discovering and ranking your
        favorite restaurants. Your culinary adventure awaits!
      </Text>

      <CustomLoadingButton
        text="Get started"
        buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
        textStyle={[styles.btnText, { color: "white" }]}
        onPress={handleGetStartedPressed}
        loading={isLoading}
      />
    </View>
  );
};

export default getStarted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 30,
    justifyContent: "space-around",
  },

  text: {
    color: Colors.black,
    fontSize: Font.medium,
    textAlign: "center",
    lineHeight: 35,
  },

  btnContainer: {
    marginTop: 35,
    borderRadius: 25,
    height: 40,
  },
  btnText: {
    fontSize: 18,
  },
});
