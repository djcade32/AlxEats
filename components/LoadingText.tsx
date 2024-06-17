import { StyleSheet, Text, TextProps, View, ViewProps } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";

interface LoadingTextProps {
  title: string;
  loading: boolean;
  textStyle: TextProps["style"];
  containerStyle: ViewProps["style"];
}

const LoadingText = ({ title, loading, textStyle, containerStyle }: LoadingTextProps) => {
  return (
    <View>
      {!loading ? (
        <Text style={textStyle}>{title}</Text>
      ) : (
        <View style={[styles.loadingView, containerStyle]} />
      )}
    </View>
  );
};

export default LoadingText;

const styles = StyleSheet.create({
  loadingView: {
    backgroundColor: Colors.lightGray,
    borderRadius: 15,
  },
});
