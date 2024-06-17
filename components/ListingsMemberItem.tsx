import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import Font from "@/constants/Font";
import { User } from "@/interfaces";
import { followUser, unfollowUser } from "@/firebase";
import { useAppStore } from "@/store/app-storage";

interface ListingsMemberItemProps {
  user: User;
  ranking?: boolean;
}

const ListingsMemberItem = ({ user, ranking = false }: ListingsMemberItemProps) => {
  const router = useRouter();
  const { userDbInfo, userFollowing } = useAppStore();
  const [isFollowing, setIsFollowing] = useState(false);

  const handlPress = () => {
    router.push(`/(authenticated)/(tabs)/(search)/profile/${JSON.stringify(user.id)}`);
  };

  useEffect(() => {
    //Determine if following user
    setIsFollowing(!!userFollowing?.find((id) => id === user.id));
  }, []);

  const handleFollowPressed = async () => {
    if (!userDbInfo) return;
    try {
      if (!isFollowing) {
        setIsFollowing(true);
        await followUser(userDbInfo.id, user.id);
        return;
      }
      setIsFollowing(false);
      unfollowUser(userDbInfo.id, user.id);
    } catch (error) {
      console.log("Error following user: ", error);
      //Revert back
      setIsFollowing(!isFollowing);
    }
  };
  return (
    <>
      {user.firstName ? (
        <View style={styles.container}>
          <TouchableOpacity style={{ flexDirection: "row", flex: 1 }} onPress={handlPress}>
            {user.profilePic ? (
              <Image source={{ uri: user.profilePic }} style={styles.profilePicture} />
            ) : (
              <View
                style={[styles.profilePicture, { justifyContent: "center", alignItems: "center" }]}
              >
                <Text style={styles.profilePicturePlacholder}>
                  {user.firstName.charAt(0) + user.lastName.charAt(0)}
                </Text>
              </View>
            )}
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.name}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.username} numberOfLines={1}>
                @{user.firstName.toLowerCase()}.{user.lastName.toLowerCase()}
              </Text>
            </View>
          </TouchableOpacity>
          {ranking ? (
            <View style={styles.rankingCircle}>
              <Text style={styles.rankingText}>7.0</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.followButton, isFollowing && { backgroundColor: Colors.primary }]}
              onPress={handleFollowPressed}
            >
              <Text style={[styles.followText, isFollowing && { color: "white" }]}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default ListingsMemberItem;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  profilePicture: {
    height: 52,
    width: 52,
    borderRadius: 52 / 2,
    resizeMode: "cover",
    backgroundColor: Colors.gray,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
    fontFamily: "nm-b",
    marginBottom: 5,
  },

  username: {
    fontSize: 14,
    color: Colors.gray,
  },

  followButton: {
    borderWidth: 1,
    borderColor: Colors.black,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderRadius: 25,
  },

  followText: {
    fontSize: 18,
    color: Colors.black,
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

  profilePicturePlacholder: {
    fontSize: Font.medium,
    color: "white",
    fontFamily: "nm-b",
  },
});
