import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface MapButtonProps {
  onPress: () => void;
}

const MapButton = ({ onPress }: MapButtonProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.primary,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          width: 110,
          height: 40,
          flexDirection: "row",
          gap: 5,
        }}
        onPress={onPress}
      >
        <Ionicons name="map" size={24} color="white" />
        <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>Map</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapButton;

const styles = StyleSheet.create({
  container: {
    height: 40,
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
