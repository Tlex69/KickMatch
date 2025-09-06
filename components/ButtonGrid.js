import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import BoyIcon from "./icon/BoyIcon";
import PlayFootballIcon from "./icon/PlayFootballIcon";
import CupBrokenIcon from "./icon/CupBrokenIcon";
import RankingDuotoneIcon from "./icon/RankingDuotoneIcon";
import NumberSevenBoldIcon from "./icon/NumberSevenBoldIcon";
import NumberEightBoldIcon from "./icon/NumberEightBoldIcon";
import NumberNineBoldIcon from "./icon/NumberNineBoldIcon";
import NumberElevenBoldIcon from "./icon/NumberElevenBoldIcon";

export default function ButtonGrid({ onPressButton }) {
  const navigation = useNavigation();

  const gradients = [
    ["#457EF0", "#003AAE"],
    ["#FFC300", "#C3780E"],
    ["#FF7DAD", "#C92662"],
    ["#F66409", "#8B3A09"],
    ["#63E611", "#418D12"],
    ["#18DDB5", "#077C64"],
    ["#7869FF", "#372C98"],
    ["#FF1521", "#990D14"],
  ];

  const buttons = [
    { label: "เยาวชน", icon: { lib: "BoyIcon" } },
    { label: "ประชาชน", icon: { lib: "PlayFootballIcon" } },
    { label: "บอลถ้วย", icon: { lib: "CupBrokenIcon" } },
    { label: "บอลลีก", icon: { lib: "RankingDuotoneIcon" } },
    { label: "บอล 7 คน", icon: { lib: "NumberSevenBoldIcon" } },
    { label: "บอล 8 คน", icon: { lib: "NumberEightBoldIcon" } },
    { label: "บอล 9 คน", icon: { lib: "NumberNineBoldIcon" } },
    { label: "บอล 11 คน", icon: { lib: "NumberElevenBoldIcon" } },
  ];

  const handlePress = (label) => {
    if (label === "เยาวชน") {
      navigation.navigate("Youth");
    }
    if (label === "ประชาชน") {
      navigation.navigate("Population");
    }
    if (label === "บอลถ้วย") {
      navigation.navigate("Cup");
    } 
    if (label === "บอลลีก") {
      navigation.navigate("League");
    }
    if (label === "บอล 7 คน") {
      navigation.navigate("Seven");
    }
    if (label === "บอล 8 คน") {
      navigation.navigate("Eight");
    }
    if (label === "บอล 9 คน") {
      navigation.navigate("Nine");
    }
    if (label === "บอล 11 คน") {
      navigation.navigate("Eleven");
    }else {
      onPressButton && onPressButton(label);
    }
  };

  const renderIcon = (icon) => {
    switch (icon.lib) {
      case "BoyIcon":
        return <BoyIcon size={32} color="#fff" />;
      case "PlayFootballIcon":
        return <PlayFootballIcon size={32} color="#fff" />;
      case "CupBrokenIcon":
        return <CupBrokenIcon size={32} color="#fff" />;
      case "RankingDuotoneIcon":
        return <RankingDuotoneIcon size={32} color="#fff" />;
      case "NumberSevenBoldIcon":
        return <NumberSevenBoldIcon size={32} color="#fff" />;
      case "NumberEightBoldIcon":
        return <NumberEightBoldIcon size={32} color="#fff" />;
      case "NumberNineBoldIcon":
        return <NumberNineBoldIcon size={32} color="#fff" />;
      case "NumberElevenBoldIcon":
        return <NumberElevenBoldIcon size={32} color="#fff" />;
      default:
        return null;
    }
  };
 
  return (
    <View style={styles.container}>
      {buttons.map(({ label, icon }, index) => (
        <View key={index} style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePress(label)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={gradients[index]}
              style={styles.gradient}
              start={{ x: 2, y: 1 }}
              end={{ x: 1, y: 2 }}
            >
              {renderIcon(icon)}
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.buttonText}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonWrapper: {
    width: "20%",
    alignItems: "center",
    padding: 3,
    marginBottom: 20,
    marginHorizontal: 8,
  },
  button: {
    width: 55,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    marginTop: 6,
    color: "#fff",
    fontSize: 11,
    fontFamily: "Kanit-SemiBold",
    textAlign: "center",
  },
});
