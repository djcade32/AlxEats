import { StyleSheet, View } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { postData as POST_DATA } from "@/assets/data/dummyData";
import Post from "@/components/Post";

const home = () => {
  return (
    <View style={styles.container}>
      {/* <FlatList
        data={POST_DATA}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
        contentInset={{ top: 15, bottom: 20 }}
        renderItem={({ item }) => <Post post={item} />}
      /> */}
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
