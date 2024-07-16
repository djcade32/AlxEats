import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import CustomAuthenticatedHeader from "@/components/CustomAuthenticatedHeader";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <CustomAuthenticatedHeader
              headerRight={
                <TouchableOpacity>
                  <Ionicons name="notifications-outline" size={22} color={Colors.black} />
                </TouchableOpacity>
              }
            />
          ),
        }}
      />
    </Stack>
  );
};

export default _layout;
