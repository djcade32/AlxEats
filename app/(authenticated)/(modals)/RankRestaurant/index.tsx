import { Alert, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useEffect, useState } from "react";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";
import { useAppStore } from "@/store/app-storage";
import RatingComponent from "@/components/RatingComponent";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { RestaurantItem, RestaurantRankingPayload } from "@/interfaces";
import * as ImagePicker from "expo-image-picker";
import { useRestaurantRankingStore } from "@/store/restaurantRanking-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomLoadingButton from "@/components/CustomLoadingButton";
import { RestaurantCriteriaEnums } from "@/enums";
import { RestaurantCriteriaTypes } from "@/types";
import { uploadImages } from "@/common-utils";
import { restaurantAdded, restaurantRemoved } from "@/firebase";

const initialOptionsState: Record<RestaurantCriteriaTypes, number> = {
  [RestaurantCriteriaEnums.TASTE]: -1,
  [RestaurantCriteriaEnums.SERVICE]: -1,
  [RestaurantCriteriaEnums.ATMOSPHERE]: -1,
  [RestaurantCriteriaEnums.PRICE]: -1,
  [RestaurantCriteriaEnums.OVERALL_EXPERIENCE]: -1,
};

const rankRestaurant = () => {
  const restaurantObj = JSON.parse(useLocalSearchParams().restaurant as any) as RestaurantItem;
  const isToTry = JSON.parse(useLocalSearchParams().isToTry as any) as Boolean;

  const router = useRouter();
  const { userDbInfo } = useAppStore();
  const { comment, updateComment, photos, addPhoto, emptyPhotos, updatePhotos } =
    useRestaurantRankingStore();
  const [selectedOptions, setSelectedOptions] =
    useState<Record<RestaurantCriteriaTypes, number>>(initialOptionsState);
  const [userWeightedCriteria, setUserWeightedCriteria] =
    useState<Record<RestaurantCriteriaTypes, number>>(initialOptionsState);
  const [loading, setLoading] = useState(false);
  const [savingRanking, setSavingRanking] = useState(false);

  useEffect(() => {
    emptyPhotos();
    userDbInfo?.criteria.forEach(({ criteria }, index) => {
      if (!userWeightedCriteria[criteria]) return;
      setUserWeightedCriteria((prev) => ({
        ...prev,
        [criteria]: Math.abs(index - userDbInfo.criteria.length),
      }));
    });
    setLoading(false);
  }, []);

  const handleAddPhotosPressed = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      console.log("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.5,
      allowsMultipleSelection: true,
      selectionLimit: 6,
    });

    if (!result.canceled) {
      let images = [];
      if (result.assets.length > 6) {
        console.log("You can only select up to 6 images");
        Alert.alert("You can only select up to 6 images");
        return;
      }
      for (const asset of result.assets) {
        images.push(asset.uri);
      }
      addPhoto(images);
    }
  };

  const handleCommentPress = () => {
    router.push("/(authenticated)/(modals)/editComment");
  };

  const showAddMorePhotosAlert = async () => {
    Alert.alert(
      "Edit or add more photos",
      "Would you like to edit the photos you've selected or add more photos?",
      [
        {
          text: "Edit",
          onPress: () => {
            router.push("/(authenticated)/(modals)/RankRestaurant/selectedPhotos");
          },
        },
        {
          text: "Add more",
          onPress: async () => {
            await addMorePhotos();
          },
        },
      ]
    );
  };

  const addMorePhotos = async () => {
    if (!photos) return;
    if (photos.length >= 6) {
      console.log("You can only select up to 6 images: ", photos);
      Alert.alert("You can only select up to 6 images");
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      console.log("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.75,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      if (result.assets.length + photos.length > 6) {
        console.log("You can only select up to 6 images");
        Alert.alert("You can only select up to 6 images");
        return;
      }
      let newImages = photos;

      for (const asset of result.assets) {
        newImages.push(asset.uri);
      }

      updatePhotos(newImages);
    }
    return;
  };

  const goBack = () => {
    updateComment("");
    emptyPhotos();
    router.back();
  };

  const allSelectionsPicked = () => {
    //Check if every key in the object has a value other than -1
    return Object.keys(selectedOptions).every(
      (key) => selectedOptions[key as RestaurantCriteriaTypes] !== -1
    );
  };

  const handleRankRestaurantPressed = async () => {
    setSavingRanking(true);
    try {
      const ranking = await rankingRestaurant();
      const restaurantRankingObj: RestaurantRankingPayload = {
        id: restaurantObj.placeId,
        ranking,
        criteriaReference: userWeightedCriteria,
        comment,
        photos: photos.length > 0 ? await prepareImages() : [],
      };
      if (isToTry) {
        await restaurantRemoved(userDbInfo?.id!, restaurantObj.placeId, "TO_TRY");
      }
      await restaurantAdded(userDbInfo?.id!, restaurantObj.placeId, "TRIED", restaurantRankingObj);
    } catch (error) {
      console.log("Error saving rank: ", error);
      Alert.alert("Error saving rank. Please try again.");
    } finally {
      setSavingRanking(false);
      goBack();
    }
  };

  const prepareImages = async () => {
    return await uploadImages(photos, `restaurant-pics/${restaurantObj.placeId}/${userDbInfo?.id}`);
  };

  const rankingRestaurant = async () => {
    const ranking = Object.keys(selectedOptions).reduce((acc, key) => {
      const keyName = key as RestaurantCriteriaTypes;
      if (selectedOptions[keyName] === -1) return acc;
      return acc + selectedOptions[keyName] * userWeightedCriteria[keyName];
    }, 0);
    return Number.parseFloat(((ranking / 45) * 100).toFixed(1));
  };

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <Stack.Screen
            options={{
              headerLeft: () => (
                <TouchableOpacity onPress={goBack}>
                  <Ionicons name="close" size={35} color={Colors.darkGray} />
                </TouchableOpacity>
              ),
              title: "",
            }}
          ></Stack.Screen>
          <View style={styles.restaurantInfoText}>
            <Text style={{ fontSize: Font.small, color: Colors.black, marginBottom: 10 }}>
              Ranking
            </Text>
            {/* <Text style={styles.restaurantTitle}>Hank</Text> */}
            <Text style={styles.restaurantTitle}>{restaurantObj.name}</Text>
            {/* <Text style={styles.restaurantAddress}>address</Text> */}
            <Text style={styles.restaurantAddress}>{restaurantObj.address}</Text>
          </View>
          <ScrollView style={{ flex: 1, marginTop: 15 }} showsVerticalScrollIndicator={false}>
            <View
              style={{
                gap: 20,
                borderBottomWidth: 0.5,
                borderColor: Colors.gray,
                paddingBottom: 10,
              }}
            >
              {userDbInfo?.criteria.map(({ criteria }, index) => (
                <RatingComponent
                  criteria={criteria}
                  key={index}
                  selectedOption={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                />
              ))}
            </View>
            <TouchableWithoutFeedback
              onPress={photos?.length ? showAddMorePhotosAlert : handleAddPhotosPressed}
            >
              <View style={[styles.buttonContainer, { borderBottomWidth: 0.5 }]}>
                <View style={styles.buttonContainerLeftSide}>
                  <View style={{ width: 30 }}>
                    <Ionicons name="camera-outline" size={30} color={Colors.black} />
                  </View>
                  <View style={{ width: 90 }}>
                    <Text style={{ fontSize: Font.small, color: Colors.black }}>Add photos</Text>
                  </View>
                </View>
                {photos.length > 0 && (
                  <Text style={{ color: Colors.darkGray, flex: 1 }}>{`${photos?.length} ${
                    photos.length === 1 ? "photo" : "photos"
                  } selected`}</Text>
                )}
                <View style={{ width: 30 }}>
                  <Ionicons name={"chevron-forward"} size={30} color={Colors.black} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={handleCommentPress}>
              <View style={[styles.buttonContainer, { borderBottomWidth: 0.5 }]}>
                <View style={styles.buttonContainerLeftSide}>
                  <View style={{ width: 30 }}>
                    <EvilIcons name="comment" size={30} color={Colors.black} />
                  </View>
                  <View style={{ width: 90 }}>
                    <Text style={{ fontSize: Font.small, color: Colors.black }}>Comments</Text>
                  </View>
                </View>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={{ color: Colors.darkGray, flex: 1 }}
                >
                  {comment}
                </Text>
                <View style={{ width: 30 }}>
                  <Ionicons name={"chevron-forward"} size={30} color={Colors.black} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <CustomLoadingButton
              text="Rank Restaurant"
              buttonStyle={[
                styles.rankRestaurantButton,
                { backgroundColor: allSelectionsPicked() ? Colors.primary : Colors.gray },
              ]}
              textStyle={{ color: "white", fontSize: 18 }}
              onPress={handleRankRestaurantPressed}
              loading={savingRanking}
              disabled={!allSelectionsPicked()}
            />
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default rankRestaurant;

const styles = StyleSheet.create({
  restaurantInfoText: {
    width: "100%",
    alignItems: "center",
    color: Colors.black,
    paddingHorizontal: 30,
  },
  restaurantTitle: {
    fontSize: Font.medium,
    fontFamily: "nm-b",
    marginBottom: 5,
    textAlign: "center",
  },
  restaurantAddress: {
    color: Colors.gray,
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    borderColor: Colors.gray,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainerLeftSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rankRestaurantButton: {
    marginHorizontal: 30,
    borderRadius: 25,
    padding: 12,
    marginTop: 20,
    marginBottom: 10,
  },
});
