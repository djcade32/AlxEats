import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import ListingsMap from "@/components/ListingsMap";
import { restaurantData as RESTAURANT_DATA } from "@/assets/data/dummyData";
import ListingsScreenHeader from "@/components/ListingsScreenHeader";
import ListingsRestaurantItem from "@/components/ListingsRestaurantItem";

const yourLists = () => {
  const [searchText, setSearchText] = useState("");
  const [viewToTry, setViewToTry] = useState(0);
  const [data, setData] = useState<any>(RESTAURANT_DATA);

  // Set data to show  based on toggle value
  useEffect(() => {
    setData(RESTAURANT_DATA);
  }, [viewToTry]);

  const renderRowItem = ({ item }: any) => {
    return <ListingsRestaurantItem restaurant={item} ranking={!viewToTry} />;
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
      <ListingsMap data={RESTAURANT_DATA} />
      <ListingsBottomSheet
        isToggled={!!viewToTry}
        data={data}
        renderRowItem={renderRowItem}
        ListHeaderComponent={() => (
          <Text style={styles.bottomSheetHeader}>{viewToTry ? "To Try List" : "Tried List"}</Text>
        )}
      />
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
});
