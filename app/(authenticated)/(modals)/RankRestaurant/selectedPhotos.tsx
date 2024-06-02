import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { useRestaurantRankingStore } from "@/store/restaurantRanking-storage";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";

const selectedPhotos = () => {
  const { photos, updatePhotos, emptyPhotos } = useRestaurantRankingStore();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const PHOTO_WIDTH = width / 2;
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const handleImagePress = (photo: string) => {
    setSelectedPhotos((prev) => {
      if (prev.includes(photo)) {
        return prev.filter((p) => p !== photo);
      }
      return [...prev, photo];
    });
  };

  const handleDeletePress = () => {
    updatePhotos(photos.filter((photo) => !selectedPhotos.includes(photo)));
    setSelectedPhotos([]);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: Colors.primary, fontSize: 18 }}>Cancel</Text>
            </TouchableOpacity>
          ),
          title: "Selected Photos",
          headerTitleStyle: { fontFamily: "nm-b", fontSize: Font.medium },
          headerRight: () => (
            <TouchableOpacity disabled={selectedPhotos.length === 0} onPress={handleDeletePress}>
              <Text
                style={{
                  color: selectedPhotos.length === 0 ? Colors.gray : Colors.primary,
                  fontSize: 18,
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
      <ScrollView
        style={{ marginTop: 10 }}
        contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
      >
        {photos.map((photo, index) => (
          <TouchableWithoutFeedback key={index} onPress={() => handleImagePress(photo)}>
            <View
              style={{
                width: PHOTO_WIDTH,
                height: PHOTO_WIDTH,
                backgroundColor: Colors.lightGray,
                position: "relative",
              }}
            >
              <Image source={{ uri: photo }} style={{ width: PHOTO_WIDTH, height: PHOTO_WIDTH }} />
              {selectedPhotos.includes(photo) && (
                <MaterialCommunityIcons
                  name="checkbox-intermediate"
                  size={30}
                  color={Colors.primary}
                  style={{ position: "absolute", right: 5, bottom: 5 }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
      <View style={{ flex: 1 }} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 50,
        }}
      >
        {selectedPhotos.length > 0 && (
          <Text style={{ fontSize: Font.small, color: Colors.black }}>{`${selectedPhotos.length} ${
            selectedPhotos.length === 1 ? "photo" : "photos"
          } selected`}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default selectedPhotos;

const styles = StyleSheet.create({});
