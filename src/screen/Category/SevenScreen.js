import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import NumberSevenBoldIcon from "../../../components/icon/NumberSevenBoldIcon";
import HorizontalCard from "../../../components/HorizontalCard";

const localImage = require("../../../assets/f1.jpg");

export default function SevenScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      <LinearGradient
        colors={["#14141400", "#63E611"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.textBox}>
            <Text style={styles.titleText}>ประเภทรายการ</Text>
            <Text style={styles.subTitleText}>บอล 7 คน</Text>
          </View>

          <NumberSevenBoldIcon size={50} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.boxcard}>
          {[...Array(10)].map((_, i) => (
            <HorizontalCard
              key={i}
              image={localImage}
              title="อาทิ7ชาลเลนจ์คัพ2024"
              subtitle="ประเภท : 7 คน | ประชาชน"
              onPress={() => console.log("ไปยังรายละเอียด")}
              isRegistered={false}
              borderColor="#9ef75f"
              buttonColor="#43a808"
              buttonTextColor="#fff"
              registeredButtonColor="#444"
              registeredButtonTextColor="#ccc"
              titleColor="#9ef75f"
              onRegister={() => console.log("กดสมัคร")}
              totalTeams={12}
              maxTeams={14}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingTop: 55,
    paddingHorizontal: 15, 
  },
  headerBox: {
    width: '100%',
    height: 80,
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textBox: {
    flex: 1,
    alignItems: "flex-end",
    marginEnd:10 
  },
  titleText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
  },
  subTitleText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
  },
  scrollContainer: {
    marginTop: 15,
    width: "100%", 
  },
  boxcard: {
    paddingBottom: 35,
    width: "100%", 
  },
});
