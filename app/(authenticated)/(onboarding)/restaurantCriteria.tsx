import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Font from "@/constants/Font";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { Criteria } from "@/interfaces";

const INIT_CRITERIA: Criteria[] = [
  { index: 1, criteria: "Taste" },
  { index: 2, criteria: "Service" },
  { index: 3, criteria: "Price" },
  { index: 4, criteria: "Overall Experience" },
  { index: 5, criteria: "Atmosphere" },
];

const restaurantCriteria = () => {
  const router = useRouter();
  const paramObj = useLocalSearchParams() as any;

  const [data, setData] = useState<Criteria[]>(INIT_CRITERIA);

  // This function is called when the user finishes dragging the list. It updates the index of each item in the list.
  const handleDragEnd = (oldData: Criteria[]) => {
    const newData: Criteria[] = [];
    oldData.forEach((item, index) => {
      newData.push({ index: index + 1, criteria: item.criteria });
    });

    setData(newData);
  };

  const handleContinuePressed = async () => {
    router.push({
      pathname: "(onboarding)/getStarted",
      params: { ...paramObj, criteria: JSON.stringify(data) },
    });
  };

  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<Criteria>) => {
    return (
      <ScaleDecorator activeScale={0.75}>
        <TouchableOpacity
          onLongPress={drag}
          style={[
            styles.itemContainer,
            { backgroundColor: isActive ? Colors.secondary : Colors.primary },
          ]}
        >
          <Text
            style={{ fontSize: Font.medium, color: "white" }}
          >{`${item.index}. ${item.criteria}`}</Text>
          <Ionicons name="menu-outline" size={24} color={"white"} />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.directions}>
        Get hands-on with your ranking! Hold and drag to prioritize what truly matters when
        selecting restaurants.
      </Text>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => handleDragEnd(data)}
        keyExtractor={(item) => item.index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 20 }}
        style={{ paddingHorizontal: 15 }}
      />
      <View style={{ flex: 1 }} />
      <CustomButton
        text="Continue"
        buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
        textStyle={[styles.btnText, { color: "white" }]}
        onPress={handleContinuePressed}
      />
    </View>
  );
};

export default restaurantCriteria;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 100,
  },
  directions: {
    fontSize: Font.small,
    marginVertical: 20,
    textAlign: "center",
    color: Colors.black,
  },
  btnContainer: {
    marginTop: 35,
    borderRadius: 25,
    paddingVertical: 10,
  },
  btnText: {
    fontSize: 18,
  },

  itemContainer: {
    padding: 20,
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderColor: Colors.gray,
  },
});
