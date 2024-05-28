import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import ListingsMap from "@/components/ListingsMap";
import ListingsScreenHeader from "@/components/ListingsScreenHeader";
import { postData as USER_DATA } from "@/assets/data/dummyData";
import ListingsMemberItem from "@/components/ListingsMemberItem";
import ListingsRestaurantItem from "@/components/ListingsRestaurantItem";
import { useRouter } from "expo-router";
import Geolocation from "@react-native-community/geolocation";
import { Coordinate, RestaurantItem } from "@/interfaces";
import * as Location from "expo-location";
import { FlatList } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const search = () => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [searchText, setSearchText] = useState("");
  const [viewMembers, setViewMembers] = useState(0);
  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const debounceTimeout = useRef<any>(null);
  const [flatListHeight, setFlatListHeight] = useState(0);
  const [dataHeight, setDataHeight] = useState(0);

  // TODO: Right now the only way to update user's current location is to switch to Members and
  // switch back to Restaurants. This is a temporary solution until we find a better way to update
  useEffect(() => {
    setLoading(true);
    setPageToken(null);
    setSearchText("");
    setPageToken(null);

    const isViewingMembers = !!viewMembers;

    if (!isViewingMembers) {
      fetchRestaurants();
    } else {
      setData(USER_DATA);
      setFilteredData(USER_DATA);
      setLoading(false);
    }
  }, [viewMembers]);

  useEffect(() => {
    if (loading) return;
    setPageToken(null);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (!viewMembers) {
        fetchRestaurants();
      } else {
        // fetchMembers();
      }
    }, 500); // 500ms delay
  }, [searchText]);

  const fetchRestaurants = async (pageToken?: string | null) => {
    if (!pageToken) console.log("Fetching restaurant...");
    if (pageToken) console.log("Fetching next page of restaurants...");
    let location = await Location.getCurrentPositionAsync({});
    const url = "https://places.googleapis.com/v1/places:searchText";
    const apiKey = GOOGLE_PLACES_API_KEY;

    const body: any = {
      textQuery: searchText || "restaurant",
      rankPreference: "DISTANCE",
      includedType: "restaurant",
      locationBias: {
        circle: {
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          radius: 500,
          // radius: 16093.4,
        },
      },
    };
    if (pageToken) {
      body.pageToken = pageToken;
    }

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName.text,places.types,places.nationalPhoneNumber,places.formattedAddress,places.addressComponents,places.location,places.websiteUri,places.regularOpeningHours.openNow,places.priceLevel,places.primaryType,nextPageToken",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
      let data = await response.json();
      setPageToken(data?.nextPageToken);

      if (!data || !data.places) {
        console.log("No data returned");
        setData([]);
        setFilteredData([]);
        return;
      }
      data = data.places.map((restaurant: any) => ({
        placeId: restaurant.id,
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
        addressComponents: JSON.stringify(restaurant.addressComponents),
      }));

      setData((prev: any) => (pageToken ? [...prev, ...data] : data));
      setFilteredData((prev: any) => (pageToken ? [...prev, ...data] : data));
    } catch (error) {
      console.log("Error fetching restaurant: ", error);
    } finally {
      setLoading(false);
    }
  };

  const renderRowItem = ({ item }: any) => {
    return (
      <>
        {viewMembers ? (
          <ListingsMemberItem
            key={item.username}
            user={item}
            onPress={() => router.push("/(authenticated)/(tabs)/(search)/profile/1")}
          />
        ) : (
          <ListingsRestaurantItem key={item.placeId} restaurant={item} />
        )}
      </>
    );
  };

  const endOfListReached = async () => {
    // If the list is shorter than the flatlist, don't fetch more data
    const itemsHeight = data.length * 80;
    if (loading || data.length === 0 || itemsHeight < flatListHeight) return;
    console.log("End of list reached");

    if (!viewMembers) {
      fetchRestaurants(pageToken);
    } else {
      // fetchMembers();
    }
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

      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            contentContainerStyle={{ paddingTop: 75, flex: 1 }}
            data={filteredData}
            renderItem={renderRowItem}
            keyExtractor={(item) => item.placeId}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={(_, h) => setDataHeight(h)}
            onLayout={(event) => setFlatListHeight(event.nativeEvent.layout.height)}
            onEndReached={() => endOfListReached()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => (
              <View style={styles.loadingScreen}>
                <Text style={{ color: Colors.gray, fontSize: Font.medium }}>
                  No restaurants found
                </Text>
              </View>
            )}
          />
        )}
      </View>
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

  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
