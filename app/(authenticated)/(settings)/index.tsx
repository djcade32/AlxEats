import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { getAuth, signOut } from "firebase/auth";
import { useAppStore } from "@/store/app-storage";
import CustomButton from "@/components/CustomButton";

const index = () => {
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
      <View style={styles.sectionsContainer}>
        <View>
          <Text style={styles.sectionTitle}>General</Text>
          <TouchableOpacity style={styles.sectionTab}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Ionicons name="lock-closed-outline" size={25} color={Colors.black} />
              <Text>Email & Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sectionTab}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Ionicons name="notifications-outline" size={25} color={Colors.black} />
              <Text>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sectionTab}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Ionicons name="stats-chart-outline" size={25} color={Colors.black} />
              <Text>Scoring Criteria</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
        <CustomButton
          text="Sign out"
          buttonStyle={[styles.signOutBtnContainer, { backgroundColor: Colors.primary }]}
          textStyle={[styles.signOutBtnText, { color: "white" }]}
          onPress={signUserOut}
        />
      </View>
      {/* <TouchableOpacity onPress={signUserOut}>
        <Text>Sign out</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },

  sectionsContainer: {
    margin: 20,
  },

  sectionTitle: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: "nm-b",
  },

  sectionTab: {
    paddingRight: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  searchInput: {
    backgroundColor: "white",
    flex: 1,
  },

  signOutBtnContainer: {
    marginTop: 35,
    borderRadius: 25,
    height: 40,
  },

  signOutBtnText: {
    fontSize: 18,
  },
});
