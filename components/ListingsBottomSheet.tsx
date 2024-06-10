import { ActivityIndicator, StyleSheet, Text, View, ViewProps } from "react-native";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetFlatList, BottomSheetFlatListMethods } from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";

import MapButton from "./MapButton";
import Font from "@/constants/Font";

const useDeepCompareEffect = (callback: any, dependencies: any) => {
  const currentDependenciesRef = useRef();

  if (!areDependenciesEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  useEffect(callback, [currentDependenciesRef.current]);

  function areDependenciesEqual(oldDeps: any, newDeps: any) {
    if (!oldDeps || !newDeps) return false;
    if (oldDeps.length !== newDeps.length) return false;

    for (let i = 0; i < oldDeps.length; i++) {
      if (JSON.stringify(oldDeps[i]) !== JSON.stringify(newDeps[i])) {
        return false;
      }
    }

    return true;
  }
};

interface ListingsBottomSheetProps {
  data: any;
  isToggled: boolean;
  renderRowItem: ({ item }: any) => JSX.Element;
  mapButtonSeen?: boolean;
  ListHeaderComponent?: () => JSX.Element;
  enableContentPanningGesture?: boolean;
  contentContainerStyle?: ViewProps["style"];
  loadingData: boolean;
  onEndReached: () => void;
  emptyDataMessage?: string;
}

const ListingsBottomSheet = ({
  data,
  isToggled,
  renderRowItem,
  mapButtonSeen = true,
  ListHeaderComponent,
  enableContentPanningGesture = true,
  contentContainerStyle,
  loadingData = true,
  onEndReached,
  emptyDataMessage,
}: ListingsBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetFlatListRef = useRef<BottomSheetFlatListMethods>(null);
  const snapPoints = useMemo(() => ["10%", "100%"], []);
  const [refresh, setRefresh] = useState(0);
  const [bottomSheetOpened, setBottomSheetOpened] = useState(true);
  const [loading, setLoading] = useState(false);

  const showMap = () => {
    bottomSheetRef.current?.collapse();
    if (data.length !== 0) {
      bottomSheetFlatListRef.current?.scrollToIndex({ index: 0 });
    }
    setRefresh(refresh + 1);
  };

  // Open or close bottom sheet depending on toggle value
  useEffect(() => {
    setLoading(true);
    if (!bottomSheetOpened && isToggled) {
      bottomSheetRef.current?.expand();
      bottomSheetRef.current;
    }
    setLoading(false);
  }, [isToggled]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: Colors.gray, width: 100 }}
      style={styles.sheetContainer}
      onChange={(index) => {
        setBottomSheetOpened(index === 1);
      }}
      enableContentPanningGesture={enableContentPanningGesture && !loadingData}
    >
      {loading ? (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <>
          <BottomSheetFlatList
            ref={bottomSheetFlatListRef}
            data={data}
            style={{ flex: 1, backgroundColor: "white" }}
            showsVerticalScrollIndicator={false}
            renderItem={renderRowItem}
            contentContainerStyle={contentContainerStyle}
            ListHeaderComponent={ListHeaderComponent}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={styles.loadingScreen}>
                <Text style={{ color: Colors.gray, fontSize: Font.medium }}>
                  {emptyDataMessage || "No data available"}
                </Text>
              </View>
            }
          />
          {mapButtonSeen && <MapButton onPress={showMap} />}
        </>
      )}
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
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
