import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";
import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const profilePic = () => {
  const router = useRouter();
  const paramObj = useLocalSearchParams() as any;

  const [image, setImage] = useState<string | null>(null);

  const handleContinuePressed = async () => {
    router.push({
      pathname: "/(authenticated)/(onboarding)/favoriteCuisine",
      params: { ...paramObj, profilePic: image },
    });
  };

  // Add profile picture
  const handleAddProfilePicturePressed = async () => {
    console.log("Add profile picture pressed");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      console.log("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        {image ? (
          <Image source={{ uri: image }} style={{ height: 200, width: 200, borderRadius: 100 }} />
        ) : (
          <Text style={styles.initials}>NC</Text>
        )}
        <TouchableWithoutFeedback onPress={handleAddProfilePicturePressed}>
          <View style={styles.addIconContainer}>
            <Ionicons name="add" color="white" size={24} style={styles.addIcon} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Text style={styles.directions}>
        Let's spice up your profile! 📸 Upload a picture and let the fun begin!
      </Text>
      <View style={styles.spacer} />

      <CustomButton
        text="Continue"
        buttonStyle={[styles.continueBtnContainer, { backgroundColor: Colors.primary }]}
        textStyle={[styles.continueBtnText, { color: "white" }]}
        onPress={handleContinuePressed}
      />
    </View>
  );
};

export default profilePic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 30,
    paddingBottom: 100,
  },

  directions: {
    fontSize: Font.small,
    marginVertical: 20,
    textAlign: "center",
    color: Colors.black,
    alignSelf: "center",
    lineHeight: 25,
  },

  profilePictureContainer: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: Colors.lightGray,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    position: "relative",
  },

  initials: {
    fontSize: 50,
    color: "white",
    fontWeight: "bold",
  },

  addIconContainer: {
    borderRadius: 50,
    overflow: "hidden",
    position: "absolute",
    bottom: 10,
    right: 20,
    borderWidth: 2,
    borderColor: "white",
  },

  addIcon: {
    backgroundColor: Colors.primary,
    padding: 5,
  },

  continueBtnContainer: {
    marginTop: 35,
    borderRadius: 25,
    height: 40,
  },
  continueBtnText: {
    fontSize: 18,
  },

  spacer: {
    flex: 1,
  },
});
