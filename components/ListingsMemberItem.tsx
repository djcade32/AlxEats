import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import Font from "@/constants/Font";

interface ListingsMemberItemProps {
  user: any;
  ranking?: boolean;
  onPress?: () => void;
}

const ListingsMemberItem = ({ user, ranking = false, onPress }: ListingsMemberItemProps) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ flexDirection: "row", flex: 1 }} onPress={onPress}>
        <Image source={{ uri: user.picture }} style={styles.profilePicture} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            {user.userName}
          </Text>
        </View>
      </TouchableOpacity>
      {ranking ? (
        <View style={styles.rankingCircle}>
          <Text style={styles.rankingText}>{user.restaurantRanking}</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
      )}
    </View>
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
});
