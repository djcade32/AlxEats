import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import CustomAuthenticatedHeader from "@/components/CustomAuthenticatedHeader";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { FeedPost, User } from "@/interfaces";
import { getUserPosts } from "@/firebase";
import LoadingText from "@/components/LoadingText";
import { getAuth } from "firebase/auth";
import { useAppStore } from "@/store/app-storage";
import Post from "@/components/Post";
import Font from "@/constants/Font";

const currentUser = () => {
  const { userDbInfo, userToTryRestaurants, userTriedRestaurants, userFollowers, userFollowing } =
    useAppStore();
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<FeedPost[]>([]);
  const router = useRouter();

  useEffect(() => {
    setIsCurrentUser(userDbInfo?.id === getAuth().currentUser?.uid);
    setUser(userDbInfo);
    (async () => {
      getPosts(userDbInfo!).then(() => setTimeout(() => setLoading(false), 2000));
    })();
  }, []);

  useEffect(() => {
    if (user) {
      getPosts(userDbInfo!);
    }
  }, [user, userTriedRestaurants, userToTryRestaurants]);

  const getPosts = async (user: User) => {
    try {
      if (!user) return console.log("User not found");
      getUserPosts(user.id).then((posts) => {
        setUserPosts([...posts]);
      });
    } catch (error) {
      console.log("Error getting user posts: ", error);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          header: () => (
            <CustomAuthenticatedHeader
              headerRight={
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity>
                    <Ionicons name="share-outline" size={22} color={Colors.black} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={22} color={Colors.black} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push("/settings")}>
                    <Ionicons name="settings-outline" size={22} color={Colors.black} />
                  </TouchableOpacity>
                </View>
              }
            />
          ),
        }}
      ></Stack.Screen>
      <View>
        <View style={styles.profileContainer}>
          <Image source={{ uri: user?.profilePic }} style={styles.profileImage} />
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
              <TouchableOpacity style={styles.editProfileButton}>
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

        <View style={styles.profileStatsContainer}>
          <TouchableOpacity style={{ alignItems: "center", flex: 1 }}>
            <LoadingText
              title={`${userFollowers.length}`}
              loading={loading}
              textStyle={{ fontSize: 20, fontFamily: "nm-b" }}
              containerStyle={{ height: 23, width: 25, borderRadius: 10 }}
            />
            <Text style={{ color: Colors.gray }}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center", flex: 1 }}>
            <LoadingText
              title={`${userFollowing.length}`}
              loading={loading}
              textStyle={{ fontSize: 20, fontFamily: "nm-b" }}
              containerStyle={{ height: 23, width: 25, borderRadius: 10 }}
            />
            <Text style={{ color: Colors.gray }}>Following</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center", flex: 1 }}>
            <LoadingText
              title={`${userTriedRestaurants.length}`}
              loading={loading}
              textStyle={{ fontSize: 20, fontFamily: "nm-b" }}
              containerStyle={{ height: 23, width: 25, borderRadius: 10 }}
            />
            <Text style={{ color: Colors.gray }}>Scored</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={userPosts}
        renderItem={({ item }) => <Post post={item} />}
        contentContainerStyle={[styles.flatListContainer, userPosts.length === 0 && { flex: 1 }]}
        ListEmptyComponent={
          <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
            {loading ? (
              <ActivityIndicator color={Colors.primary} size={"small"} />
            ) : (
              <Text style={{ color: Colors.gray, fontSize: Font.medium }}>
                You have no posts yet
              </Text>
            )}
          </View>
        }
      />
    </View>
  );
};

export default currentUser;

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    paddingHorizontal: 22,
    paddingVertical: 10,
    alignItems: "center",
  },

  profileImage: {
    height: 106,
    width: 106,
    borderRadius: 53,
    resizeMode: "cover",
    backgroundColor: Colors.lightGray,
  },

  editProfileButton: {
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 25,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    width: 120,
  },

  profileStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingBottom: 10,
  },

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
  flatListContainer: {
    alignItems: "center",
    gap: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
});
