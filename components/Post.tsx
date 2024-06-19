import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { FeedPost, User } from "@/interfaces";
import {
  getUserById,
  likePost,
  removeLikePost,
  removePost,
  restaurantAdded,
  restaurantRemoved,
} from "@/firebase";
import { formatTime } from "@/common-utils";
import { useAppStore } from "@/store/app-storage";
import { useRouter } from "expo-router";
import PictureViewModal from "./PictureViewModal";

interface PostProps {
  post: FeedPost;
}

const Post = ({ post }: PostProps) => {
  const { userDbInfo, userPosts, checkIfUserTriedRestaurant, checkIfUserToTryRestaurant } =
    useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isTried, setIsTried] = useState(false);
  const [isToTry, setIsToTry] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(post.likes.length);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (post.userId === userDbInfo?.id) {
      setUser(userDbInfo);
      const isTried = checkIfUserTriedRestaurant(post.restaurantId);
      if (isTried) setIsTried(true);
      if (!isTried) setIsToTry(checkIfUserToTryRestaurant(post.restaurantId));
      setLoading(false);
    } else {
      getUserById(post.userId).then((user) => {
        setUser(user);
        const isTried = checkIfUserTriedRestaurant(post.restaurantId);
        if (isTried) setIsTried(true);
        if (!isTried) setIsToTry(checkIfUserToTryRestaurant(post.restaurantId));
        setLoading(false);
      });
    }

    if (post.likes.includes(userDbInfo!.id)) setIsLiked(true);
  }, []);
  useEffect(() => {
    if (loading) return;
    checkIfUserTriedRestaurant(post.restaurantId) ? setIsTried(true) : setIsTried(false);
  }, [userPosts]);

  const handlePostPress = () => {
    router.push({
      pathname: `/restaurantDetails/${JSON.stringify(post.restaurantId)}`,
    });
  };

  const handleTriedPress = async () => {
    if (!userDbInfo) return;

    router.push({
      pathname: "/(authenticated)/(modals)/RankRestaurant/",
      params: {
        restaurant: JSON.stringify({
          placeId: post.restaurantId,
          name: post.restaurantName,
          address: post.restaurantLocation,
        }),
        isToTry: `${isToTry}`,
        postId: isToTry ? post.activityId : "",
      },
    });
  };

  const handleToTryPress = async () => {
    if (!userDbInfo) return;

    try {
      if (isToTry) {
        setIsToTry(false);
        await restaurantRemoved(userDbInfo.id, post.restaurantId, "TO_TRY");
        await removePost(userDbInfo.id, post.restaurantId);
        return;
      }
      setIsToTry(true);
      await restaurantAdded(
        userDbInfo.id,
        userDbInfo?.firstName!,
        post.restaurantName,
        post.restaurantLocation,
        post.restaurantId,
        "TO_TRY"
      );
    } catch (error) {
      console.log("Error adding or removing restaurant to to try list: ", error);
    }
  };

  const handleLikePost = async () => {
    try {
      if (isLiked) {
        setIsLiked(false);
        setNumOfLikes(numOfLikes - 1);
        await removeLikePost(userDbInfo!.id, post.activityId);
        return;
      }
      setIsLiked(true);
      setNumOfLikes(numOfLikes + 1);
      await likePost(userDbInfo!.id, post.activityId);
    } catch (error) {
      console.log("Error liking post: ", error);
      setIsLiked(!isLiked);
    }
  };

  const handlePhotoPressed = (photoUrl: string) => {
    setIsModalVisible(true);
    setSelectedPhoto(photoUrl);
  };

  if (loading)
    return (
      <Text>
        <ActivityIndicator color={Colors.lightGray} />
      </Text>
    );

  return (
    // <TouchableWithoutFeedback onPress={handlePostPress} >
    <View style={styles.postContainer}>
      {/* Post content */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {/* Profile picture */}
        <TouchableOpacity style={styles.profilePicture}>
          <Image source={{ uri: user?.profilePic }} style={styles.profilePicture} />
        </TouchableOpacity>

        {/* Post details */}
        <View style={{ flex: 1 }}>
          <View style={styles.detailsContainer}>
            <TouchableOpacity disabled={user?.id === userDbInfo?.id}>
              <Text style={styles.importantText}>
                {user?.id === userDbInfo?.id ? "You" : user?.firstName}{" "}
              </Text>
            </TouchableOpacity>
            <Text style={styles.actionText}>
              {post.activityType === "TO_TRY_POST" ? "bookmarked" : "scored"}{" "}
            </Text>
            <TouchableOpacity onPress={handlePostPress}>
              <Text style={styles.importantText}>{post.restaurantName}</Text>
            </TouchableOpacity>
            <Text style={[styles.smallText, { marginTop: 2 }]}>{post.restaurantLocation}</Text>
          </View>
        </View>

        {/* Ranking */}
        {post.activityType == "TRIED_POST" && (
          <View style={styles.rankingContainer}>
            <Text style={{ fontSize: Font.small, color: Colors.secondary, fontWeight: "bold" }}>
              {post.ranking}
            </Text>
          </View>
        )}
      </View>

      {/*Post Photos */}
      {post.photos && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={post.photos}
          scrollEnabled={post.photos.length > 3}
          style={{ marginTop: 10, flexDirection: "row", gap: 5 }}
          contentContainerStyle={{ alignItems: "center", gap: 5 }}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback key={item} onPress={() => handlePhotoPressed(item)}>
              <Image
                source={{ uri: item }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 5,
                  backgroundColor: Colors.lightGray,
                }}
              />
            </TouchableWithoutFeedback>
          )}
        ></FlatList>
      )}

      {/* Post actions */}
      <View>
        <View style={styles.postActionsContainer}>
          {/* Left Side*/}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={handleLikePost}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={30}
                color={Colors.primary}
              />
              <View style={{ width: 15 }}>
                <Text style={{ color: Colors.primary, fontSize: Font.small }}>
                  {numOfLikes > 0 ? numOfLikes : ""}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={30} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Right Side */}

          <View style={{ flexDirection: "row", gap: 8 }}>
            {!isTried ? (
              <>
                <TouchableOpacity onPress={handleTriedPress}>
                  <Ionicons name="add-circle-outline" size={30} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleToTryPress}>
                  <Ionicons
                    name={isToTry ? "bookmark" : "bookmark-outline"}
                    size={30}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ width: 45, alignItems: "center" }}>
                <Ionicons
                  name="checkmark-circle"
                  size={30}
                  color={Colors.primary}
                  style={{ opacity: 0.45 }}
                />
              </View>
            )}
          </View>
        </View>

        {/* Time elapsed */}
        <Text style={styles.smallText}>{formatTime(post.createdAt)}</Text>
      </View>
      {/* Picture View Modal */}
      {isModalVisible && (
        <PictureViewModal
          isModalVisible={isModalVisible}
          toggleModal={() => setIsModalVisible(false)}
          photoUrl={selectedPhoto}
        />
      )}
    </View>
    // </TouchableWithoutFeedback>
  );
};

export default Post;

const styles = StyleSheet.create({
  postContainer: {
    width: 351,
    // height: 160,

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
    backgroundColor: Colors.lightGray,
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
    color: Colors.black,
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
    marginVertical: 5,
    marginTop: 10,
    justifyContent: "space-between",
  },
});
