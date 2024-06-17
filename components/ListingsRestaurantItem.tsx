import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Font from "@/constants/Font";
import { RestaurantItem } from "@/interfaces";
import { restaurantAdded, restaurantRemoved } from "@/firebase";
import { useAppStore } from "@/store/app-storage";

interface ListingsRestaurantItemProps {
  restaurant: RestaurantItem;
  ranking?: boolean;
  isToTry?: boolean;
}

const ListingsRestaurantItem = ({
  restaurant,
  ranking = false,
  isToTry,
}: ListingsRestaurantItemProps) => {
  const router = useRouter();
  const { authUser, userToTryRestaurants, userTriedRestaurants, userDbInfo } = useAppStore();

  const { width } = useWindowDimensions();
  const [rankingValue, setRankingValue] = useState<number | null>(null);
  const TEXT_AVAILABLE_WIDTH = width - 130;

  useEffect(() => {
    const ranking = userTriedRestaurants.find((r) => r.id === restaurant.placeId)?.ranking;
    if (ranking) setRankingValue(ranking);
  }, [userTriedRestaurants]);

  const handleRestaurantPress = (item: RestaurantItem) => {
    router.push({
      pathname: `/restaurantDetails/${JSON.stringify(item.placeId)}`,
      params: { restaurant: JSON.stringify(item) },
    });
  };

  const handleTriedPress = async () => {
    if (!authUser) return;

    router.push({
      pathname: "/(authenticated)/(modals)/RankRestaurant/",
      params: { restaurant: JSON.stringify(restaurant), isToTry: `${isToTry}` },
    });
  };

  const handleToTryPress = async () => {
    if (!authUser) return;

    try {
      if (isToTry) {
        await restaurantRemoved(authUser.uid, restaurant.placeId, "TO_TRY");
        return;
      }
      await restaurantAdded(
        authUser.uid,
        userDbInfo?.firstName!,
        restaurant.name,
        restaurant.address,
        restaurant.placeId,
        "TO_TRY"
      );
    } catch (error) {
      console.log("Error adding or removing restaurant to to try list: ", error);
    }
  };
  return (
    <View style={styles.container} key={restaurant.placeId}>
      <TouchableOpacity
        style={styles.pressableContainer}
        onPress={() => handleRestaurantPress(restaurant)}
      >
        <Ionicons name="pin" size={30} color={Colors.primary} />

        <View style={{ gap: 5, flex: 1 }}>
          <Text style={styles.restaurantName} numberOfLines={1} ellipsizeMode="tail">
            {restaurant.name}
          </Text>
          <Text style={[styles.address, { width: TEXT_AVAILABLE_WIDTH }]} numberOfLines={1}>
            {restaurant.address}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{ height: 45 }}>
        {rankingValue ? (
          <View style={styles.rankingCircle}>
            <Text style={styles.rankingText}>{rankingValue}</Text>
          </View>
        ) : (
          <View style={styles.actionButtons}>
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
          </View>
        )}
      </View>
    </View>
  );
};

export default ListingsRestaurantItem;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
    fontFamily: "nm-b",
  },

  address: {
    fontSize: 14,
    color: Colors.gray,
    flex: 1,
  },

  actionButtons: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  pressableContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    flex: 1,
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
