import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { removeRestaurantFromTriedList } from "@/firebase";
import { Menu, renderers, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import { RestaurantItem } from "@/interfaces";

interface DropdownProps {
  ranking: number;
  restaurantItem: RestaurantItem;
  userId: string;
  handleGetDirectionsPressed: () => void;
  handleWebsitePressed: () => void;
  handleCallPressed: () => void;
}

const Dropdown = ({
  ranking,
  restaurantItem,
  userId,
  handleCallPressed,
  handleGetDirectionsPressed,
  handleWebsitePressed,
}: DropdownProps) => {
  const showWarningAlert = async () => {
    Alert.alert("Are you sure you want to delete this score?", undefined, [
      {
        text: "Cancel",
      },
      {
        text: "Yes, delete",
        onPress: async () => {
          await removeRestaurantFromTriedList(userId, restaurantItem.placeId);
        },
      },
    ]);
  };
  return (
    <Menu renderer={renderers.ContextMenu} rendererProps={{ placement: "bottom" }}>
      <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity }}>
        <MaterialCommunityIcons name="dots-horizontal" size={35} color={Colors.black} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: styles.optionsContainer,
        }}
      >
        {ranking && (
          <>
            <MenuOption
              onSelect={() => showWarningAlert()}
              style={styles.optionContainer}
              customStyles={{ OptionTouchableComponent: TouchableOpacity }}
            >
              <Text style={[styles.optionsText, { color: Colors.error }]}>Delete your score</Text>
              <Ionicons name="trash-outline" size={24} color={Colors.error} />
            </MenuOption>

            <View style={{ height: 1, backgroundColor: Colors.lightGray }} />
          </>
        )}
        <MenuOption
          onSelect={() => handleGetDirectionsPressed()}
          style={styles.optionContainer}
          customStyles={{ OptionTouchableComponent: TouchableOpacity }}
        >
          <Text style={styles.optionsText}>Directions</Text>
          <Ionicons name="navigate-outline" size={24} color={Colors.black} />
        </MenuOption>
        <View style={{ height: 1, backgroundColor: Colors.lightGray }} />

        <MenuOption
          onSelect={() => handleWebsitePressed()}
          style={styles.optionContainer}
          customStyles={{ OptionTouchableComponent: TouchableOpacity }}
        >
          <Text style={styles.optionsText}>Website</Text>
          <MaterialCommunityIcons name="web" size={24} color={Colors.black} />
        </MenuOption>
        <View style={{ height: 1, backgroundColor: Colors.lightGray }} />

        <MenuOption
          onSelect={() => handleCallPressed()}
          style={styles.optionContainer}
          customStyles={{ OptionTouchableComponent: TouchableOpacity }}
        >
          <Text style={styles.optionsText}>Call</Text>
          <Ionicons name="call-outline" size={24} color={Colors.black} />
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  optionsContainer: {
    marginTop: 45,
    borderRadius: 10,
    padding: 5,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 10,
  },
  optionsText: {
    fontSize: 18,
    color: Colors.black,
  },
});
