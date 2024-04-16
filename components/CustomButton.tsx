import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

interface CustomButtonProps {
  text: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  onPress?: () => void;
}

const CustomButton = ({ text, buttonStyle, textStyle, icon, onPress }: CustomButtonProps) => {
  return (
    <TouchableOpacity style={[buttonStyle, styles.container]} onPress={onPress}>
      <View style={{ position: "absolute", left: 23 }}>{icon}</View>
      <Text style={[textStyle, { textAlign: "center" }]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
  },
});
