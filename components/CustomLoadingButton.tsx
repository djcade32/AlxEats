import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";

interface CustomButtonProps {
  text: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  onPress?: () => void;
  loading: boolean;
  disabled?: boolean;
}

const CustomLoadingButton = ({
  text,
  buttonStyle,
  textStyle,
  icon,
  onPress,
  loading,
  disabled,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[buttonStyle, styles.container, disabled && { backgroundColor: Colors.gray }]}
      onPress={onPress}
      disabled={disabled}
    >
      {!loading ? (
        <>
          <View style={{ position: "absolute", left: 23 }}>{icon}</View>
          <Text style={[textStyle, { textAlign: "center" }]}>{text}</Text>
        </>
      ) : (
        <ActivityIndicator size="small" color={"white"} />
      )}
    </TouchableOpacity>
  );
};

export default CustomLoadingButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
  },
});
