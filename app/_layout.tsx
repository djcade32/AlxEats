import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { AppRegistry } from "react-native";
import { initializeFirebase } from "@/firebase";
import { LinearGradient } from "expo-linear-gradient";

initializeFirebase();

const CLERK_PUBLISHABLE_KEY: any = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

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
  const { isLoaded, isSignedIn } = useAuth();
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
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(authenticated)";
    if (isSignedIn && !inAuthGroup) {
      router.replace("/(authenticated)/(tabs)/(yourLists)");
      // router.replace("/(authenticated)/(tabs)/home");
    } else if (!isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn]);

  if (!loaded || !isLoaded) {
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
      <Stack.Screen
        name="signup/personalInfo"
        options={{
          header: () => (
            <CustomHeader
              title="Personal Information"
              headerLeft={
                <Ionicons name="chevron-back-circle-outline" size={35} color={Colors.black} />
              }
            />
          ),
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="signup/restaurantCriteria"
        options={{
          header: () => (
            <CustomHeader
              title="Restaurant Criteria"
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
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <InitialLayout />
      </GestureHandlerRootView>
    </ClerkProvider>
  );
};
AppRegistry.registerComponent("alxeats", () => InitialLayout);

export default RootLayoutNav;
