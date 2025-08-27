import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { DocFail } from "../../components/icon/DocFail";
import { FootballIcon } from "../../components/icon/FootballIcon";
import { AntDesign } from "@expo/vector-icons";
import HorizontalCard from "./HorizontalOCard";

import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function RegisterTourScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [competitions, setCompetitions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  // ฟังก์ชันโหลดรายการแข่งขัน
  const fetchCompetitions = useCallback(async () => {
    if (!currentUser) return;
    try {
      const querySnapshot = await getDocs(collection(db, "matches"));
      const matchesData = [];

      for (const docSnap of querySnapshot.docs) {
        const matchData = { id: docSnap.id, ...docSnap.data() };
        if (matchData.ownerUid === currentUser.uid) {
          matchesData.push(matchData);
        }
      }

      setCompetitions(matchesData);
    } catch (error) {
      console.log("Error fetching competitions:", error);
    }
  }, [currentUser]);

  // โหลดครั้งแรกและตอนหน้าโฟกัส
  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions, isFocused]);

  // Pull-to-Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCompetitions();
    setRefreshing(false);
  };

  // เริ่มการแข่งขัน
  const handleStartMatch = async (matchId) => {
    try {
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, { status: "in_progress" });

      // อัปเดต state ทันที
      setCompetitions((prev) =>
        prev.map((comp) =>
          comp.id === matchId ? { ...comp, status: "in_progress" } : comp
        )
      );
    } catch (error) {
      console.log("Error updating match status:", error);
    }
  };

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
            <Text style={styles.subTitleText}>
              รายการแข่งขันทั้งหมดที่คุณสร้าง
            </Text>
          </View>
          <FootballIcon size={5} color="#fff" />
        </View>
      </LinearGradient>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("RegisterFormMatch")}
      >
        <AntDesign name="plus" size={15} color="#07F469" />
        <Text style={styles.addButtonText}>สร้างรายการแข่งขัน</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={
          competitions.length === 0 && styles.emptyContainer
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#07F469"
            colors={["#07F469"]}
          />
        }
      >
        {competitions.length === 0 ? (
          <View style={styles.emptyContent}>
            <DocFail width={110} height={120} fill="#141414" />
            <Text style={styles.emptyText}>ยังไม่มีรายการแข่งขัน</Text>
          </View>
        ) : (
          competitions.map((comp) => {
            const totalTeams = comp.totalTeams || 0;
            const maxTeams = comp.teamAmount || 12;

            return (
              <HorizontalCard
                key={comp.id}
                image={
                  comp.promoImage
                    ? { uri: comp.promoImage }
                    : require("../../assets/defualt.jpg")
                }
                title={comp.fullname || "ไม่มีชื่อ"}
                subtitle={comp.category2 || "ไม่มีรายละเอียด"}
                totalTeams={totalTeams}
                maxTeams={maxTeams}
                borderColor="#07F469"
                showStartButton={comp.status !== "in_progress"}
                onStartPress={() => handleStartMatch(comp.id)}
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
