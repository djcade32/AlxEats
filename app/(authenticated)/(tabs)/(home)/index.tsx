import { RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import Post from "@/components/Post";
import { getFeed } from "@/firebase";
import { useAppStore } from "@/store/app-storage";
import { FeedPost } from "@/interfaces";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";

const home = () => {
  const { userDbInfo, userFollowing, userPosts, appLoading } = useAppStore();
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!userDbInfo || appLoading) return;
    (async () => setFeed(await getFeed(userDbInfo?.id)))();
  }, [userFollowing, userPosts, appLoading]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    (async () => setFeed(await getFeed(userDbInfo!.id)))().then(() => setRefreshing(false));
  }, []);
  return (
    <View style={styles.container}>
      {/* {appLoading === true ? (
        <></>
      ) : ( */}
      <FlatList
        data={feed}
        contentContainerStyle={[styles.flatListContainer, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
        contentInset={{ top: 15, bottom: 20 }}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item.activityId.toString()}
        onRefresh={async () => setFeed(await getFeed(userDbInfo!.id))}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]} // Customize the spinner color
            tintColor={Colors.primary} // Customize the spinner color for iOS
          />
        }
        ListEmptyComponent={() => (
          <>
            {!appLoading && (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
                <Text style={{ color: Colors.gray, fontSize: Font.medium }}>No post to view.</Text>
              </View>
            )}
          </>
        )}
      />
      {/* )} */}
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  flatListContainer: {
    alignItems: "center",
    gap: 15,
    paddingTop: 15,
  },
});
