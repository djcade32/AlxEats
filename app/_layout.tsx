import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { AppRegistry } from "react-native";
import { initializeFirebase } from "@/firebase";

import { LinearGradient } from "expo-linear-gradient";
import { useAppStore } from "@/store/app-storage";
import { getAuth } from "firebase/auth";

initializeFirebase();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const { setPendingEmailVerification } = useAppStore();

  const [loaded, error] = useFonts({
    nm: require("../assets/fonts/NanumMyeongjo-Regular.ttf"),
    "nm-sb": require("../assets/fonts/NanumMyeongjo-Bold.ttf"),
    "nm-b": require("../assets/fonts/NanumMyeongjo-ExtraBold.ttf"),
    futura: require("../assets/fonts/Futura-Regular.ttf"),
    "futura-b": require("../assets/fonts/Futura-Bold.ttf"),
    "futura-sb": require("../assets/fonts/Futura-SemiBold.ttf"),
    nycd: require("../assets/fonts/NothingYouCouldDo-Regular.ttf"),
  });
  const router = useRouter();
  const segments = useSegments();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    getAuth().onAuthStateChanged((user) => {
      setIsLoading(false);
      if (!user) {
        router.replace("/");
        // router.replace("/emailVerification");
      } else if (user && !user.emailVerified) {
        return;
      } else {
        // TODO: Add check for if user is in the database
        router.replace("/(authenticated)/(tabs)/home");
      }
    });
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LinearGradient
          colors={[Colors.primary, "#051822"]}
          style={{ position: "absolute", left: 0, right: 0, top: 0, height: "100%" }}
        />
        <ActivityIndicator size="large" color={"white"} />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="signup/index"
        options={{
          animation: "slide_from_bottom",
          header: () => (
            <CustomHeader
              title="Sign up"
              headerLeft={
                <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
              }
            />
          ),
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="signin"
        options={{
          animation: "slide_from_bottom",
          header: () => (
            <CustomHeader
              title="Welcome back!"
              headerLeft={
                <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
              }
            />
          ),
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="forgotPassword"
        options={{
          header: () => (
            <CustomHeader
              title="Forgot password?"
              headerLeft={
                <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
              }
            />
          ),
          contentStyle: { backgroundColor: "white" },
        }}
      />

      <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
    </Stack>
  );
}

const RootLayoutNav = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <InitialLayout />
    </GestureHandlerRootView>
  );
};
AppRegistry.registerComponent("alxeats", () => InitialLayout);

export default RootLayoutNav;
