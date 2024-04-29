import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

const DummyData = [
  {
    userName: "Alice",
    restaurantName: "Taste of Italy",
    restaurantLocation: "Alexandria, VA",
    numberOfLikes: 25,
    restaurantRanking: 8.5,
    timeElapsed: "2 hours ago",
    picture: "https://randomuser.me/api/portraits/men/80.jpg",
  },
  {
    userName: "Bob",
    restaurantName: "Sushi World",
    restaurantLocation: "Arlington, VA",
    numberOfLikes: 12,
    restaurantRanking: 9.0,
    timeElapsed: "5 hours ago",
    picture: "https://randomuser.me/api/portraits/women/39.jpg",
  },
  {
    userName: "Charlie",
    restaurantName: "Burger Bistro",
    restaurantLocation: "Fairfax, VA",
    numberOfLikes: 8,
    restaurantRanking: 7.2,
    timeElapsed: "1 day ago",
    picture: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    userName: "Emily",
    restaurantName: "Taste of India",
    restaurantLocation: "Springfield, VA",
    numberOfLikes: 15,
    restaurantRanking: 8.0,
    timeElapsed: "3 hours ago",
    picture: "https://randomuser.me/api/portraits/women/28.jpg",
  },
  {
    userName: "David",
    restaurantName: "Mexican Grill",
    restaurantLocation: "Alexandria, VA",
    numberOfLikes: 20,
    restaurantRanking: 9.2,
    timeElapsed: "1 day ago",
    picture: "https://randomuser.me/api/portraits/men/70.jpg",
  },
  {
    userName: "Ella",
    restaurantName: "Seafood Shack",
    restaurantLocation: "Arlington, VA",
    numberOfLikes: 10,
    restaurantRanking: 8.8,
    timeElapsed: "6 hours ago",
    picture: "https://randomuser.me/api/portraits/women/70.jpg",
  },
  {
    userName: "Frank",
    restaurantName: "Pizza Paradise",
    restaurantLocation: "Fairfax, VA",
    numberOfLikes: 18,
    restaurantRanking: 7.5,
    timeElapsed: "2 days ago",
    picture: "https://randomuser.me/api/portraits/women/97.jpg",
  },
  {
    userName: "Grace",
    restaurantName: "Thai Treats",
    restaurantLocation: "Alexandria, VA",
    numberOfLikes: 22,
    restaurantRanking: 9.5,
    timeElapsed: "4 hours ago",
    picture: "https://randomuser.me/api/portraits/men/97.jpg",
  },
];

const home = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ alignItems: "center", gap: 15 }}
        showsVerticalScrollIndicator={false}
        contentInset={{ top: 20, bottom: 20 }}
      >
        {DummyData.map((item, index) => (
          <View key={index} style={styles.postContainer}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={{ width: 62, height: 62, borderRadius: 31, overflow: "hidden" }}
              >
                <Image
                  source={{ uri: item.picture }}
                  style={{ height: 62, width: 62, resizeMode: "cover" }}
                />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    flex: 1,
                    flexWrap: "wrap",
                    gap: 2.5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: Font.small,
                      color: Colors.black,
                    }}
                  >
                    {item.userName}{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: Font.small,
                      color: Colors.black,
                    }}
                  >
                    ranked{" "}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: Font.small,
                      color: Colors.black,
                    }}
                  >
                    {item.restaurantName}
                  </Text>
                </View>
                <Text style={{ fontSize: Font.extraSmall, color: Colors.gray, marginTop: 5 }}>
                  {item.restaurantLocation}
                </Text>
              </View>

              <View
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 31,
                  borderColor: Colors.gray,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: Font.medium, color: Colors.secondary, fontWeight: "bold" }}
                >
                  {item.restaurantRanking}
                </Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 5,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="heart-outline" size={30} color={Colors.black} />
                    <Text>{item.numberOfLikes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="share-outline" size={30} color={Colors.black} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity>
                    <Ionicons name="add-circle-outline" size={30} color={Colors.black} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={30} color={Colors.black} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={{ fontSize: Font.small, color: Colors.gray }}>{item.timeElapsed}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  postContainer: {
    width: 351,
    height: 160,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.gray,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
});
