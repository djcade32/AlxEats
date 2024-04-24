import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Cuisines from "@/data/Cuisines";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "./CustomTextInput";
import Font from "@/constants/Font";

interface FavoriteCuisineBottomSheetProps {
  bottomSheetOpened: boolean;
  setBottomSheetOpened: (opened: boolean) => void;
  setSelectedCuisine: (cuisine: string) => void;
  selectedCuisine: string;
}

const FavoriteCuisineBottomSheet = ({
  bottomSheetOpened,
  setBottomSheetOpened,
  setSelectedCuisine,
  selectedCuisine,
}: FavoriteCuisineBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["1%", "100%"], []);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (bottomSheetOpened) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
      setSearchText("");
    }
  }, [bottomSheetOpened]);

  useEffect(() => {
    if (selectedCuisine) {
      setBottomSheetOpened(false);
    }
  }, [selectedCuisine]);

  const renderItem = useCallback(
    ({ item }: any) => (
      <TouchableOpacity
        onPress={() => {
          setSelectedCuisine(item);
          setSearchText("");
        }}
        style={{ backgroundColor: selectedCuisine === item ? Colors.primary : "white" }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: Font.medium,
            paddingVertical: 10,
            color: selectedCuisine === item ? "white" : Colors.black,
          }}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ),
    [selectedCuisine]
  );
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: Colors.gray }}
      enablePanDownToClose={true}
      onChange={(index) => setBottomSheetOpened(index === 1)}
    >
      <View
        style={{
          alignItems: "center",
          paddingBottom: 10,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: Colors.gray,
        }}
      >
        <CustomTextInput
          name="search"
          placeholder="Search cuisine"
          icon={<Ionicons name="search" size={24} color={Colors.gray} />}
          value={searchText}
          onChange={setSearchText}
          customStyles={{ width: "75%" }}
        />
      </View>
      <BottomSheetFlatList
        data={searchText ? Cuisines.filter((cuisine) => cuisine.includes(searchText)) : Cuisines}
        keyExtractor={(i) => i}
        renderItem={(item) => renderItem(item)}
        contentInset={{ bottom: 10 }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
              width: "80%",
              alignSelf: "center",
            }}
          />
        )}
      />
    </BottomSheet>
  );
};

export default FavoriteCuisineBottomSheet;

const styles = StyleSheet.create({});
