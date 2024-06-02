import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import Font from "@/constants/Font";
import { User } from "@/interfaces";
import profilePic from "@/app/(authenticated)/(onboarding)/profilePic";

interface ListingsMemberItemProps {
  user: User;
  ranking?: boolean;
}

const ListingsMemberItem = ({ user, ranking = false }: ListingsMemberItemProps) => {
  const router = useRouter();

  const handlPress = () => {
    router.push(`/(authenticated)/(tabs)/(search)/profile/${JSON.stringify(user.id)}`);
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
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
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
    paddingHorizontal: 25,
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
