import { Keyboard, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { Ionicons } from "@expo/vector-icons";

interface CustomTextInputProps {
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange?: (text: string) => void;
  customStyles?: StyleProp<ViewStyle>;
  password?: boolean;
  error?: boolean;
}

const CustomTextInput = ({
  icon,
  placeholder,
  customStyles,
  password,
  onChange,
  value,
  error,
}: CustomTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(false);
  const [isError, setIsError] = useState(error || false);

  useEffect(() => {
    if (error) {
      setIsError(error);
    }
  }, [error]);

  const getBorderColor = () => {
    if (isError && !isFocused) {
      return Colors.error;
    }
    return isFocused ? Colors.primary : Colors.gray;
  };

  const handleTextChange = (text: string) => {
    if (isError) {
      setIsError(false);
    }
    onChange && onChange(text);
  };
  return (
    <View style={[styles.container, { borderColor: getBorderColor() }, customStyles]}>
      {icon}
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        style={[styles.textInput]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor={Colors.primary}
        secureTextEntry={password && !isSecure}
        onChangeText={(text) => handleTextChange(text)}
      />
      <TouchableWithoutFeedback onPress={() => setIsSecure(!isSecure)}>
        {password && (
          <Ionicons
            name={isSecure ? "eye" : "eye-off-outline"}
            size={24}
            color={Colors.gray}
            style={{ paddingRight: 10 }}
          />
        )}
      </TouchableWithoutFeedback>
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
