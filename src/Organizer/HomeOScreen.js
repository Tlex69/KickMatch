import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { Octicons } from "@expo/vector-icons";
import ButtonGrid from "../../components/ButtonGrid";
import HorizontalOCard from "./HorizontalOCard";
const localImage = require("../../assets/f1.jpg");

export default function HomeOScreen({ route }) {
  // รับแพ็คจาก params มาแสดงใต้ KickMatch
  const { plan } = route.params || {};

  const handlePress = (label) => {
    console.log("กดปุ่ม:", label);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title1}>
            Kick<Text style={styles.title2}>Match</Text>
          </Text>

          <View style={styles.planBadge}>
            <Text style={styles.planText}>ฝ่ายจัด</Text>
          </View>
        </View>
        <View style={styles.bellCircle}>
          <Octicons name="bell" size={17} color="#07F469" />
        </View>
      </View>

     

      <View style={{ marginTop: 15 }}>
      

      </View>
      <View style={styles.boxtitle}>
        <Text style={styles.title}>รายชื่อทีมที่ส่งสมัคร</Text>
      </View>

      <View style={{ marginTop: 15 }}>
        <HorizontalOCard
          image={localImage}
          title="อาทิตย์7ชาเลนจ์คัพ2024"
          subtitle="ประเภท : 7 คน | ประชาชน"
          isRegistered={true}
          totalTeams={7}
          maxTeams={16}
          statusText="กำลังแข่งขัน"
          teamStatusText=""
          statusColor="#FF4C4C"
          onPress={() => console.log("ไปยังรายละเอียด")}
        />
        <HorizontalOCard
          image={localImage}
          title="สายสัมพันธ์ 789"
          subtitle="ประเภท : 7 คน | ประชาชน"
          isRegistered={true}
          totalTeams={1}
          maxTeams={16}
          statusText="เปิดรับสมัครอยู่"
          teamStatusText="สมัครแล้ว 1/16 ทีม"
          statusColor="#07F469"
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
  planBox: {
    color: "#07F469",
    backgroundColor: "#154127",
    borderRadius: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: "Kanit-SemiBold",
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
    marginTop: 20,
    alignSelf: "flex-start",
  },
  title: {
    color: "#07F469",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
  },
  title2: {
    color: "#07F469",
  },
  planBadge: {
    marginLeft: 5,
    backgroundColor: "#DBB924",
    width: 40,
    height: 15,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 5,
  },
  planText: {
    color: "#fff",
    fontSize: 8,
    fontFamily: "Kanit-SemiBold",
    marginTop: 1,
  },
  
});
