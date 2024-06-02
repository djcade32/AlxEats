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
import React, { useEffect, useState } from "react";
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
import { RestaurantItem } from "@/interfaces";
import { restaurantPriceLevels } from "@/mappings";
import Cuisines from "@/data/Cuisines";
import { capitalizeFirstLetter } from "@/common-utils";
import openMap from "react-native-open-maps";
import * as ExpoLinking from "expo-linking";

const UserDummyData = [
  {
    title: "Peer Reviews",
    data: USER_DATA,
  },
];

const DummyText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const restaurantDetails = () => {
  let restaurantObj = useLocalSearchParams<any>().restaurant as any;

  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<RestaurantItem | null>(null);

  useEffect(() => {
    setRestaurant(JSON.parse(restaurantObj));
    setLoading(false);
  }, [restaurantObj]);

  const handleCommentPress = () => {
    router.push("/(authenticated)/(modals)/editComment");
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
    console.log(restaurant.phoneNumber);
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

  return (
    <View style={styles.container}>
      <RestaurantDetailsHeader
        headerLeft={<Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />}
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
      {loading && !restaurant ? (
        <></>
      ) : (
        <>
          {/* Map View */}
          <View style={{ height: "40%" }}>
            <MapView
              style={StyleSheet.absoluteFill}
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
                <Ionicons
                  name="checkmark-circle"
                  size={35}
                  color={Colors.primary}
                  style={{ opacity: 0.45 }}
                />
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
            stickyHeaderIndices={[0]}
            keyExtractor={(item, index) => item.userName + index}
            renderSectionHeader={() => (
              <View style={styles.sectionListHeaderContainer}>
                <Text style={styles.sectionHeaderText}>What did your friends think?</Text>
              </View>
            )}
            ListHeaderComponent={() => (
              <View style={{ backgroundColor: "white" }}>
                {/* Your Photos */}
                <View style={{ paddingLeft: 10 }}>
                  <Text style={styles.sectionHeaderText}>Your photos</Text>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <TouchableOpacity style={styles.addPhotoButton}>
                      <Ionicons name="add" size={25} color={Colors.black} />
                      <Text style={styles.addPhotoButtonText}>Add</Text>
                    </TouchableOpacity>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 10, paddingRight: 10 }}
                      horizontal
                      keyExtractor={(item, index) => index.toString()}
                      data={Array.from({ length: 7 }, (_, i) => i.toString())}
                      renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={() => setIsModalVisible(true)}>
                          <Image
                            source={require("@/assets/images/food-4.jpeg")}
                            style={styles.photoContainer}
                          />
                        </TouchableWithoutFeedback>
                      )}
                    />
                  </View>
                </View>

                {/* Comments */}
                <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
                  <Text style={styles.sectionHeaderText}>Comments</Text>

                  <Text
                    style={styles.commentText}
                    numberOfLines={8}
                    onPress={handleCommentPress}
                    suppressHighlighting
                  >
                    {DummyText || "Comments about the restaurant..."}
                  </Text>
                </View>
              </View>
            )}
            renderItem={({ item }) => <ListingsMemberItem user={item} ranking />}
          />
        </>
      )}
      {/* Picture View Modal */}
      <PictureViewModal
        isModalVisible={isModalVisible}
        toggleModal={() => setIsModalVisible(false)}
      />
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
  },

  commentText: {
    fontSize: 14,
    color: DummyText ? Colors.black : Colors.gray,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
