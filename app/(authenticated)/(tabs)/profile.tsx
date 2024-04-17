import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { TouchableOpacity } from "react-native-gesture-handler";

const profile = () => {
  const { isLoaded, signOut } = useAuth();
  const handleSignout = async () => {
    if (!isLoaded) return;
    try {
      await signOut();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handleSignout}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({});
