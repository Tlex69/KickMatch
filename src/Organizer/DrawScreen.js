// 🔹 DrawScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import DiceIcon from "../../components/icon/DiceIcon";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import RandomIcon from "../../components/icon/RandomIcon";

export default function DrawScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { matchId } = route.params; // ✅ รับ matchId มาจาก ListFootballScreen
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        if (!matchId) return;
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);

        if (matchSnap.exists()) {
          setMatchData({ id: matchSnap.id, ...matchSnap.data() });
        } else {
          console.log("Match not found!");
        }
      } catch (error) {
        console.log("Error fetching match:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF7DAD" />
      </View>
    );
  }

  if (!matchData) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "#ccc", fontSize: 16 }}>ไม่พบข้อมูลการแข่งขัน</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      <LinearGradient
        colors={["#14141400", "#07F469"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <MaterialIcons
            name="arrow-back"
            size={26}
            color="#fff"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.textBox}>
            <Text style={styles.titleText}>จับฉลากการแข่งขัน</Text>
            <Text style={styles.subTitleText}>
              {matchData.fullname || "ไม่พบชื่อรายการ"}
            </Text>
          </View>
          <DiceIcon size={50} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <StatusBar backgroundColor="#141414" barStyle="light-content" />

          <View style={styles.circle}>
            <RandomIcon size={180} color="#07F469" />
          </View>

         <TouchableOpacity
  style={styles.button}
  onPress={() =>
    navigation.navigate("DrawTwoScreen", {
      matchId,
      startTime: matchData.startTime, // ✅ ส่งเวลาไปด้วย
    })
  }
>
  <Text style={styles.buttonText}>
    จับฉลาก
    {matchData.startTime
      ? ` (${new Date(matchData.startTime.seconds * 1000).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        })})`
      : ""}
  </Text>
</TouchableOpacity>

          <View style={styles.boxwarning}>
            <Text style={styles.wartext}>หมายเหตุการจับฉลาก</Text>
            <Text style={styles.wartext}>
              - การจับฉลากจะสุ่มแบบอัตโนมัติ ไม่สามารถย้อนกลับได้
            </Text>
            <Text style={styles.wartext}>
              - กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนเริ่มจับ
            </Text>
            <Text style={styles.wartext}>- เมื่อจับแล้ว ระบบจะบันทึกผลทันที</Text>
            <Text style={styles.wartext}>
              - หากต้องการเปลี่ยนผล กรุณาติดต่อผู้ดูแลระบบหรือเริ่มต้นใหม่
            </Text>
          </View>
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
    alignItems: "center",
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
  textBox: { flex: 1, alignItems: "flex-end", marginEnd: 10 },
  titleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  scrollContainer: { marginTop: 15, width: "100%" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  circle: {
    width: 240,
    height: 240,
    borderRadius: 200,
    backgroundColor: "#154127",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  boxwarning: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wartext: {
    color: "#07F469",
    fontSize: 10.5,
    fontFamily: "Kanit-Regular",
    marginBottom: 5,
  },
  button: {
    width: "100%",
    backgroundColor: "#07F469",
    paddingVertical: 12,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
  buttonText: {
    color: "#154127",
    fontSize: 15,
    fontFamily: "Kanit-SemiBold",
  },
});
