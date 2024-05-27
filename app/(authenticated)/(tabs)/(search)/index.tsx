import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import ListingsMap from "@/components/ListingsMap";
import ListingsScreenHeader from "@/components/ListingsScreenHeader";
import { postData as USER_DATA } from "@/assets/data/dummyData";
import ListingsMemberItem from "@/components/ListingsMemberItem";
import ListingsRestaurantItem from "@/components/ListingsRestaurantItem";
import { useRouter } from "expo-router";
import Geolocation from "@react-native-community/geolocation";
import { Coordinate, RestaurantItem } from "@/interfaces";

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const search = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [viewMembers, setViewMembers] = useState(0);
  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageToken, setPageToken] = useState<string | null>(null);

  // TODO: Right now the only way to update user's current location is to switch to Members and
  // switch back to Restaurants. This is a temporary solution until we find a better way to update
  useEffect(() => {
    setLoading(true);
    if (!viewMembers) {
      Geolocation.getCurrentPosition(
        (info: any) => {
          setLocation({ latitude: info.coords.latitude, longitude: info.coords.longitude });
          fetchNearbyRestaurants(info.coords.latitude, info.coords.longitude);
        },
        (error: any) => console.log("Error getting user location: ", error),
        { maximumAge: 600000 }
      );
    } else {
      setData(USER_DATA);
      setFilteredData(USER_DATA);
      setLoading(false);
    }
    setLoading(false);
  }, [viewMembers]);

  useEffect(() => {
    if (loading) return;
    if (searchText === "") {
      setFilteredData(data);
      return;
    }
    setFilteredData(
      data.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [searchText]);

  const fetchRestaurant = async (placeId: number) => {
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const apiKey = GOOGLE_PLACES_API_KEY;

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "displayName.text,types,nationalPhoneNumber,formattedAddress,addressComponents,location,websiteUri,regularOpeningHours.openNow,priceLevel,primaryType",
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

  const fetchNearbyRestaurants = async (latitude: number, longitude: number) => {
    try {
      // Fetching IDs of nearby restaurants
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      setPageToken(data.next_page_token);
      // Fetching details of each restaurant
      const restaurantPromises = data.results.map(async (place: any) => {
        const restaurant = await fetchRestaurant(place.place_id);
        if (!restaurant) return;

        const newRestaurant: RestaurantItem = {
          coordinate: {
            latitude: restaurant.location.latitude,
            longitude: restaurant.location.longitude,
          },
          name: restaurant.displayName.text,
          openNow: restaurant.regularOpeningHours?.openNow,
          price: restaurant.priceLevel,
          types: restaurant.types,
          primaryType: restaurant.primaryType,
          address: restaurant.formattedAddress,
          phoneNumber: restaurant.nationalPhoneNumber,
          website: restaurant.websiteUri,
        };
        return newRestaurant;
      });
      // Wait for all promises to resolve
      const resolvedRestaurants: RestaurantItem[] = await Promise.all(restaurantPromises);
      // Filter out any null values
      const restaurants: RestaurantItem[] = resolvedRestaurants.filter(
        (restaurant) => restaurant !== null
      );
      setData(restaurants);
      setFilteredData(restaurants);
    } catch (error) {
      console.log("Error fetching nearby restaurants: ", error);
    }
  };

  const fetchMoreNearbyRestaurants = async (pageToken: string | null) => {
    setLoading(true);
    if (viewMembers || loading || !pageToken) return;
    console.log("Fetching more nearby restaurants");
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${pageToken}&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      setPageToken(data.next_page_token);
      // Fetching details of each restaurant
      const restaurantPromises = data.results.map(async (place: any) => {
        const restaurant = await fetchRestaurant(place.place_id);
        if (!restaurant) return;

        const newRestaurant: RestaurantItem = {
          coordinate: {
            latitude: restaurant.location.latitude,
            longitude: restaurant.location.longitude,
          },
          name: restaurant.displayName.text,
          openNow: restaurant.regularOpeningHours?.openNow,
          price: restaurant.priceLevel,
          types: restaurant.types,
          primaryType: restaurant.primaryType,
          address: restaurant.formattedAddress,
          phoneNumber: restaurant.nationalPhoneNumber,
          website: restaurant.websiteUri,
        };
        return newRestaurant;
      });
      // Wait for all promises to resolve
      const resolvedRestaurants: RestaurantItem[] = await Promise.all(restaurantPromises);
      // Filter out any null values
      const restaurants: RestaurantItem[] = resolvedRestaurants.filter(
        (restaurant) => restaurant !== null
      );
      setData((prev: any) => [...prev, ...restaurants]);
      setFilteredData((prev: any) => [...prev, ...restaurants]);
    } catch (error) {
      console.log("Error fetching more nearby restaurants: ", error);
    } finally {
      setLoading(false);
    }
  };

  const renderRowItem = ({ item }: any) => {
    return (
      <>
        {viewMembers ? (
          <ListingsMemberItem
            user={item}
            onPress={() => router.push("/(authenticated)/(tabs)/(search)/profile/1")}
          />
        ) : (
          <ListingsRestaurantItem restaurant={item} />
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <ListingsScreenHeader
        searchText={searchText}
        setSearchText={setSearchText}
        activeToggle={viewMembers}
        setActiveToggle={setViewMembers}
        switchValues={[
          { label: "Restaurants", icon: "storefront" },
          { label: "Members", icon: "person" },
        ]}
        showFilter={!viewMembers}
      />
      <ListingsMap data={filteredData} />
      <ListingsBottomSheet
        isToggled={!!viewMembers}
        data={filteredData}
        renderRowItem={renderRowItem}
        mapButtonSeen={!viewMembers}
        ListHeaderComponent={() => (
          <Text style={styles.bottomSheetHeader}>
            {!!viewMembers ? "" : `${data.length} Restaurants`}
          </Text>
        )}
        contentContainerStyle={!!viewMembers && { paddingTop: 25 }}
        enableContentPanningGesture={!viewMembers}
        loadingData={loading}
        onEndReached={() => fetchMoreNearbyRestaurants(pageToken)}
      />
    </View>
  );
};

export default search;

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
});
