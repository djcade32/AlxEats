import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  SectionList,
  Linking,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import RestaurantDetailsHeader from "@/components/RestaurantDetailsHeader";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { mapStyle } from "@/customMapStyle";
import Font from "@/constants/Font";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import PictureViewModal from "@/components/PictureViewModal";
import { useQuery } from "react-query";
import ListingsMemberItem from "@/components/ListingsMemberItem";
import { RestaurantItem, RestaurantRankingPayload, User } from "@/interfaces";
import { restaurantPriceLevels } from "@/mappings";
import Cuisines from "@/data/Cuisines";
import { capitalizeFirstLetter, distanceBetweenCoordinates, uploadImages } from "@/common-utils";
import openMap from "react-native-open-maps";
import * as ExpoLinking from "expo-linking";
import { Share } from "react-native";
import {
  checkIfRestaurantInList,
  getUserById,
  restaurantAdded,
  restaurantRemoved,
  updateRestaurantPhotos,
} from "@/firebase";
import { useAppStore } from "@/store/app-storage";
import { useRestaurantRankingStore } from "@/store/restaurantRanking-storage";
import * as ImagePicker from "expo-image-picker";
import Dropdown from "@/components/Dropdown";
import useRestaurantEffect from "@/hooks/useRestaurantEffect";

