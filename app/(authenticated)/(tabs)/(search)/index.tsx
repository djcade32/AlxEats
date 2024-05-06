import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import ListingsMap from "@/components/ListingsMap";
import ListingsScreenHeader from "@/components/ListingsScreenHeader";
import { postData as USER_DATA } from "@/assets/data/dummyData";
import { restaurantData as RESTAURANT_DATA } from "@/assets/data/dummyData";
import ListingsMemberItem from "@/components/ListingsMemberItem";
import ListingsRestaurantItem from "@/components/ListingsRestaurantItem";
import { useRouter } from "expo-router";

const search = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [viewMembers, setViewMembers] = useState(0);
  const [data, setData] = useState<any>(RESTAURANT_DATA);

  // Set data to show  based on toggle value
  useEffect(() => {
    setData(viewMembers ? USER_DATA : RESTAURANT_DATA);
  }, [viewMembers]);

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
      />
      <ListingsMap data={RESTAURANT_DATA} />
      <ListingsBottomSheet
        isToggled={!!viewMembers}
        data={data}
        renderRowItem={renderRowItem}
        mapButtonSeen={!viewMembers}
        ListHeaderComponent={() => (
          <Text style={styles.bottomSheetHeader}>{!!viewMembers ? "" : "Restaurants List"}</Text>
        )}
        contentContainerStyle={!!viewMembers && { paddingTop: 25 }}
        enableContentPanningGesture={!viewMembers}
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
