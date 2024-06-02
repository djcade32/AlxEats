import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import CustomAuthenticatedHeader from "@/components/CustomAuthenticatedHeader";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import CustomHeader from "@/components/CustomHeader";
import { User } from "@/interfaces";
import { getUserById } from "@/firebase";
import { AnimateStyle } from "react-native-reanimated";
import LoadingText from "@/components/LoadingText";
import { getAuth } from "firebase/auth";

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

const profile = () => {
  let userId = JSON.parse(useLocalSearchParams<any>().userId as string);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setIsCurrentUser(userId === getAuth().currentUser?.uid);
    getUserById(userId).then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={`@${user?.firstName}.${user?.lastName}`}
              headerLeft={
                <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
              }
              loading={loading}
            />
          ),
        }}
      ></Stack.Screen>
      <View>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 22,
            paddingVertical: 10,
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: user?.profilePic }}
            style={{
              height: 106,
              width: 106,
              borderRadius: 53,
              resizeMode: "cover",
              backgroundColor: Colors.lightGray,
            }}
          />
          <View style={{ marginLeft: 12, marginTop: 10 }}>
            <View>
              <LoadingText
                title={`${user?.firstName} ${user?.lastName}`}
                loading={loading}
                textStyle={{ fontSize: 20, fontFamily: "nm-b" }}
                containerStyle={{ height: 25, width: 120, borderRadius: 15 }}
              />
            </View>
            <LoadingText
              title={`@${user?.firstName}.${user?.lastName}`}
              loading={loading}
              textStyle={{ fontSize: 16, color: Colors.gray, marginTop: 5 }}
              containerStyle={{ height: 17, width: 100, borderRadius: 10, marginTop: 5 }}
            />

            {isCurrentUser && (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  paddingVertical: 3,
                  paddingHorizontal: 10,
                  borderRadius: 25,
                  marginTop: 10,
                  borderWidth: 1,
                  borderColor: Colors.gray,
                  width: 120,
                }}
              >
                <Text
                  style={{
                    color: Colors.gray,
                    textAlign: "center",
                  }}
                >
                  Edit profile
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20,
            paddingBottom: 10,
          }}
        >
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={{ fontSize: 20, fontFamily: "nm-b" }}>408</Text>
            <Text style={{ color: Colors.gray }}>Followers</Text>
          </View>
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={{ fontSize: 20, fontFamily: "nm-b" }}>213</Text>
            <Text style={{ color: Colors.gray }}>Following</Text>
          </View>
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={{ fontSize: 20, fontFamily: "nm-b" }}>120</Text>
            <Text style={{ color: Colors.gray }}>Rated</Text>
          </View>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={DummyData}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
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
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: Font.small,
                        color: Colors.black,
                      }}
                    >
                      {item.userName}{" "}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: Font.small,
                      color: Colors.black,
                    }}
                  >
                    ranked{" "}
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: Font.small,
                        color: Colors.black,
                      }}
                    >
                      {item.restaurantName}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={{ fontSize: Font.extraSmall, color: Colors.gray, marginTop: 2 }}>
                  {item.restaurantLocation}
                </Text>
              </View>

              <View
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 22.5,
                  borderColor: Colors.gray,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: Font.small, color: Colors.secondary, fontWeight: "bold" }}>
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
              <Text style={{ fontSize: Font.extraSmall, color: Colors.gray }}>
                {item.timeElapsed}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  postContainer: {
    width: 351,
    height: 160,

    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignSelf: "center",
    marginVertical: 15,
  },
});
