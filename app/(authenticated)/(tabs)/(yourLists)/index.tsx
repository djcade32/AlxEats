import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import ListingsMap from "@/components/ListingsMap";
import ListingsScreenHeader from "@/components/ListingsScreenHeader";
import ListingsRestaurantItem from "@/components/ListingsRestaurantItem";
import { useAppStore } from "@/store/app-storage";
import { RestaurantRankingPayload } from "@/interfaces";
import * as Location from "expo-location";
import { distanceBetweenCoordinates } from "@/common-utils";
import Colors from "@/constants/Colors";
import { useFilterStore } from "@/store/filter-storage";
import { restaurantPriceLevels } from "@/mappings";

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const yourLists = () => {
  const { userTriedRestaurants, userToTryRestaurants } = useAppStore();
  const { restaurantListFilter } = useFilterStore();
  const debounceTimeout = useRef<any>(null);
  const [searchText, setSearchText] = useState("");
  const [viewToTry, setViewToTry] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filteredTriedRestaurants, setFilteredTriedRestaurants] = useState<
    RestaurantRankingPayload[]
  >([]);
  const [originalTriedRestaurants, setOriginalTriedRestaurants] = useState<
    RestaurantRankingPayload[]
  >([]);
  const [filteredToTryRestaurants, setFilteredToTryRestaurants] = useState<any[]>([]);
  const [originalToTryRestaurants, setOriginalToTryRestaurants] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Set data to show  based on toggle value
  useEffect(() => {
    (async () => {
      setLoading(true);
      let location = await Location.getCurrentPositionAsync({});

      const toTryData = await Promise.all(
        userToTryRestaurants.map(async (restaurantId) => {
          const data = await fetchRestaurant(restaurantId);
          const newRestaurant = {
            placeId: data.id,
            coordinate: {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            },
            name: data.displayName.text,
            openNow: data.regularOpeningHours?.openNow,
            price: data.priceLevel,
            types: data.types,
            primaryType: data.primaryType,
            address: data.formattedAddress,
            phoneNumber: data.nationalPhoneNumber,
            website: data.websiteUri,
            addressComponents: JSON.stringify(data.addressComponents),
            distance: distanceBetweenCoordinates(location.coords, {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            }),
          };

          return { ...newRestaurant };
        })
      );
      setFilteredToTryRestaurants(toTryData);
      setOriginalToTryRestaurants(toTryData);

      const triedData = await Promise.all(
        userTriedRestaurants.map(async (restaurant) => {
          const data = await fetchRestaurant(restaurant.id);
          const newRestaurant = {
            placeId: data.id,
            coordinate: {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            },
            name: data.displayName.text,
            openNow: data.regularOpeningHours?.openNow,
            price: data.priceLevel,
            types: data.types,
            primaryType: data.primaryType,
            address: data.formattedAddress,
            phoneNumber: data.nationalPhoneNumber,
            website: data.websiteUri,
            addressComponents: JSON.stringify(data.addressComponents),
            distance: distanceBetweenCoordinates(location.coords, {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            }),
          };
          return { ...restaurant, ...newRestaurant };
        })
      );
      setFilteredTriedRestaurants(triedData);
      setOriginalTriedRestaurants(triedData);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    (async () => {
      let location = await Location.getCurrentPositionAsync({});

      const toTryData = await Promise.all(
        userToTryRestaurants.map(async (restaurantId) => {
          const data = await fetchRestaurant(restaurantId);
          const newRestaurant = {
            placeId: data.id,
            coordinate: {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            },
            name: data.displayName.text,
            openNow: data.regularOpeningHours?.openNow,
            price: data.priceLevel,
            types: data.types,
            primaryType: data.primaryType,
            address: data.formattedAddress,
            phoneNumber: data.nationalPhoneNumber,
            website: data.websiteUri,
            addressComponents: JSON.stringify(data.addressComponents),
            distance: distanceBetweenCoordinates(location.coords, {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            }),
          };
          return { ...newRestaurant };
        })
      );
      setFilteredToTryRestaurants(toTryData);
      setOriginalToTryRestaurants(toTryData);
    })();
  }, [userToTryRestaurants]);

  useEffect(() => {
    if (loading) return;
    (async () => {
      let location = await Location.getCurrentPositionAsync({});

      const triedData = await Promise.all(
        userTriedRestaurants.map(async (restaurant) => {
          const data = await fetchRestaurant(restaurant.id);
          const newRestaurant = {
            placeId: data.id,
            coordinate: {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            },
            name: data.displayName.text,
            openNow: data.regularOpeningHours?.openNow,
            price: data.priceLevel,
            types: data.types,
            primaryType: data.primaryType,
            address: data.formattedAddress,
            phoneNumber: data.nationalPhoneNumber,
            website: data.websiteUri,
            addressComponents: JSON.stringify(data.addressComponents),
            distance: distanceBetweenCoordinates(location.coords, {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            }),
          };
          return { ...restaurant, ...newRestaurant };
        })
      );
      setFilteredTriedRestaurants(triedData);
      setOriginalTriedRestaurants(triedData);
    })();
  }, [userTriedRestaurants]);

  useEffect(() => {
    if (loading) return;
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (!searchText) {
        performFilter();
      } else {
        searchRestaurants(searchText);
      }
    }, 275); // 275ms delay
    searchRestaurants(searchText);
  }, [searchText]);

  useEffect(() => {
    // filter restaurants based on filter
    if (loading) return;
    performFilter();
  }, [
    restaurantListFilter,
    loading,
    originalToTryRestaurants,
    originalTriedRestaurants,
    viewToTry,
  ]);

  const getRestaurantPriceLevel = (price: string): string | undefined => {
    return restaurantPriceLevels[price as keyof typeof restaurantPriceLevels];
  };

  const searchRestaurants = async (searchText: string) => {
    const data = viewToTry ? originalToTryRestaurants : originalTriedRestaurants;
    const filteredData = data.filter((restaurant: any) =>
      restaurant.name.toLowerCase().includes(searchText.toLowerCase())
    );

    if (viewToTry) {
      setFilteredToTryRestaurants(filteredData);
    } else {
      setFilteredTriedRestaurants(filteredData);
    }
  };

  const fetchRestaurant = async (placeId: string) => {
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const apiKey = GOOGLE_PLACES_API_KEY;

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "displayName.text,types,nationalPhoneNumber,formattedAddress,addressComponents,location,websiteUri,regularOpeningHours.openNow,priceLevel,primaryType,id",
    };

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching restaurant: ", error);
    }
  };

  const renderRowItem = ({ item }: any) => {
    const isToTry = viewToTry
      ? userToTryRestaurants.includes(item.placeId)
      : userTriedRestaurants.find((r) => r.id === item.placeId);
    return <ListingsRestaurantItem restaurant={item} isToTry={!!isToTry} />;
  };

  const performFilter = () => {
    let data = viewToTry ? originalToTryRestaurants : originalTriedRestaurants;
    // sort by distance or score or price
    if (restaurantListFilter.sortBy === "Distance") {
      data.sort((a, b) => a.distance - b.distance);
    } else if (restaurantListFilter.sortBy === "Score" && !viewToTry) {
      data.sort((a, b) => {
        const restaurantA = userTriedRestaurants.find((r) => r.id === a.placeId);
        const restaurantB = userTriedRestaurants.find((r) => r.id === b.placeId);
        if (!restaurantA || !restaurantB) return 0;
        return restaurantA.ranking - restaurantB.ranking;
      });
    } else if (restaurantListFilter.sortBy === "Price") {
      data.sort((a, b) => {
        const priceForA = getRestaurantPriceLevel(a.price);
        const priceForB = getRestaurantPriceLevel(b.price);
        if (!priceForA && !priceForB) return 0;

        // if one of the prices is missing, place it at the end
        if (restaurantListFilter.sortOrder === "ASC") {
          if (!priceForA) return 1; // place 'a' after 'b'
          if (!priceForB) return -1;
        } else if (restaurantListFilter.sortOrder === "DESC") {
          if (!priceForA) return -1; // place 'a' before 'b'
          if (!priceForB) return 1;
        }
        if (!priceForA || !priceForB) return 0;

        return priceForA.length - priceForB.length;
      });
    }

    // reverse data if needed
    if (restaurantListFilter.sortOrder === "DESC") {
      data.reverse();
    }

    // filter by priceMax
    data = data.filter((restaurant) => {
      if (restaurantListFilter.priceMax === "") {
        return true;
      }
      const price = getRestaurantPriceLevel(restaurant.price);
      if (price) {
        return price.length <= restaurantListFilter.priceMax.length;
      }
    });

    // filter by score range
    if (!viewToTry) {
      data = data.filter((restaurant) => {
        const foundRestaurant = userTriedRestaurants.find((r) => r.id === restaurant.placeId);
        if (
          foundRestaurant?.ranking! >= restaurantListFilter.scoreRange.min &&
          foundRestaurant?.ranking! <= restaurantListFilter.scoreRange.max
        ) {
          return true;
        }
      });
    }

    // filter by cuisines
    data = data.filter((restaurant) => {
      if (
        restaurantListFilter.cuisinesFilter.length === 0 ||
        restaurantListFilter.cuisinesFilter.includes(restaurant.primaryType.split("_")[0])
      ) {
        return true;
      }
    });
    // Have to create a new array to trigger a re-render
    viewToTry ? setFilteredToTryRestaurants([...data]) : setFilteredTriedRestaurants([...data]);
  };

  return (
    <View style={styles.container}>
      <ListingsScreenHeader
        searchText={searchText}
        setSearchText={setSearchText}
        activeToggle={viewToTry}
        setActiveToggle={setViewToTry}
        switchValues={[
          { label: "Tried", icon: "checkmark-circle" },
          { label: "To try", icon: "bookmark" },
        ]}
      />
      <>
        {loading ? (
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            <ListingsMap data={viewToTry ? filteredToTryRestaurants : filteredTriedRestaurants} />
            <ListingsBottomSheet
              isToggled={!!viewToTry}
              data={viewToTry ? filteredToTryRestaurants : filteredTriedRestaurants}
              renderRowItem={renderRowItem}
              ListHeaderComponent={() => (
                <Text style={styles.bottomSheetHeader}>
                  {viewToTry ? "To Try List" : "Tried List"}
                </Text>
              )}
              loadingData={loading}
              onEndReached={() => {}}
              contentContainerStyle={{ flex: 1 }}
              emptyDataMessage={viewToTry ? "No restaurants to try" : "No restaurants tried"}
            />
          </>
        )}
      </>
    </View>
  );
};

export default yourLists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  bottomSheetHeader: {
    textAlign: "center",
    fontSize: 18,
    paddingVertical: 5,
    paddingBottom: 25,
  },

  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
