import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { getAuth, signOut } from "firebase/auth";
import { useAppStore } from "@/store/app-storage";

const settings = () => {
  const { clearStore } = useAppStore();
  const router = useRouter();
  const signUserOut = async () => {
    try {
      await signOut(getAuth());
      // clearStore();
    } catch (error) {
      console.log("ERROR: There was a problem signing out: ", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          title: "Settings",
          headerTitleStyle: { fontFamily: "nm-b", fontSize: Font.medium },
          headerLeft: () => (
            <View style={styles.headerIconContainer}>
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <Ionicons name="chevron-back-circle-outline" size={30} color={Colors.black} />
              </TouchableOpacity>
            </View>
          ),
        }}
      ></Stack.Screen>
      <TouchableOpacity onPress={signUserOut}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },

  textSmall: {
    fontSize: 18,
    color: Colors.black,
  },

  searchInput: {
    backgroundColor: "white",
    flex: 1,
  },
});
