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
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import CustomHeader from "@/components/CustomHeader";
import { FeedPost, User } from "@/interfaces";
import { getUserById, getUserFollowers, getUserFollowings, getUserPosts } from "@/firebase";
import LoadingText from "@/components/LoadingText";
import { getAuth } from "firebase/auth";
import Post from "@/components/Post";
import { useAppStore } from "@/store/app-storage";

const profile = () => {
  let userId = JSON.parse(useLocalSearchParams<any>().userId as string);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<FeedPost[]>([]);
  const [userFollowings, setUserFollowings] = useState<string[]>([]);
  const [userFollowers, setUserFollowers] = useState<string[]>([]);

  useEffect(() => {
    setIsCurrentUser(userId === getAuth().currentUser?.uid);
    (async () => {
      const user = await getUserById(userId);
      setUser(user);
      setUserFollowings(await getUserFollowings(userId));
      setUserFollowers(await getUserFollowers(userId));
      getPosts(user).then(() => setTimeout(() => setLoading(false), 2000));
    })();
  }, []);

  const getPosts = async (user: User | null) => {
    try {
      if (!user) return console.log("User not found");
      getUserPosts(user.id).then((posts) => {
        setUserPosts([...posts]);
      });
    } catch (error) {
      console.log("Error getting user posts: ", error);
    }
  };

  const handleFollowersPress = (activeScreen: string) => {
    router.push({
      pathname: "/followings",
      params: {
        followers: JSON.stringify(userFollowers),
        followings: JSON.stringify(userFollowings),
        activeScreen,
      },
    });
  };

  const handleScoredPress = () => {
    if (!user) return;
    router.push({ pathname: "/scored", params: { userId: JSON.stringify(user.id) } });
  };
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
          <TouchableOpacity
            style={{ alignItems: "center", flex: 1 }}
            onPress={() => handleFollowersPress("followers")}
          >
            <LoadingText
              title={userFollowers.length.toString()}
              loading={loading}
              textStyle={{ fontSize: 20, fontFamily: "nm-b" }}
              containerStyle={{ height: 23, width: 25, borderRadius: 10 }}
            />
            <Text style={{ color: Colors.gray }}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center", flex: 1 }}
            onPress={() => handleFollowersPress("followings")}
          >
            <LoadingText
              title={userFollowings.length.toString()}
              loading={loading}
              textStyle={{ fontSize: 20, fontFamily: "nm-b" }}
              containerStyle={{ height: 23, width: 25, borderRadius: 10 }}
            />
            <Text style={{ color: Colors.gray }}>Following</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center", flex: 1 }}
            onPress={() => handleScoredPress()}
          >
            <LoadingText
              title={userPosts.length.toString()}
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
                This user has no posts
              </Text>
            )}
          </View>
        }
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

  flatListContainer: {
    alignItems: "center",
    gap: 15,
    paddingTop: 15,
  },
});
