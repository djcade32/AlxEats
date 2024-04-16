import { Keyboard, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";

interface CustomTextInputProps {
  placeholder: string;
  icon: React.ReactNode;
  customStyles?: StyleProp<ViewStyle>;
}

const CustomTextInput = ({ icon, placeholder, customStyles }: CustomTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View
      style={[
        styles.container,
        { borderColor: isFocused ? Colors.primary : Colors.gray },
        customStyles,
      ]}
    >
      {icon}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        style={[styles.textInput]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor={Colors.primary}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 15,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: Colors.black,
  },
});
