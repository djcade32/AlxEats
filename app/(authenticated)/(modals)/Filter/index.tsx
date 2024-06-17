import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";
import CustomAccordion from "@/components/CustomAccordion";
import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { useFilterStore } from "@/store/filter-storage";
import { RestaurantListFilterPayload } from "@/interfaces";

const INITIAL_FILTER_STATE: RestaurantListFilterPayload = {
  priceMax: "",
  scoreRange: { min: 0, max: 100 },
  sortOrder: "ASC",
  sortBy: "Distance",
  cuisinesFilter: [],
};

const filter = () => {
  const router = useRouter();
  const { restaurantListFilter, areFiltersEqual, updateRestaurantListFilter, updateCuisineFilter } =
    useFilterStore();
  const [filterState, setFilterState] = useState(restaurantListFilter);

  // Get the cuisines filter from the store
  const cuisines = useFilterStore((state) => state.cuisineFilter);

  useEffect(() => {
    setFilterState({ ...filterState, cuisinesFilter: cuisines });
  }, [cuisines]);

  // Remove give cuisine from the filter
  const removeCuisineFromFilter = (cuisine: string) => {
    useFilterStore.getState().updateCuisineFilter(cuisines.filter((c) => c !== cuisine));
  };

  const handleCuisinesPress = () => {
    router.push("/(authenticated)/(modals)/Filter/cuisinesFilter");
  };

  const handleBackPress = () => {
    updateCuisineFilter(restaurantListFilter.cuisinesFilter);
    router.back();
  };

  const handleResetFilterPress = () => {
    setFilterState(INITIAL_FILTER_STATE);
  };

  const handleApplyFilterPress = () => {
    let newCuisinesList =
      cuisines.length > 0 && filterState.cuisinesFilter.length === 0 ? [] : cuisines;
    updateRestaurantListFilter({ ...filterState, cuisinesFilter: newCuisinesList });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          title: "Filter",
          headerTitleStyle: { fontFamily: "nm-b", fontSize: Font.medium },
          headerLeft: () => (
            <View style={styles.headerIconContainer}>
              <TouchableOpacity onPress={handleBackPress}>
                <Ionicons name="chevron-back-circle-outline" size={30} color={Colors.black} />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerIconContainer}>
              <TouchableOpacity onPress={handleResetFilterPress}>
                <Text style={{ color: Colors.primary, fontSize: 18 }}>Reset</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>

      <ScrollView style={{ flex: 1 }}>
        <CustomAccordion filterState={filterState} setFilterState={setFilterState} />

        {/* Cuisines Button */}
        <TouchableWithoutFeedback onPress={handleCuisinesPress}>
          <View style={styles.accordHeader}>
            <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
              <Ionicons name="restaurant-outline" size={20} color={Colors.black} />
              <Text style={styles.accordTitle}>Cuisines</Text>
            </View>

            <Ionicons name={"chevron-forward"} size={20} color={Colors.black} />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.cuisineFilterChipsContainer}>
          {cuisines.map((cuisine) => (
            <View style={styles.cuisineFilterChip} key={cuisine}>
              <Text style={{ fontSize: 18, color: Colors.primary }}>{cuisine}</Text>
              <TouchableOpacity onPress={() => removeCuisineFromFilter(cuisine)}>
                <Ionicons name="close" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <CustomButton
        text="Apply filters"
        buttonStyle={styles.applyFilterButton}
        textStyle={{ color: "white", fontSize: 18 }}
        onPress={handleApplyFilterPress}
        disabled={areFiltersEqual(filterState)}
      />
    </SafeAreaView>
  );
};

export default filter;

const styles = StyleSheet.create({
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },

  accordContainer: {
    paddingBottom: 4,
    flex: 1,
    backgroundColor: "white",
  },

  accordHeader: {
    padding: 12,
    backgroundColor: "white",
    color: Colors.black,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    alignItems: "center",
  },

  accordTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.black,
  },

  accordBody: {
    padding: 12,
    gap: 25,
  },

  applyFilterButton: {
    marginHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 12,
    marginBottom: 20,
  },

  textSmall: {
    fontSize: 18,
    color: Colors.black,
  },

  searchInput: {
    backgroundColor: "white",
    flex: 1,
  },

  cuisineFilterChip: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  cuisineFilterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    padding: 12,
  },
});
