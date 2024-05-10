import { StyleSheet, Text } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetFlatList, BottomSheetFlatListMethods } from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";

import MapButton from "./MapButton";

interface ListingsBottomSheetProps {
  data: any;
  isToggled: boolean;
  renderRowItem: ({ item }: any) => JSX.Element;
  mapButtonSeen?: boolean;
  ListHeaderComponent?: () => JSX.Element;
  enableContentPanningGesture?: boolean;
  contentContainerStyle?: any;
}

const ListingsBottomSheet = ({
  data,
  isToggled,
  renderRowItem,
  mapButtonSeen = true,
  ListHeaderComponent,
  enableContentPanningGesture = true,
  contentContainerStyle,
}: ListingsBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetFlatListRef = useRef<BottomSheetFlatListMethods>(null);
  const snapPoints = useMemo(() => ["10%", "100%"], []);
  const [refresh, setRefresh] = useState(0);
  const [bottomSheetOpened, setBottomSheetOpened] = useState(true);

  const showMap = () => {
    bottomSheetRef.current?.collapse();
    bottomSheetFlatListRef.current?.scrollToIndex({ index: 0 });
    setRefresh(refresh + 1);
  };

  // Open or close bottom sheet depending on toggle value
  useEffect(() => {
    if (!bottomSheetOpened && isToggled) {
      bottomSheetRef.current?.expand();
      bottomSheetRef.current;
    }
  }, [isToggled]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: Colors.gray, width: 100 }}
      style={[styles.sheetContainer]}
      onChange={(index) => {
        setBottomSheetOpened(index === 1);
      }}
      enableContentPanningGesture={enableContentPanningGesture}
    >
      <BottomSheetFlatList
        ref={bottomSheetFlatListRef}
        data={data}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        renderItem={renderRowItem}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={ListHeaderComponent}
      />
      {/* {mapButtonSeen && <MapButton onPress={showMap} />} */}
    </BottomSheet>
  );
};

export default ListingsBottomSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 4,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
});
