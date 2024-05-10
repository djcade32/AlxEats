import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  SectionList,
} from "react-native";
import React, { useState } from "react";
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

const UserDummyData = [
  {
    title: "Peer Reviews",
    data: USER_DATA,
  },
];

const DummyText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const restaurantDetails = () => {
  const router = useRouter();
  let restaurantObj = useLocalSearchParams<any>().id as any;
  restaurantObj = JSON.parse(restaurantObj);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCommentPress = () => {
    router.push("/(authenticated)/(modals)/editComment");
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
      {/* Map View */}
      <View style={{ height: "40%" }}>
        <MapView
          style={StyleSheet.absoluteFill}
          // provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: restaurantObj?.lat + 0.001 || 38.8462,
            longitude: restaurantObj?.lon || -77.3064,
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
              latitude: restaurantObj?.lat || 38.8462,
              longitude: restaurantObj?.lon || -77.3064,
            }}
          >
            <Image
              source={require("@/assets/images/location-pin.png")}
              style={{ width: 50, height: 50 }}
            />
          </Marker>
        </MapView>

        <View style={styles.mapDetailsText}>
          <Text style={styles.restaurantName}>{restaurantObj.restaurantName}</Text>
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
          <Text style={{ fontSize: 18, color: Colors.black }}>$$$$ • American • 2.5 mi</Text>
          <Text style={styles.addressContainer}>{restaurantObj.address}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => console.log("pressed")}>
          <Ionicons name="navigate-outline" size={18} color={Colors.black} />
          <Text style={styles.actionButtonText}>Directions</Text>
        </TouchableOpacity>

        <View style={styles.actionButtonSeparator} />

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="web" size={18} color={Colors.black} />
          <Text style={styles.actionButtonText}>Website</Text>
        </TouchableOpacity>

        <View style={styles.actionButtonSeparator} />

        <TouchableOpacity style={styles.actionButton}>
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
    width: "60%",
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
