import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ButtonProps {
  text: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

const Button = ({ text, buttonStyle, textStyle, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({});
