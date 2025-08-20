import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { ViewGridDetail2 } from "../../components/icon/ViewGridDetail2";
import { DocFail } from "../../components/icon/DocFail";
import HorizontalOCard from "../../components/HorizontalCard"; 
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function CompetitionlistScreen() {
  const navigation = useNavigation();
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "matches"));
        const allMatches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const successMatches = allMatches.filter(match => match.status === "success");
        setCompetitions(successMatches);
      } catch (error) {
        console.log("Error fetching competitions:", error);
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={["#14141400", "#03C252"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.textBox}>
            <Text style={styles.titleText}>รายการแข่งขัน</Text>
            <Text style={styles.subTitleText}>รายการแข่งขันที่คุณสมัคร</Text>
          </View>
          <ViewGridDetail2 size={45} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={
          competitions.length === 0 && styles.emptyContainer
        }
        showsVerticalScrollIndicator={false}
      >
        {competitions.length === 0 ? (
          <View style={styles.emptyContent}>
            <DocFail width={110} height={120} fill="#141414" />
            <Text style={styles.emptyText}>ยังไม่มีรายการ</Text>
          </View>
        ) : (
          competitions.map((comp) => (
            <HorizontalOCard
              key={comp.id}
              image={
                comp?.promoImageBase64
                  ? { uri: `data:image/jpeg;base64,${comp.promoImageBase64}` }
                  : comp?.promoImage
                  ? { uri: comp.promoImage }
                  : require("../../assets/f1.jpg")
              }
              title={comp?.fullname || "ไม่มีชื่อ"}
              subtitle={`ประเภท: ${comp?.category2 || "-"}`}
              isRegistered={true}
              totalTeams={comp?.totalTeams || 0}
              maxTeams={comp?.maxTeams || 16}
              statusText={comp?.status || "เปิดรับสมัครอยู่"}
              teamStatusText={`สมัครแล้ว ${comp?.totalTeams || 0}/${
                comp?.maxTeams || 16
              } ทีม`}
              statusColor={comp?.statusColor || "#07F469"}
              onPress={() =>
                navigation.navigate("CompetitionDetail", { compId: comp.id })
              }
            />
          ))
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