const restaurantDetails = () => {
  let restaurantObj = useLocalSearchParams<any>().restaurant as any;
  let restaurantId = useLocalSearchParams<any>().id as any;
  const { userDbInfo, checkIfUserToTryRestaurant, userPosts, userFollowing } = useAppStore();
  const { updateComment, comment } = useRestaurantRankingStore();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<RestaurantItem | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [yourPhotos, setYourPhotos] = useState<string[]>([]);
  const [ranking, setRanking] = useState<number | null>();
  const [isTried, setIsTried] = useState<boolean | undefined>();
  const [isToTry, setIsToTry] = useState<boolean | undefined>();
  const [friendsTried, setFriendsTried] = useState<{ title: string; data: any[] }[]>([
    {
      title: "Peer Reviews",
      data: [],
    },
  ]);
  const [friendsTotalScore, setFriendsTotalScore] = useState<number>(0);

  useRestaurantEffect({
    userDbInfo,
    restaurantId,
    restaurantObj,
    setRestaurant,
    setYourPhotos,
    updateComment,
    setRanking,
    setIsTried,
    setIsToTry,
    checkIfUserToTryRestaurant,
    userPosts: userPosts,
  });

  useEffect(() => {
    if (!restaurant) return;

    const checkFriendsTried = async () => {
      const friendsTriedPromises = userFollowing.map(async (userId) => {
        const res: RestaurantRankingPayload = await checkIfRestaurantInList(
          userId,
          restaurant.placeId,
          "TRIED"
        );
        if (res) {
          const user = await getUserById(userId);
          if (user) {
            return { user, ranking: res.ranking };
          }
        }
        return null;
      });

      const friendsTriedResults = await Promise.all(friendsTriedPromises);
      const filteredFriendsTried = friendsTriedResults.filter((result) => result !== null);

      setFriendsTried([{ title: "Peer Reviews", data: filteredFriendsTried }]);
      let totalScore = 0;
      filteredFriendsTried.forEach((friend) => {
        totalScore += friend!.ranking;
      });
      setFriendsTotalScore(totalScore);
      // Uncomment this line to show screen only after all data is loaded
      // setLoading(false);
    };

    checkFriendsTried();
  }, [restaurant, userFollowing, setFriendsTried]);

  // This useEffect allows the screen to render faster by showing the screen
  // before all friend's tried data is loaded
  useEffect(() => {
    if (isToTry !== undefined && isTried !== undefined) setLoading(false);
  }, [isToTry, isTried]);

  const HeaderComponent = useMemo(
    () => (
      <View style={{ backgroundColor: "white" }}>
        {
          //#region Scores
        }
        {/* Scores */}
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.sectionHeaderText}>Scores</Text>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center", paddingVertical: 10 }}
            >
              <View style={styles.rankingCircle}>
                <Text
                  style={[styles.rankingText, { color: ranking ? Colors.secondary : Colors.black }]}
                >
                  {ranking ? ranking : "-"}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: Font.small, color: Colors.black }}>Your</Text>
                <Text style={{ fontSize: Font.small, color: Colors.black }}>Score</Text>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center", paddingVertical: 10 }}
            >
              <View style={styles.rankingCircle}>
                <Text
                  style={[
                    styles.rankingText,
                    { color: friendsTried[0].data.length > 0 ? Colors.secondary : Colors.black },
                  ]}
                >
                  {friendsTried[0].data.length > 0
                    ? friendsTotalScore / friendsTried[0].data.length
                    : "-"}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: Font.small, color: Colors.black }}>Friend's</Text>
                <Text style={{ fontSize: Font.small, color: Colors.black }}>Score</Text>
              </View>
            </View>
          </View>
        </View>
        {
          //#region Your Photos
        }
        {/* Your Photos */}
        <View style={{ paddingLeft: 10 }}>
          <Text style={styles.sectionHeaderText}>Your photos</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={() => handleAddPhotosPressed()}
            >
              <Ionicons name="add" size={25} color={Colors.black} />
              <Text style={styles.addPhotoButtonText}>Add</Text>
            </TouchableOpacity>
            <FlatList
              showsHorizontalScrollIndicator={false}
              scrollEnabled={yourPhotos.length > 4}
              contentContainerStyle={{ gap: 10, paddingRight: 10 }}
              horizontal
              data={yourPhotos}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback key={item} onPress={() => handlePhotoPressed(item)}>
                  <Image source={{ uri: item }} style={styles.photoContainer} />
                </TouchableWithoutFeedback>
              )}
            />
          </View>
        </View>
        {
          //#region Comments
        }
        {/* Comments */}
        <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
          <Text style={styles.sectionHeaderText}>Comments</Text>

          <TouchableWithoutFeedback onPress={() => handleCommentPress()}>
            <Text
              style={[styles.commentText, { color: comment ? Colors.black : Colors.gray }]}
              numberOfLines={8}
            >
              {comment || "Comments about the restaurant..."}
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    ),
    [yourPhotos, comment, ranking, friendsTotalScore]
  );

  const handleCommentPress = () => {
    router.push({
      pathname: "/(authenticated)/(modals)/editComment",
      params: { restaurantId: restaurant?.placeId },
    });
  };

  const handleGetDirectionsPressed = () => {
    if (!restaurant) return;
    openMap({
      latitude: restaurant?.coordinate.latitude,
      longitude: restaurant?.coordinate.longitude,
      query: restaurant?.address,
    });
  };

  const handleWebsitePressed = () => {
    if (!restaurant) return;
    Linking.openURL(restaurant?.website);
  };

  //TODO: Fix call button. May have to rebuild the app to test
  const handleCallPress = () => {
    if (!restaurant) return;
    const url = `tel:${restaurant?.phoneNumber}`;
    // const url = "tel: 5719706438";
    ExpoLinking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          ExpoLinking.openURL(url);
        } else {
          Alert.alert("Error", "Phone call not supported on this device");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const getRestaurantPriceLevel = (): string | undefined => {
    if (!restaurant?.price) return;
    return restaurantPriceLevels[restaurant.price];
  };

  const getRestaurantCuisine = (): string | undefined => {
    if (!restaurant?.types) return;
    for (let cuisine of Cuisines) {
      if (restaurant.types.includes(`${cuisine}_restaurant`)) {
        return capitalizeFirstLetter(cuisine);
      }
    }
    return;
  };

  const createRestaurantInfoString = () => {
    let infoString = "";
    let priceLevel = getRestaurantPriceLevel();
    let cuisine = getRestaurantCuisine();
    let distance = restaurant?.distance;
    if (priceLevel) {
      infoString += `${priceLevel} • `;
    }
    if (cuisine) {
      infoString += `${cuisine} • `;
    }
    if (distance) {
      infoString += `${distance.toFixed(1)} mi`;
    }

    return infoString;
  };

  const handlePhotoPressed = (photoUrl: string) => {
    setIsModalVisible(true);
    setSelectedPhoto(photoUrl);
  };

  const handleBackPressed = () => {
    router.back();
    updateComment("");
  };

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
      if (result.assets.length + yourPhotos.length > 6) {
        console.log("You can only select up to 6 images");
        Alert.alert("You can only select up to 6 images");
        return;
      }
      for (const asset of result.assets) {
        images.push(asset.uri);
      }
      const newPhotos = await uploadImages(
        images,
        `restaurant-pics/${restaurant!.placeId}/${userDbInfo?.id}`
      );
      const updatedPhotos = [...newPhotos, ...yourPhotos];
      await updateRestaurantPhotos(userDbInfo!.id, restaurant!.placeId, updatedPhotos);
      setYourPhotos(updatedPhotos);
    }
  };

  const handleToTryPress = async () => {
    if (!userDbInfo || !restaurant) return;

    try {
      if (isToTry) {
        setIsToTry(false);
        await restaurantRemoved(userDbInfo.id, restaurant.placeId, "TO_TRY");
        return;
      }
      setIsToTry(true);
      await restaurantAdded(
        userDbInfo.id,
        userDbInfo?.firstName!,
        restaurant.name,
        restaurant.address,
        restaurant.placeId,
        "TO_TRY"
      );
    } catch (error) {
      console.log("Error adding or removing restaurant to to try list: ", error);
    }
  };

  const handleTriedPress = async () => {
    if (!restaurant) return;
    router.push({
      pathname: "/(authenticated)/(modals)/RankRestaurant/",
      params: { restaurant: JSON.stringify(restaurant), isToTry: `${isToTry}` },
    });
  };

  const shareContent = async (message, url) => {
    try {
      const result = await Share.share({
        message: message,
        // url: url,
        title: message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log("Shared with activity type: ", result.activityType);
        } else {
          // shared
          console.log("Content shared");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("Share dismissed");
      }
    } catch (error: any) {
      console.error("Error sharing content: ", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <RestaurantDetailsHeader
        headerLeft={
          <TouchableOpacity onPress={handleBackPressed}>
            <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
          </TouchableOpacity>
        }
        headerRight={
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() =>
                shareContent(
                  `Check out ${restaurant?.name || restaurantObj.name} on Alx Eats`,
                  "test"
                )
              }
            >
              <Ionicons name="share-outline" size={35} color={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Dropdown
                userId={userDbInfo!.id}
                restaurantItem={restaurant!}
                ranking={ranking!}
                handleGetDirectionsPressed={handleGetDirectionsPressed}
                handleWebsitePressed={handleWebsitePressed}
                handleCallPressed={handleCallPress}
              />
            </TouchableOpacity>
          </View>
        }
      />
      {loading || !restaurant ? (
        <></>
      ) : (
        <>
          {
            //#region Map View
          }
          {/* Map View */}
          <View style={{ height: "40%" }}>
            <MapView
              style={[StyleSheet.absoluteFill, { opacity: 0.55 }]}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: restaurant?.coordinate.latitude + 0.001 || 38.8462,
                longitude: restaurant?.coordinate.longitude || -77.3064,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              customMapStyle={mapStyle}
              scrollEnabled={false} // Disable scrolling
              zoomEnabled={false} // Disable zooming
              rotateEnabled={false} // Disable rotating
            >
              <Marker
                key={(Math.random() * 1000) / Math.random()}
                coordinate={{
                  latitude: restaurant?.coordinate.latitude || 38.8462,
                  longitude: restaurant?.coordinate.longitude || -77.3064,
                }}
              >
                <Image
                  source={require("@/assets/images/location-pin.png")}
                  style={{ width: 50, height: 50 }}
                />
              </Marker>
            </MapView>

            <View style={styles.mapDetailsText}>
              <Text style={styles.restaurantName}>{restaurant?.name}</Text>

              <View style={styles.checkmarkContainer}>
                {isTried ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={40}
                    color={Colors.primary}
                    style={{ opacity: 0.75 }}
                  />
                ) : (
                  <View style={{ flexDirection: "row", gap: 5 }}>
                    <TouchableOpacity onPress={handleTriedPress}>
                      <Ionicons name="add-circle-outline" size={40} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleToTryPress}>
                      <Ionicons
                        name={isToTry ? "bookmark" : "bookmark-outline"}
                        size={40}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
          {
            //#region Restaurant Details
          }
          {/* Restaurant Details */}
          <View style={styles.restaurantDetails}>
            <View style={{ gap: 5, flex: 1 }}>
              <Text style={{ fontSize: 18, color: Colors.black }}>
                {createRestaurantInfoString()}
              </Text>
              <Text style={styles.addressContainer}>{restaurant?.address}</Text>
            </View>
          </View>
          {
            //#region Action Buttons
          }
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleGetDirectionsPressed}>
              <Ionicons name="navigate-outline" size={18} color={Colors.black} />
              <Text style={styles.actionButtonText}>Directions</Text>
            </TouchableOpacity>

            <View style={styles.actionButtonSeparator} />

            <TouchableOpacity style={styles.actionButton} onPress={handleWebsitePressed}>
              <MaterialCommunityIcons name="web" size={18} color={Colors.black} />
              <Text style={styles.actionButtonText}>Website</Text>
            </TouchableOpacity>

            <View style={styles.actionButtonSeparator} />

            <TouchableOpacity style={styles.actionButton} onPress={handleCallPress}>
              <Ionicons name="call-outline" size={18} color={Colors.black} />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
          {
            //#region What did your friends think?
          }
          {friendsTried[0].data.length > 0 ? (
            <SectionList
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 20 }}
              sections={friendsTried}
              //@ts-ignore
              stickyHeaderIndices={[0]}
              keyExtractor={(item) => item.user.id}
              renderSectionHeader={(item) => (
                <View style={styles.sectionListHeaderContainer}>
                  <Text style={styles.sectionHeaderText}>What did your friends think?</Text>
                </View>
              )}
              ListHeaderComponent={HeaderComponent}
              renderItem={({ item }) => (
                <ListingsMemberItem
                  user={item.user}
                  ranking={item.ranking}
                  tabScreenName="(authenticated)/restaurantDetails"
                />
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <ScrollView
              style={{ marginTop: 20 }}
              contentContainerStyle={{ paddingBottom: 75 }}
              showsVerticalScrollIndicator={false}
            >
              {HeaderComponent}
              <View style={styles.sectionListHeaderContainer}>
                <Text style={styles.sectionHeaderText}>What did your friends think?</Text>
              </View>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  color: Colors.gray,
                  fontSize: Font.small,
                }}
              >
                No scores from friends yet
              </Text>
            </ScrollView>
          )}
        </>
      )}
      {/* Picture View Modal */}
      {isModalVisible && (
        <PictureViewModal
          isModalVisible={isModalVisible}
          toggleModal={() => setIsModalVisible(false)}
          photoUrl={selectedPhoto}
        />
      )}
    </View>
  );
};

