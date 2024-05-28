import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Font from "@/constants/Font";
import { RestaurantItem } from "@/interfaces";

interface ListingsRestaurantItemProps {
  restaurant: RestaurantItem;
  ranking?: boolean;
}

const ListingsRestaurantItem = ({ restaurant, ranking = false }: ListingsRestaurantItemProps) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const TEXT_AVAILABLE_WIDTH = width - 130;

  const handleRestaurantPress = (item: any) => {
    router.push(`/restaurantDetails/${JSON.stringify(item)}`);
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
        {ranking ? (
          <View style={styles.rankingCircle}>
            <Text style={styles.rankingText}>{8.0}</Text>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity>
              <Ionicons name="add-circle-outline" size={30} color={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="bookmark-outline" size={30} color={Colors.black} />
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
