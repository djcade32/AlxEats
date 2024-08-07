import { createError } from "@/common-utils";
import { Error } from "@/interfaces";

import CustomButton from "@/components/CustomButton";
import CustomTextInput from "@/components/CustomTextInput";
import FavoriteCuisineBottomSheet from "@/components/FavoriteCuisineBottomSheet";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { useAppStore } from "@/store/app-storage";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { changeProfileInfo, changeProfilePicture, checkIfUsernameExists } from "@/firebase";
import CustomLoadingButton from "@/components/CustomLoadingButton";

const EditProfile = () => {
  const { userDbInfo } = useAppStore();

  const [isEditMode, isSetEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bottomSheetOpened, setBottomSheetOpened] = useState(false);

  const [image, setImage] = useState<string | null>(userDbInfo?.profilePic || null);
  const [firstName, setFirstName] = useState(userDbInfo?.firstName || "");
  const [lastName, setLastName] = useState(userDbInfo?.lastName || "");
  const [username, setUsername] = useState(`${userDbInfo?.username || ""}`);
  const [favoriteCuisine, setFavoriteCuisine] = useState<string | null>(
    userDbInfo?.favoriteCuisine || ""
  );

  const [errorState, setErrorState] = useState<Error[]>([]);

  const handleFavoriteCuisinePress = () => {
    isEditMode && setBottomSheetOpened(true);
  };

  const handleSavePressed = () => {
    if (!isEditMode) {
      isSetEditMode(true);
      return;
    }
    if (!detectChanges()) {
      isSetEditMode(false);
      return;
    }

    if (isSaving) return;
    setIsSaving(true);
    if (!isFormValid() && isEditMode) return;

    checkIfUsernameExists(username)
      .then((exists) => {
        if (exists && userDbInfo?.username !== username) {
          setErrorState((prev) => [
            ...prev,
            createError("username", "Username already exists. Please choose another one."),
          ]);
          setIsSaving(false);
          isSetEditMode(false);
          return;
        }
        // Save changes
        console.log("Save changes");
        changeProfileInfo(userDbInfo?.id!, {
          firstName,
          lastName,
          username,
          favoriteCuisine,
        })
          .then(() => {
            isSetEditMode(false);
          })
          .catch((error) => {
            console.log("Error saving profile info: ", error);
            isSetEditMode(false);
          })
          .finally(() => {
            setIsSaving(false);
          });
      })
      .catch((error) => {
        console.log("Error checking if username exists: ", error);
        isSetEditMode(false);
      });
  };

  const detectChanges = (): boolean => {
    if (
      firstName !== userDbInfo?.firstName ||
      lastName !== userDbInfo?.lastName ||
      username !== userDbInfo?.username ||
      favoriteCuisine !== userDbInfo?.favoriteCuisine
    ) {
      return true;
    }
    return false;
  };

  const isFormValid = () => {
    if (firstName.trim() === "") {
      setErrorState((prev) => [...prev, createError("firstName", "Please enter your first name.")]);
    }
    if (lastName.trim() === "") {
      setErrorState((prev) => [...prev, createError("lastName", "Please enter your last name.")]);
    }
    if (username.trim() === "") {
      setErrorState((prev) => [...prev, createError("username", "Please enter your username.")]);
    }
    if (errorState.length > 0) {
      return false;
    }
    return true;
  };

  const handleAddProfilePicturePressed = async () => {
    if (!userDbInfo?.id) return;
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
      try {
        await changeProfilePicture(userDbInfo?.id, result.assets[0].uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeImage = async () => {
    if (!userDbInfo?.id) return;
    setImage(null);
    try {
      await changeProfilePicture(userDbInfo?.id, null);
    } catch (error) {
      console.log(error);
    }
  };

  const showChangeProfilePicAlert = async () => {
    Alert.alert("Change Profile Photo", "", [
      {
        text: "Upload photo",
        onPress: () => handleAddProfilePicturePressed(),
        style: "default",
      },
      {
        text: "Remove photo",
        style: "destructive",
        onPress: () => removeImage(),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <View style={[styles.profileImageContainer, { justifyContent: "center" }]}>
          {image && <Image source={{ uri: image }} style={styles.profileImage} />}
          {!image && (
            <Text style={styles.imagePlaceholderText}>
              {userDbInfo?.firstName.charAt(0).toUpperCase()! +
                userDbInfo?.lastName.charAt(0).toUpperCase()}
            </Text>
          )}
          <TouchableOpacity
            onPress={showChangeProfilePicAlert}
            activeOpacity={1}
            style={styles.editProfilePicButton}
          >
            <Ionicons name="camera" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputFormContainer}>
          <View>
            <Text style={[styles.textSmall, { marginBottom: 5 }]}>First name</Text>
            <View>
              <CustomTextInput
                name="firstName"
                placeholder="First name"
                value={firstName}
                onChange={setFirstName}
                autoFocus
                showErrorMessage={true}
                disabled={!isEditMode}
                errors={errorState}
                setErrors={setErrorState}
              />
            </View>
          </View>
          <View>
            <Text style={[styles.textSmall, { marginBottom: 5 }]}>Last name</Text>
            <View>
              <CustomTextInput
                name="lastName"
                placeholder="Last name"
                value={lastName}
                onChange={setLastName}
                autoFocus
                showErrorMessage={true}
                disabled={!isEditMode}
                errors={errorState}
                setErrors={setErrorState}
              />
            </View>
          </View>
          <View>
            <Text style={[styles.textSmall, { marginBottom: 5 }]}>Username</Text>
            <View>
              <CustomTextInput
                icon={<Text style={{ fontSize: Font.small }}>@</Text>}
                name="username"
                placeholder="Username"
                value={username}
                onChange={setUsername}
                autoFocus
                showErrorMessage={true}
                disabled={!isEditMode}
                errors={errorState}
                setErrors={setErrorState}
              />
            </View>
          </View>
          <TouchableWithoutFeedback onPress={handleFavoriteCuisinePress}>
            <Text style={[styles.textSmall, { marginBottom: 5 }]}>Favorite Cuisine</Text>

            <View>
              <View style={styles.favCuisineBtn}>
                <Text
                  style={{
                    fontSize: 18,
                    color: favoriteCuisine && isEditMode ? Colors.black : Colors.gray,
                  }}
                >
                  {favoriteCuisine ? favoriteCuisine : "Favorite cuisine"}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ flex: 1 }} />
          <CustomLoadingButton
            text={isEditMode ? "Save" : "Edit"}
            buttonStyle={[styles.editBtnContainer, { backgroundColor: Colors.primary }]}
            textStyle={[styles.editBtnText, { color: "white" }]}
            onPress={handleSavePressed}
            disabled={!favoriteCuisine}
            loading={isSaving}
          />
        </View>
      </View>
      <FavoriteCuisineBottomSheet
        bottomSheetOpened={bottomSheetOpened}
        setBottomSheetOpened={setBottomSheetOpened}
        selectedCuisine={favoriteCuisine || ""}
        setSelectedCuisine={setFavoriteCuisine}
      />
    </SafeAreaView>
  );
};

export default EditProfile;

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

  searchInput: {
    backgroundColor: "white",
    flex: 1,
  },

  profileImageContainer: {
    alignSelf: "center",
    marginTop: 20,
    position: "relative",
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    backgroundColor: Colors.lightGray,
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
  },

  editProfilePicButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.lightGray,
    borderRadius: 50,
    padding: 5,
    elevation: 5,
    borderColor: "white",
    borderWidth: 2,
  },

  inputFormContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    flex: 1,
  },

  favCuisineBtn: {
    borderWidth: 1,
    borderRadius: 15,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
    borderColor: Colors.gray,
  },

  editBtnContainer: {
    marginTop: 35,
    borderRadius: 25,
    height: 40,
    marginBottom: 20,
  },
  editBtnText: {
    fontSize: 18,
  },

  imagePlaceholderText: {
    color: Colors.black,
    fontSize: Font.extraLarge,
    textAlign: "center",
    fontFamily: "nm-b",
  },
});
