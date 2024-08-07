import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { ActivityIndicator, View } from "react-native";
import { AppRegistry } from "react-native";
import { checkIfEmailExists, getUserRestaurantsToTryList, initializeFirebase } from "@/firebase";

import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import { useAppStore } from "@/store/app-storage";
import { MenuProvider } from "react-native-popup-menu";
import { QueryClient, QueryClientProvider } from "react-query";

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
const queryClient = new QueryClient();

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
  const { setAuthUser, setUserDbInfo, setAppLoading } = useAppStore();

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
      if (!user) {
        router.replace("/");
      } else if (user && !user.emailVerified) {
        return;
      } else {
        setAuthUser(user);
        checkIfEmailExists().then((exists) => {
          if (exists) {
            setUserDbInfo({ ...exists, criteria: JSON.parse(exists.criteria) });
          }
          // router.replace("/(authenticated)/(tabs)/currentUser");
          setAppLoading(true);
          // exists
          //   ? router.replace("/(onboarding)/favoriteCuisine")
          //   : router.replace("(onboarding)/");
          // exists ? router.replace("/(authenticated)/EditProfile") : router.replace("(onboarding)/");
          exists
            ? router.replace("/(authenticated)/(tabs)/(home)/")
            : router.replace("(onboarding)/");
        });
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
      <MenuProvider>
        <QueryClientProvider client={queryClient}>
          <InitialLayout />
        </QueryClientProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
};
AppRegistry.registerComponent("alxeats", () => InitialLayout);

export default RootLayoutNav;
