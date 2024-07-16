import { StyleSheet, View, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import Switch from "./Switch";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomTextInput from "./CustomTextInput";
import { Stack, useRouter } from "expo-router";

interface FollowingsScreenHeaderProps {
  searchText: string;
  setSearchText: (text: string) => void;
  activeToggle: number;
  setActiveToggle: (viewMembers: number) => void;
  switchValues: {
    label: string;
    icon: React.ReactElement;
    activeColor: string;
    inactiveColor: string;
  }[];
  showFilter?: boolean;
  showBackButton?: boolean;
}

const ListingsScreenHeader = ({
  searchText,
  setSearchText,
  activeToggle,
  setActiveToggle,
  switchValues,
  showFilter = true,
  showBackButton = false,
}: FollowingsScreenHeaderProps) => {
  const router = useRouter();

  return (
    <Stack.Screen
      options={{
        header: () => (
          <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.headerContainer}>
              {/* Switch and filter button */}
              <View
                style={{
                  alignItems: "center",
                  position: "relative",
                  justifyContent: "center",
                }}
              >
                {showBackButton && (
                  <TouchableOpacity
                    style={[styles.filterIconContainer, { left: 15 }]}
                    onPress={() => router.back()}
                  >
                    <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
                  </TouchableOpacity>
                )}
                <Switch
                  setToggleActive={setActiveToggle}
                  values={switchValues}
                  activeToggle={activeToggle}
                />
                {showFilter && (
                  <TouchableOpacity
                    style={styles.filterIconContainer}
                    onPress={() => router.push("/(authenticated)/(modals)/Filter/")}
                  >
                    <Ionicons name="filter-outline" size={22} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Search Input */}
              <CustomTextInput
                name="search"
                placeholder={
                  activeToggle
                    ? `Search ${switchValues[activeToggle].label}`
                    : `Search ${switchValues[activeToggle].label}`
                }
                icon={<Ionicons name="search" size={18} color={Colors.gray} />}
                value={searchText}
                onChange={setSearchText}
                customStyles={styles.searchInput}
                showErrorMessage={false}
                clearButtonMode="while-editing"
              />
            </View>
          </SafeAreaView>
        ),
      }}
    ></Stack.Screen>
  );
};

export default ListingsScreenHeader;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
  },

  headerContainer: {
    backgroundColor: "white",
    height: 85,
  },

  filterIconContainer: {
    position: "absolute",
    right: 25,
  },

  searchInput: {
    width: "75%",
    alignSelf: "center",
    marginVertical: 10,
    height: 32,
  },
});
