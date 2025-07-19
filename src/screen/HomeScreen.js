import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { Octicons } from "@expo/vector-icons";
import ButtonGrid from "../../components/ButtonGrid";
import HorizontalCard from "../../components/HorizontalCard";

const localImage = require("../../assets/f1.jpg");


export default function HomeScreen() {
  const handlePress = (label) => {
    console.log("กดปุ่ม:", label);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      <View style={styles.headerRow}>
        <Text style={styles.title1}>
          Kick<Text style={styles.title2}>Macth</Text>
        </Text>
        <View style={styles.bellCircle}>
          <Octicons name="bell" size={17} color="#07F469" />
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <ButtonGrid onPressButton={handlePress} />
      </View>
      <View style={styles.boxtitle}>
        <Text style={styles.title}>รายการแข่งที่แนะนำ</Text>
      </View>
      <View style={{ marginTop: 15 }}>
  <HorizontalCard
    image={localImage}
    title="อาทิ7ชาลเลนจ์คัพ2024"
    subtitle="ประเภท :  7 คน | ประชาชน"
    onPress={() => console.log("ไปยังรายละเอียด")}
  />
  <HorizontalCard
    image={localImage}
    title="อาทิ7ชาลเลนจ์คัพ2024"
    subtitle="ประเภท :  7 คน | ประชาชน"
    onPress={() => console.log("ไปยังรายละเอียด")}
  />
  <HorizontalCard
    image={localImage}
    title="อาทิ7ชาลเลนจ์คัพ2024"
    subtitle="ประเภท :  7 คน | ประชาชน"
    onPress={() => console.log("ไปยังรายละเอียด")}
  />
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingTop: 55,
    paddingHorizontal: 25,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title1: {
    color: "#fff",
    fontSize: 21,
    fontFamily: "MuseoModerno-Bold",
  },
  title2: {
    color: "#07F469",
  },
  bellCircle: {
    width: 33,
    height: 33,
    borderRadius: 20,
    backgroundColor: "#154127",
    justifyContent: "center",
    alignItems: "center",
  },
    boxtitle: {
    backgroundColor: "#202020",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginTop: 2,
    alignSelf: "flex-start",
  },
  title: {
    color: "#07F469",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
  },

});
