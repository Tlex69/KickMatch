import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Screens
import LoginScreen from "./src/LoginScreen";
import RegisterScreen from "./src/RegisterScreen";
import YouthScreen from "./src/screen/Category/YouthScreen";
import PopulationScreen from "./src/screen/Category/PopulationScreen";
import CupScreen from "./src/screen/Category/CupScreen";
import LeagueScreen from "./src/screen/Category/LeagueScreen";
import SevenScreen from "./src/screen/Category/SevenScreen";
import EightScreen from "./src/screen/Category/EightScreen";
import NineScreen from "./src/screen/Category/NineScreen";
import ElevenScreen from "./src/screen/Category/ElevenScreen";
import Navbar from "./components/Navbar";
import DetailScreen from "./src/screen/DetailScreen";
import HistoryScreen from "./src/screen/HistoryScreen";
import OrganizerRegisterScreen from "./src/screen/OrganizerRegisterScreen";
import OrganizerFormScreen from "./src/screen/OrganizerFormScreen";
import LoadingScreen from "./src/screen/LoadingScreen";
import RegisterCompetitionScreen from "./src/screen/RegisterCompetitionScreen";
import PlayerRegistrationScreen from "./src/screen/PlayerRegistrationScreen";
import PaymentScreen from "./src/screen/PaymentScreen";
import ListPlayerScreen from "./src/screen/ListPlayerScreen";
import NavbarO from "./src/Organizer/NavbarO";
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "MuseoModerno-SemiBold": require("./assets/font/MuseoModerno-SemiBold.ttf"),
    "MuseoModerno-Bold": require("./assets/font/MuseoModerno-Bold.ttf"),
    "Kanit-SemiBold": require("./assets/font/Kanit-SemiBold.ttf"),
    "Kanit-Regular": require("./assets/font/Kanit-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // ยังไม่โหลด font ก็ยังไม่แสดงอะไร
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Navbar}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Youth"
            component={YouthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Population"
            component={PopulationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Cup"
            component={CupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="League"
            component={LeagueScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Seven"
            component={SevenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Eight"
            component={EightScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Nine"
            component={NineScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Eleven"
            component={ElevenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Organizer"
            component={OrganizerRegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Organizerform"
            component={OrganizerFormScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Loading"
            component={LoadingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterCompetition"
            component={RegisterCompetitionScreen}
            options={{ headerShown: false }}
          /> 
           <Stack.Screen
            name="HomeO"
            component={NavbarO}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PlayerRegistration"
            component={PlayerRegistrationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ListPlayer"
            component={ListPlayerScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
