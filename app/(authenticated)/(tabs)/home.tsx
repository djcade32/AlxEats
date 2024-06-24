import { RefreshControl, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { postData as POST_DATA } from "@/assets/data/dummyData";
import Post from "@/components/Post";
import { getFeed } from "@/firebase";
import { useAppStore } from "@/store/app-storage";
import { FeedPost } from "@/interfaces";
import Colors from "@/constants/Colors";

const home = () => {
  const { userDbInfo } = useAppStore();
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!userDbInfo) return;

    (async () => setFeed(await getFeed(userDbInfo?.id)))();
  }, []);
  const onRefresh = useCallback(() => {
    console.log("Refreshing");
    setRefreshing(true);
    (async () => setFeed(await getFeed(userDbInfo!.id)))().then(() => setRefreshing(false));
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        contentContainerStyle={styles.flatListContainer}
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
      />
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
