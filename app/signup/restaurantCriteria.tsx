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
  { index: 1, critera: "Food Quality" },
  { index: 2, critera: "Service" },
  { index: 3, critera: "Price" },
  { index: 4, critera: "Overall Experience" },
  { index: 5, critera: "Atmosphere" },
];

const restaurantCriteria = () => {
  const router = useRouter();
  const { emailParam } = useLocalSearchParams() as {
    emailParam: string;
  };

  const [data, setData] = useState(INIT_CRITERIA);

  // This function is called when the user finishes dragging the list. It updates the index of each item in the list.
  const handleDragEnd = (oldData: Criteria[]) => {
    const newData: Criteria[] = [];
    oldData.forEach((item, index) => {
      newData.push({ index: index + 1, critera: item.critera });
    });

    setData(newData);
  };

  const handleContinuePressed = async () => {
    const user = {
      email: emailParam,
      criteria: JSON.stringify(data),
    };

    router.push({
      pathname: "/signup/personalInfo",
      params: user as any,
    });
  };

  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<Criteria>) => {
    return (
      <ScaleDecorator activeScale={0.75}>
        <TouchableOpacity
          onLongPress={drag}
          style={{
            padding: 20,
            backgroundColor: isActive ? Colors.secondary : Colors.primary,
            borderWidth: 0.5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 10,
            borderColor: Colors.gray,
          }}
        >
          <Text
            style={{ fontSize: Font.medium, color: "white" }}
          >{`${item.index}. ${item.critera}`}</Text>
          <Ionicons name="menu-outline" size={24} color={"white"} />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  }, []);
  return (
    <View style={{ flex: 1, paddingHorizontal: 30 }}>
      <Text style={styles.directions}>
        Rank what matters most to you when choosing restaurants.
      </Text>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => handleDragEnd(data)}
        keyExtractor={(item) => item.index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 20, paddingBottom: 50 }}
        style={{ paddingHorizontal: 15, marginTop: 40 }}
      />
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
  directions: {
    fontSize: Font.small,
    marginTop: 45,
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
});
