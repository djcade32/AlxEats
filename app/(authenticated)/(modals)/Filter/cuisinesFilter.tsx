import { StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import Cuisines from "@/data/Cuisines";
import CustomTextInput from "@/components/CustomTextInput";
import { useFilterStore } from "@/store/filter-storage";

const cuisinesFilter = () => {
  const router = useRouter();
  const { restaurantListFilter } = useFilterStore();
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredCuisines, setFilteredCuisines] = useState<string[]>(Cuisines);
  const currentCuisineFilter = useFilterStore((state) => state.cuisineFilter);

  useEffect(() => {
    setCuisines(currentCuisineFilter);
  }, [currentCuisineFilter]);

  useEffect(() => {
    if (searchText === "") {
      setFilteredCuisines(Cuisines);
      return;
    }
    const filteredCuisines = Cuisines.filter((c) =>
      c.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCuisines(filteredCuisines);
  }, [searchText]);

  const saveCuisines = () => {
    useFilterStore.getState().updateCuisineFilter(cuisines);
    router.back();
    setSearchText("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          title: "Cuisines",
          headerTitleStyle: { fontFamily: "nm-b", fontSize: Font.medium },
          headerLeft: () => (
            <View style={styles.headerIconContainer}>
              <TouchableOpacity
                onPress={() => {
                  router.back();
                  setSearchText("");
                }}
              >
                <Ionicons name="chevron-back-circle-outline" size={30} color={Colors.black} />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerIconContainer}>
              <TouchableOpacity onPress={saveCuisines}>
                <Text style={{ color: Colors.primary, fontSize: 18 }}>Save</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>
      <View>
        <View
          style={{
            height: 50,
            backgroundColor: "white",
            paddingHorizontal: 12,
            paddingBottom: 15,
            marginTop: 15,
            flexDirection: "row",
            gap: 5,
          }}
        >
          <CustomTextInput
            name="search"
            placeholder="Search cuisine"
            icon={<Ionicons name="search" size={18} color={Colors.gray} />}
            value={searchText}
            onChange={setSearchText}
            customStyles={styles.searchInput}
            style={{ flex: 1 }}
            showErrorMessage={false}
          />
          <View style={styles.headerIconContainer}>
            <TouchableOpacity onPress={() => setCuisines([])}>
              <Text style={{ color: cuisines.length ? Colors.primary : Colors.gray, fontSize: 18 }}>
                Unselect
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          contentContainerStyle={{ gap: 15, paddingBottom: 50 }}
          data={filteredCuisines}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 12,
              }}
              onPress={() =>
                setCuisines((prev) =>
                  prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
                )
              }
            >
              <Text style={styles.textSmall}>{item}</Text>

              <MaterialCommunityIcons
                name={cuisines.includes(item) ? "checkbox-intermediate" : "checkbox-blank-outline"}
                size={30}
                color={cuisines.includes(item) ? Colors.primary : Colors.gray}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default cuisinesFilter;

const styles = StyleSheet.create({
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },

  textSmall: {
    fontSize: 18,
    color: Colors.black,
  },

  searchInput: {
    backgroundColor: "white",
    flex: 1,
  },
});
