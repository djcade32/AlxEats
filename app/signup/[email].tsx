import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomTextInput from "@/components/CustomTextInput";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "@/components/CustomButton";

//TODO: Change name of file to personalInfo.tsx

const Page = () => {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;
  const userObj = { age: 56 };

  const handleContinuePressed = () => {
    router.push({ pathname: "/signup/restaurantCriteria", params: userObj });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, paddingHorizontal: 30 }}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={{
            flex: 1,
            paddingBottom: 100,
          }}
        >
          <ScrollView
            contentInset={{ bottom: 10 }}
            showsVerticalScrollIndicator={Keyboard.isVisible()}
          >
            <View style={{ height: "65%", gap: 20 }}>
              <View>
                <Text style={styles.textInputLabel}>Full name</Text>
                <CustomTextInput
                  placeholder="Full name"
                  icon={<Ionicons name="person-circle-outline" size={24} color={Colors.gray} />}
                />
              </View>
              <View>
                <Text style={styles.textInputLabel}>Email</Text>
                <CustomTextInput
                  placeholder="Email"
                  icon={<Ionicons name="mail-outline" size={24} color={Colors.gray} />}
                />
              </View>
              <View>
                <Text style={styles.textInputLabel}>Password</Text>
                <CustomTextInput
                  placeholder="Password"
                  icon={<Ionicons name="lock-closed-outline" size={24} color={Colors.gray} />}
                  password
                />
              </View>
              <View>
                <Text style={styles.textInputLabel}>Birthday</Text>
                <CustomTextInput
                  placeholder="mm/dd/yyyy"
                  icon={
                    <MaterialCommunityIcons
                      name="cake-variant-outline"
                      size={24}
                      color={Colors.gray}
                    />
                  }
                />
              </View>
              <View>
                <Text style={styles.textInputLabel}>Favorite cuisine</Text>
                <CustomTextInput
                  placeholder="Favorite cuisine"
                  icon={<Ionicons name="fast-food-outline" size={24} color={Colors.gray} />}
                />
              </View>
            </View>
          </ScrollView>
          <CustomButton
            text="Continue"
            buttonStyle={[styles.btnContainer, { backgroundColor: Colors.primary }]}
            textStyle={[styles.btnText, { color: "white" }]}
            onPress={handleContinuePressed}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  textInputLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  btnContainer: {
    marginTop: 35,
    width: "100%",
    borderRadius: 25,
  },
  btnText: {
    fontSize: 18,
    paddingVertical: 10,
  },
});

export default Page;
