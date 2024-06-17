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
} from "react-native";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import RestaurantDetailsHeader from "@/components/RestaurantDetailsHeader";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { mapStyle } from "@/customMapStyle";
import Font from "@/constants/Font";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import PictureViewModal from "@/components/PictureViewModal";
import { postData as USER_DATA } from "@/assets/data/dummyData";
import ListingsMemberItem from "@/components/ListingsMemberItem";
import { RestaurantItem, RestaurantRankingPayload } from "@/interfaces";
import { restaurantPriceLevels } from "@/mappings";
import Cuisines from "@/data/Cuisines";
import { capitalizeFirstLetter, distanceBetweenCoordinates } from "@/common-utils";
import openMap from "react-native-open-maps";
import * as ExpoLinking from "expo-linking";
import * as Location from "expo-location";
import {
  checkIfRestaurantInList,
  restaurantAdded,
  restaurantRemoved,
  updateRestaurantPhotos,
} from "@/firebase";
import { useAppStore } from "@/store/app-storage";
import { useRestaurantRankingStore } from "@/store/restaurantRanking-storage";
import * as ImagePicker from "expo-image-picker";

const UserDummyData = [
  {
    title: "Peer Reviews",
    data: USER_DATA,
  },
];

const DummyText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const restaurantDetails = () => {
  let restaurantObj = useLocalSearchParams<any>().restaurant as any;
  let restaurantId = useLocalSearchParams<any>().id as any;
  const { userDbInfo, checkIfUserToTryRestaurant, userTriedRestaurants, userToTryRestaurants } =
    useAppStore();
  const { updateComment, comment } = useRestaurantRankingStore();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<RestaurantItem | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [yourPhotos, setYourPhotos] = useState<string[]>([]);
  const [ranking, setRanking] = useState<number | null>(null);
  const [isTried, setIsTried] = useState(false);
  const [isToTry, setIsToTry] = useState(false);

  useEffect(() => {
    if (!restaurantObj) {
      (async () => {
        let location = await Location.getCurrentPositionAsync({});

        const data = await fetchRestaurant(JSON.parse(restaurantId));
        const newRestaurant = {
          placeId: data.id,
          coordinate: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          },
          name: data.displayName.text,
          openNow: data.regularOpeningHours?.openNow,
          price: data.priceLevel,
          types: data.types,
          primaryType: data.primaryType,
          address: data.formattedAddress,
          phoneNumber: data.nationalPhoneNumber,
          website: data.websiteUri,
          addressComponents: JSON.stringify(data.addressComponents),
          distance: distanceBetweenCoordinates(location.coords, {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          }),
        };
        setRestaurant(newRestaurant);
        const resTried: RestaurantRankingPayload = await checkIfRestaurantInList(
          userDbInfo!.id,
          newRestaurant.placeId,
          "TRIED"
        );
        if (resTried) {
          setYourPhotos(resTried.photos || []);
          updateComment(resTried.comment || "");
          setRanking(resTried.ranking || 0);
          setIsTried(true);
        }
        if (!resTried) setIsToTry(checkIfUserToTryRestaurant(newRestaurant.placeId));
        setLoading(false);
      })();
    } else {
      (async () => {
        const restaurant = JSON.parse(restaurantObj);
        setRestaurant(restaurant);
        const resTried: RestaurantRankingPayload = await checkIfRestaurantInList(
          userDbInfo!.id,
          restaurant.placeId,
          "TRIED"
        );
        if (resTried) {
          setYourPhotos(resTried.photos || []);
          updateComment(resTried.comment || "");
          setRanking(resTried.ranking || 0);
          setIsTried(true);
        }
        if (!resTried) setIsToTry(checkIfUserToTryRestaurant(restaurant.placeId));
        setLoading(false);
      })();
    }
  }, [userToTryRestaurants, userTriedRestaurants]);

  const HeaderComponent = useMemo(
    () => (
      <View style={{ backgroundColor: "white" }}>
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
                <Text style={[styles.rankingText, { color: Colors.black }]}>-</Text>
              </View>
              <View>
                <Text style={{ fontSize: Font.small, color: Colors.black }}>Friend's</Text>
                <Text style={{ fontSize: Font.small, color: Colors.black }}>Score</Text>
              </View>
            </View>
          </View>
        </View>
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
    [yourPhotos, comment, ranking]
  );

  const fetchRestaurant = async (placeId: string) => {
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const apiKey = GOOGLE_PLACES_API_KEY;

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "displayName.text,types,nationalPhoneNumber,formattedAddress,addressComponents,location,websiteUri,regularOpeningHours.openNow,priceLevel,primaryType,id",
    };

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching restaurant: ", error);
    }
  };

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
    // const url = `tel:${restaurant?.phoneNumber}`;
    const url = "tel: 5719706438";
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
      const updatedPhotos = [...images, ...yourPhotos];
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
            <TouchableOpacity>
              <Ionicons name="share-outline" size={35} color={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons name="dots-horizontal" size={35} color={Colors.black} />
            </TouchableOpacity>
          </View>
        }
      />
      {loading || !restaurant ? (
        <></>
      ) : (
        <>
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

          {/* Restaurant Details */}
          <View style={styles.restaurantDetails}>
            <View style={{ gap: 5, flex: 1 }}>
              <Text style={{ fontSize: 18, color: Colors.black }}>
                {createRestaurantInfoString()}
              </Text>
              <Text style={styles.addressContainer}>{restaurant?.address}</Text>
            </View>
          </View>

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

          <SectionList
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 20 }}
            sections={UserDummyData}
            //@ts-ignore
            stickyHeaderIndices={[0]}
            keyExtractor={(item, index) => item.userName + index}
            renderSectionHeader={() => (
              <View style={styles.sectionListHeaderContainer}>
                <Text style={styles.sectionHeaderText}>What did your friends think?</Text>
              </View>
            )}
            ListHeaderComponent={HeaderComponent}
            renderItem={({ item }) => <ListingsMemberItem user={item} ranking />}
          />
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