export default restaurantDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  mapDetailsText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  restaurantName: {
    textAlign: "left",
    marginLeft: 10,
    marginBottom: 5,
    fontFamily: "nm-b",
    fontSize: Font.large,
    width: "70%",
  },

  checkmarkContainer: {
    alignItems: "flex-end",
    marginRight: 20,
    marginBottom: 5,
  },

  restaurantDetails: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  addressContainer: {
    fontSize: 18,
    color: Colors.gray,
    flexWrap: "wrap",
  },

  actionButtonsContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    height: 35,
    flexDirection: "row",
    backgroundColor: Colors.lightGray,
    borderRadius: 5,
    overflow: "hidden",
  },

  actionButton: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: "33.33%",
  },

  actionButtonSeparator: {
    width: 1,
    backgroundColor: Colors.gray,
    height: "60%",
  },

  actionButtonText: {
    textAlign: "center",
    color: Colors.black,
  },

  sectionListHeaderContainer: {
    paddingHorizontal: 10,
    backgroundColor: "white",
    paddingBottom: 5,
  },

  sectionHeaderText: {
    fontSize: Font.medium,
    fontWeight: "500",
    color: Colors.black,
  },

  addPhotoButton: {
    backgroundColor: Colors.lightGray,
    height: 74,
    width: 74,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  addPhotoButtonText: {
    textAlign: "center",
    color: Colors.black,
    fontWeight: "500",
  },

  photoContainer: {
    height: 74,
    width: 74,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: Colors.lightGray,
  },

  commentText: {
    fontSize: 14,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  rankingCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderColor: Colors.gray,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  rankingText: {
    fontSize: Font.small,
    color: Colors.secondary,
    fontWeight: "bold",
  },
});
