import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ListingsScreenHeader from "@/components/ListingsScreenHeader";
import ListingsMemberItem from "@/components/ListingsMemberItem";
import ListingsRestaurantItem from "@/components/ListingsRestaurantItem";
import { useRouter } from "expo-router";
import { FetchUsersPayload, RestaurantItem, User } from "@/interfaces";
import * as Location from "expo-location";
import { FlatList } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { fetchUsers } from "@/firebase";
import { getAuth } from "firebase/auth";
import { distanceBetweenCoordinates } from "@/common-utils";
import { useAppStore } from "@/store/app-storage";

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const search = () => {
  const router = useRouter();
  const debounceTimeout = useRef<any>(null);
  const { authUser, userToTryRestaurants, userTriedRestaurants } = useAppStore();

  const [searchText, setSearchText] = useState("");
  const [viewMembers, setViewMembers] = useState(0);
  const [restaurantData, setRestaurantData] = useState<any>([]);
  const [filteredRestaurantData, setFilteredRestaurantData] = useState<any>([]);
  const [allUsersPagination, setAllUsersPagination] = useState<FetchUsersPayload | null>(null);
  const [filteredAllUser, setFilteredAllUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [flatListHeight, setFlatListHeight] = useState(0);
  const [fetchingMoreRestaurants, setFetchingMoreRestaurants] = useState(true);

  useEffect(() => {
    // Fetch all users
    fetchUsers().then((users) => {
      setAllUsersPagination(users);
      setFilteredAllUsers(users.data);
    });
  }, []);

  // TODO: Right now the only way to update user's current location is to switch to Members and
  // switch back to Restaurants. This is a temporary solution until we find a better way to update
  useEffect(() => {
    setLoading(true);
    setPageToken(null);
    setSearchText("");

    const isViewingMembers = !!viewMembers;

    if (!isViewingMembers) {
      fetchRestaurants();
    } else {
      setAllUsersPagination(allUsersPagination);
      setFilteredAllUsers(allUsersPagination?.data || []);
      setLoading(false);
    }
  }, [userToTryRestaurants, userTriedRestaurants]);

  // Update search results when search text changes
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
        if (!searchText) {
          setFilteredAllUsers(allUsersPagination?.data || []);
        } else {
          searchUsers(searchText);
        }
      }
    }, 275); // 275ms delay
  }, [searchText]);

  /**
   * The function `fetchRestaurants` is an asynchronous function that fetches restaurant data from the
   * Google Places API based on a search query and location, with the ability to fetch additional pages
   * of results using a page token.
   * @param {string | null} [pageToken] - The `pageToken` parameter in the `fetchRestaurants` function is
   * used to indicate whether to fetch the initial page of restaurants or the next page of restaurants.
   * If `pageToken` is not provided or is `null`, it means that the function is fetching the initial page
   * of restaurants.
   * @returns The `fetchRestaurants` function is making an asynchronous API call to fetch restaurant data
   * using the Google Places API. It constructs a request body with search parameters like text query,
   * rank preference, included type, and location bias. The function sends a POST request to the
   * specified URL with the constructed body and headers containing the API key.
   */
  const fetchRestaurants = async (pageToken?: string | null) => {
    if (!pageToken) console.log("Fetching restaurant...");
    if (pageToken) console.log("Fetching next page of restaurants...");
    let location = await Location.getCurrentPositionAsync({});
    const url = "https://places.googleapis.com/v1/places:searchText";
    const apiKey = GOOGLE_PLACES_API_KEY;

    const body: any = {
      textQuery: searchText || "food",
      rankPreference: "DISTANCE",
      includedType: "restaurant",
      locationBias: {
        circle: {
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          radius: 16093.4,
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
        setRestaurantData([]);
        setFilteredRestaurantData([]);
        return;
      }
      data = data.places.map(
        (restaurant: any) =>
          ({
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
            distance: distanceBetweenCoordinates(location.coords, {
              latitude: restaurant.location.latitude,
              longitude: restaurant.location.longitude,
            }),
          } as RestaurantItem)
      );
      setRestaurantData((prev: any) => (pageToken ? [...prev, ...data] : [...data]));
      setFilteredRestaurantData((prev: any) => (pageToken ? [...prev, ...data] : [...data]));
    } catch (error) {
      console.log("Error fetching restaurant: ", error);
    } finally {
      setLoading(false);
      setFetchingMoreRestaurants(false);
    }
  };

  const renderRowItem = ({ item }: any) => {
    if (item.email && item.email === getAuth().currentUser?.email) return null;
    const isToTry = userToTryRestaurants.includes(item.placeId);

    return (
      <>
        {viewMembers ? (
          <ListingsMemberItem key={item.id} user={item} />
        ) : (
          <ListingsRestaurantItem key={item.placeId} restaurant={item} isToTry={isToTry} />
        )}
      </>
    );
  };

  const endOfListReached = async () => {
    // If the list is shorter than the flatlist, don't fetch more data
    const data = viewMembers ? allUsersPagination?.data : restaurantData;
    const itemsHeight = data.length * 80;
    if (loading || data.length === 0 || itemsHeight < flatListHeight || fetchingMoreRestaurants)
      return;
    console.log("End of list reached");

    if (!viewMembers && pageToken) {
      setFetchingMoreRestaurants(true);
      fetchRestaurants(pageToken);
    } else {
      fetchUsers(allUsersPagination?.lastDoc).then((users) => {
        setAllUsersPagination(users);
      });
    }
  };

  const searchUsers = (searchText: string) => {
    if (!allUsersPagination) return;
    const filtered = allUsersPagination.data.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchText.toLowerCase())
    );
    if (filtered.length === 0) return;
    setFilteredAllUsers(filtered);
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
        showFilter={false}
      />

      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            {viewMembers ? (
              <FlatList
                contentContainerStyle={[
                  { paddingTop: 75 },
                  !filteredAllUser?.length && { flex: 1 },
                ]}
                data={filteredAllUser}
                renderItem={renderRowItem}
                keyExtractor={(user: User) => user.id}
                showsVerticalScrollIndicator={false}
                onLayout={(event) => setFlatListHeight(event.nativeEvent.layout.height)}
                onEndReached={() => endOfListReached()}
                onEndReachedThreshold={0.75}
                ListEmptyComponent={() => (
                  <View style={styles.loadingScreen}>
                    <Text style={{ color: Colors.gray, fontSize: Font.medium }}>
                      No members found
                    </Text>
                  </View>
                )}
              />
            ) : (
              <FlatList
                contentContainerStyle={[
                  { paddingTop: 75 },
                  !filteredRestaurantData.length && { flex: 1 },
                ]}
                data={filteredRestaurantData}
                renderItem={renderRowItem}
                keyExtractor={(item) => item.placeId}
                showsVerticalScrollIndicator={false}
                onLayout={(event) => setFlatListHeight(event.nativeEvent.layout.height)}
                onEndReached={() => endOfListReached()}
                onEndReachedThreshold={0.75}
                ListEmptyComponent={() => (
                  <View style={styles.loadingScreen}>
                    <Text style={{ color: Colors.gray, fontSize: Font.medium }}>
                      No restaurants found
                    </Text>
                  </View>
                )}
              />
            )}
          </>
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
