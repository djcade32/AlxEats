import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Font from "@/constants/Font";
import Colors from "@/constants/Colors";

interface RatingComponentProps {
  criteria: string;
  selectedOption: { [key: string]: number | null };
  setSelectedOptions: (value: any) => void;
}

const options = [
  { color: "#F19797", label: "Poor" },
  { color: "#F4D49C", label: "Okay" },
  { color: "#A3D2CA", label: "Great!" },
];

const RatingComponent = ({
  criteria,
  selectedOption,
  setSelectedOptions,
}: RatingComponentProps) => {
  const determineSelectedOption = (criteria: string, option: number) => {
    return selectedOption[criteria] === option;
  };

  return (
    <View style={{}}>
      <Text style={styles.ratingComponentTitle}>{criteria}</Text>
      <View style={styles.optionsContainer}>
        {options.map(({ color }, index) => (
          <View key={index} style={{ alignItems: "center", gap: 5 }}>
            <TouchableOpacity
              style={[styles.ratingComponentOptions, { backgroundColor: color }]}
              onPress={() =>
                setSelectedOptions((prev: any) => ({
                  ...prev,
                  [criteria]: index + 1,
                }))
              }
            >
              {determineSelectedOption(criteria, index + 1) && (
                <Ionicons name="checkmark" size={35} color={"white"} />
              )}
            </TouchableOpacity>
            <Text style={{ color: Colors.darkGray, fontSize: Font.small }}>
              {options[index].label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RatingComponent;

const styles = StyleSheet.create({
  ratingComponentTitle: {
    fontSize: Font.medium,
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
    padding: 10,
  },

  ratingComponentOptions: {
    borderRadius: 60 / 2,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});
