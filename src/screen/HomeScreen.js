import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { Octicons } from "@expo/vector-icons";
import HorizontalCard from "../../components/HorizontalCard";
import ButtonGrid from "../../components/ButtonGrid";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const localImage = require("../../assets/f1.jpg");

export default function HomeScreen() {
  const [matches, setMatches] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "matches"));
        const matchesData = [];
        querySnapshot.forEach((doc) => {
          matchesData.push({ id: doc.id, ...doc.data() });
        });
        setMatches(matchesData);
      } catch (error) {
        console.log("Error fetching matches:", error);
      }
    };
    fetchMatches();
  }, []);

  const handlePress = (label) => {
    console.log("กดปุ่ม:", label);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      <View style={styles.headerRow}>
        <Text style={styles.title1}>
          Kick<Text style={styles.title2}>Match</Text>
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

    <ScrollView
  style={{ marginTop: 15 }}
  contentContainerStyle={{ paddingBottom: 100 }}
  showsVerticalScrollIndicator={false}
>
  {matches.length === 0 ? (
    <Text style={{ color: "#ccc", textAlign: "center", marginTop: 20 }}>
      ยังไม่มีรายการแข่งขัน
    </Text>
  ) : (
    matches.slice(0, 3).map((match) => {
      const isFull = match.totalTeams >= match.teamAmount; // ตรวจสอบว่าเต็มแล้ว
      return (
        <HorizontalCard
          key={match.id}
          match={match}
          isRegistered={false}
          disabled={isFull} // ส่ง props ไปให้การ์ดรู้ว่าไม่สามารถกดได้
          style={{ opacity: isFull ? 0.5 : 1 }} // สีจางถ้าเต็ม
        />
      );
    })
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