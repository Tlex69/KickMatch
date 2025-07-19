import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { DocFail } from "../../components/icon/DocFail";
import { FootballIcon } from "../../components/icon/FootballIcon";
import { AntDesign } from "@expo/vector-icons"; // ไอคอนปุ่ม

export default function RegisterTourScreen() {
  const navigation = useNavigation();
  const [competitions, setCompetitions] = useState([]); 

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      <LinearGradient
        colors={["#14141400", "#03C252"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.textBox}>
            <Text style={styles.titleText}>รายการแข่งขัน</Text>
            <Text style={styles.subTitleText}>รายการแข่งขันทั้งหมดที่คุณสร้าง</Text>
          </View>
          <FootballIcon size={5} color="#fff" />
        </View>
      </LinearGradient>

      {/* ปุ่มอยู่ตรงนี้ */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("CreateCompetitionScreen")}>
        <AntDesign name="plus" size={15} color="#07F469" />
        <Text style={styles.addButtonText}>สร้างรายการแข่งขัน</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={competitions.length === 0 && styles.emptyContainer}
        showsVerticalScrollIndicator={false}
      >
        

        {competitions.length === 0 ? (
          <View style={styles.emptyContent}>
            <DocFail width={110} height={120} fill="#141414" />
            <Text style={styles.emptyText}>ยังไม่มีรายการแข่งขัน</Text>
          </View>
        ) : (
          <View style={styles.boxcard}>
            {/* แสดงรายการแข่งขัน */}
          </View>
        )}
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
    width: "100%",
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
    marginEnd: 10,
  },
  titleText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
  },
  subTitleText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
  },
  addButton: {
  backgroundColor: "#202020",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 15,
  marginTop: 20,
  alignSelf: "flex-start",
  flexDirection: "row",        
  alignItems: "center",        
},
addButtonText: {
  color: "#07F469",
  fontSize: 13,
  fontFamily: "Kanit-SemiBold",
  marginLeft: 6,               
},

  scrollContainer: {
    marginTop: 15,
    width: "100%",
  },
  boxcard: {
    paddingBottom: 35,
    width: "100%",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContent: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 200,
  },
  emptyText: {
    color: "#383838",
    fontSize: 14,
    marginTop: 10,
    fontFamily: "Kanit-SemiBold",
  },
  
});
