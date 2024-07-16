import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import Font from "@/constants/Font";
import { User } from "@/interfaces";
import { followUser, unfollowUser } from "@/firebase";
import { useAppStore } from "@/store/app-storage";
import LoadingText from "./LoadingText";

interface ListingsMemberItemProps {
  user: User;
  ranking?: boolean;
  tabScreenName: string;
}

const ListingsMemberItem = ({ user, ranking = false, tabScreenName }: ListingsMemberItemProps) => {
  const router = useRouter();

  const { userDbInfo, userFollowing } = useAppStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handlePress = () => {
    router.push(`/${tabScreenName}/profile/${JSON.stringify(user.id)}`);
  };

  useEffect(() => {
    if (!userDbInfo?.profilePic) return setIsLoading(false);
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
          <TouchableOpacity
            disabled={isLoading}
            style={{ flexDirection: "row", flex: 1 }}
            onPress={handlePress}
          >
            {user.profilePic ? (
              <Image
                source={{ uri: user.profilePic }}
                style={styles.profilePicture}
                onLoad={() => setIsLoading(false)}
              />
            ) : (
              <View
                style={[styles.profilePicture, { justifyContent: "center", alignItems: "center" }]}
              >
                <Text style={styles.profilePicturePlaceholder}>
                  {user.firstName.charAt(0) + user.lastName.charAt(0)}
                </Text>
              </View>
            )}

            <View style={{ marginLeft: 10 }}>
              <LoadingText
                loading={isLoading}
                textStyle={styles.name}
                title={`${user.firstName} ${user.lastName}`}
                containerStyle={{ width: 120, height: 25, borderRadius: 15, marginBottom: 5 }}
              />
              <LoadingText
                loading={isLoading}
                textStyle={styles.username}
                title={`@${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}`}
                containerStyle={{ width: 80, height: 15, borderRadius: 15 }}
                numberOfLines={1}
              />
            </View>
          </TouchableOpacity>
          {!isLoading && (
            <>
              {ranking ? (
                <View style={styles.rankingCircle}>
                  <Text style={styles.rankingText}>{ranking}</Text>
                </View>
              ) : (
                userDbInfo?.id !== user.id && (
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      isFollowing && { backgroundColor: Colors.primary },
                    ]}
                    onPress={handleFollowPressed}
                    disabled={isLoading}
                  >
                    <Text style={[styles.followText, isFollowing && { color: "white" }]}>
                      {isFollowing ? "Following" : "Follow"}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </>
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
    backgroundColor: Colors.lightGray,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
    fontFamily: "nm-b",
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

  profilePicturePlaceholder: {
    fontSize: Font.medium,
    color: "white",
    fontFamily: "nm-b",
  },
});
