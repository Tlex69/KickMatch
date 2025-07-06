import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ViewGridDetail } from "../components/icon/ViewGridDetail"; 
import { HomeOutline } from "../components/icon/HomeOutline";
import { Ranking } from "../components/icon/Ranking";
import { UserRound } from "../components/icon/UserRound";

import HomeScreen from "../src/screen/HomeScreen";
import UserScreen from "../src/screen/UserScreen";
import CompetitionlistScreen from "../src/screen/CompetitionlistScreen";
import RankingScreen from "../src/screen/RankingScreen";
const Tab = createBottomTabNavigator();

export default function Navbar() {
  return (
   <Tab.Navigator
  screenOptions={{
    tabBarShowLabel: false,
    tabBarStyle: {
      position: "absolute",
      marginLeft: 20,
      bottom: 35,
      width: 350,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#07F469",
      borderTopWidth: 0,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      alignSelf: "center",
    },
    headerShown: false,
  }}
>
  <Tab.Screen
    name="หน้าแรก"
    component={HomeScreen}
    options={{
      tabBarIcon: ({ size, focused }) => (
        <HomeOutline
          color={focused ? "#154127" : "#36AE68"}
          width={size}
          height={size}
          style={{ marginBottom: -15 }}
        />
      ),
    }}
  />
  <Tab.Screen
    name="ประเภท"
    component={CompetitionlistScreen}
    options={{
      tabBarIcon: ({ size, focused }) => (
        <ViewGridDetail
          color={focused ? "#154127" : "#36AE68"}
          width={size}
          height={size}
          style={{ marginBottom: -15 }}
        />
      ),
    }}
  />
  <Tab.Screen
    name="สถิติการแข่งขัน"
    component={RankingScreen}
    options={{
      tabBarIcon: ({ size, focused }) => (
        <Ranking
          color={focused ? "#154127" : "#36AE68"}
          width={size}
          height={size}
          style={{ marginBottom: -15 }}
        />
      ),
    }}
  />
  <Tab.Screen
    name="โปรไฟล์"
    component={UserScreen}
    options={{
      tabBarIcon: ({ size, focused }) => (
        <UserRound
          color={focused ? "#154127" : "#36AE68"}
          width={size}
          height={size}
          style={{ marginBottom: -15 }}
        />
      ),
    }}
  />
</Tab.Navigator>

  );
}
