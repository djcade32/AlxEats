import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface PostProps {
  post: any;
}

const Post = ({ post }: PostProps) => {
  return (
    <View style={styles.postContainer}>
      {/* Post content */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {/* Profile picture */}
        <TouchableOpacity style={styles.profilePicture}>
          <Image source={{ uri: post.picture }} style={styles.profilePicture} />
        </TouchableOpacity>

        {/* Post details */}
        <View style={{ flex: 1 }}>
          <View style={styles.detailsContainer}>
            <TouchableOpacity>
              <Text style={styles.importantText}>{post.firstName} </Text>
            </TouchableOpacity>
            <Text style={styles.actionText}>ranked </Text>
            <TouchableOpacity>
              <Text style={styles.importantText}>{post.restaurantName}</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.smallText, { marginTop: 2 }]}>{post.restaurantLocation}</Text>
        </View>

        {/* Ranking */}
        <View style={styles.rankingContainer}>
          <Text style={{ fontSize: Font.small, color: Colors.secondary, fontWeight: "bold" }}>
            {post.restaurantRanking}
          </Text>
        </View>
      </View>

      {/* Post actions */}
      <View>
        <View style={styles.postActionsContainer}>
          {/* Left Side*/}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="heart-outline" size={30} color={Colors.black} />
              <Text>{post.numberOfLikes}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={30} color={Colors.black} />
            </TouchableOpacity>
          </View>

          {/* Right Side */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity>
              <Ionicons name="add-circle-outline" size={30} color={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="bookmark-outline" size={30} color={Colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Time elapsed */}
        <Text style={styles.smallText}>{post.timeElapsed}</Text>
      </View>
    </View>
  );
};

export default Post;

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
  },

  flatListContainer: {
    alignItems: "center",
    gap: 15,
  },

  profilePicture: {
    width: 62,
    height: 62,
    borderRadius: 31,
    overflow: "hidden",
  },

  detailsContainer: {
    flexDirection: "row",
    marginTop: 5,
    flex: 1,
    flexWrap: "wrap",
    gap: 2.5,
  },

  importantText: {
    fontSize: Font.small,
    color: Colors.black,
    fontWeight: "bold",
  },

  actionText: {
    fontSize: Font.small,
    color: Colors.gray,
  },

  smallText: {
    fontSize: Font.extraSmall,
    color: Colors.gray,
  },

  rankingContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderColor: Colors.gray,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  postActionsContainer: {
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between",
  },
});
