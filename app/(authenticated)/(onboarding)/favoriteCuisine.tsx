import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Font from "@/constants/Font";
import FavoriteCuisineBottomSheet from "@/components/FavoriteCuisineBottomSheet";
import CustomButton from "@/components/CustomButton";

const favoriteCuisine = () => {
  const router = useRouter();
  const paramObj = useLocalSearchParams() as any;

  const [favoriteCuisine, setFavoriteCuisine] = useState<string | null>(null);
  const [bottomSheetOpened, setBottomSheetOpened] = useState(false);

  const handleContinuePressed = async () => {
    router.push({
      pathname: "/(authenticated)/(onboarding)/restaurantCriteria",
      params: { ...paramObj, favoriteCuisine },
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.directions}>
        Let's chat about flavors! What cuisine makes your taste buds dance with delight?
      </Text>

      <TouchableWithoutFeedback onPress={() => setBottomSheetOpened(true)}>
        <View>
          <View style={styles.favCuisineBtn}>
            <Ionicons name="fast-food-outline" size={24} color={Colors.gray} />
            <Text
              style={{
                fontSize: 18,
                color: favoriteCuisine ? Colors.black : Colors.gray,
              }}
            >
              {favoriteCuisine ? favoriteCuisine : "Favorite cuisine"}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={{ flex: 1 }} />
      <CustomButton
        text="Continue"
        buttonStyle={[styles.continueBtnContainer, { backgroundColor: Colors.primary }]}
        textStyle={[styles.continueBtnText, { color: "white" }]}
        onPress={handleContinuePressed}
        disabled={!favoriteCuisine}
      />
      <FavoriteCuisineBottomSheet
        bottomSheetOpened={bottomSheetOpened}
        setBottomSheetOpened={setBottomSheetOpened}
        selectedCuisine={favoriteCuisine || ""}
        setSelectedCuisine={setFavoriteCuisine}
      />
    </View>
  );
};

export default favoriteCuisine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
    paddingTop: 20,
    paddingHorizontal: 30,
  },

  directions: {
    fontSize: Font.small,
    marginVertical: 20,
    textAlign: "center",
    color: Colors.black,
    alignSelf: "center",
  },

  textInputLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  favCuisineBtn: {
    borderWidth: 1,
    borderRadius: 15,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
    borderColor: Colors.gray,
  },

  continueBtnContainer: {
    marginTop: 35,
    borderRadius: 25,
    height: 40,
  },
  continueBtnText: {
    fontSize: 18,
  },
});
