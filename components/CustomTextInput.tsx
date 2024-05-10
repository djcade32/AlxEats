import { Keyboard, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Error as ErrorType } from "@/interfaces";
import { hasError } from "@/common-utils";

interface CustomTextInputProps {
  name: string;
  placeholder: string;
  icon?: React.ReactNode;
  value: string;
  onChange?: (text: string) => void;
  customStyles?: StyleProp<ViewStyle>;
  password?: boolean;
  errors?: ErrorType[];
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  maxLength?: number;
  setErrors?: (error: ErrorType[]) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  showErrorMessage?: boolean;
}

const CustomTextInput = ({
  name,
  icon,
  placeholder,
  customStyles,
  password,
  onChange,
  value,
  errors,
  keyboardType,
  maxLength,
  setErrors,
  disabled,
  autoFocus,
  showErrorMessage = true,
}: CustomTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (errors && !setErrors) {
      throw new Error(
        "If errors prop is set you must provide setErrors prop in CustomTextInput component"
      );
    }
    if (errors) {
      setIsError(hasError(errors, name));
    }
  }, [errors]);

  const getBorderColor = () => {
    // if (isError && !isFocused) {
    //   return Colors.error;
    // }
    if (isError) {
      return Colors.error;
    }
    return isFocused ? Colors.primary : Colors.gray;
  };

  const handleTextChange = (text: string) => {
    onChange && onChange(text);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container, { borderColor: getBorderColor() }, customStyles]}>
        {icon}
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray}
          style={[styles.textInput, { color: disabled ? Colors.gray : Colors.black }]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={Colors.primary}
          secureTextEntry={password && !isSecure}
          onChangeText={(text) => handleTextChange(text)}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onChange={(text) => {
            if (text.nativeEvent.text === value) return;
            setErrors && errors && setErrors([...errors.filter((e) => e.field !== name)]);
          }}
          editable={!disabled}
          autoFocus={autoFocus}
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

      {showErrorMessage && (
        <View style={{ minHeight: 20, paddingHorizontal: 5 }}>
          {isError && errors && hasError(errors, name) && (
            <Text style={{ fontSize: 12, color: Colors.error, marginTop: 5 }}>
              {errors.find((e) => e.field === name)?.message}
            </Text>
          )}
        </View>
      )}
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
    flex: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
  },
});
