import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { ViewGridDetail2 } from "../../components/icon/ViewGridDetail2";
import { DocFail } from "../../components/icon/DocFail";
import HorizontalCard from "../../components/HorizontalCard"; 
import { db, auth } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function CompetitionlistScreen() {
  const navigation = useNavigation();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCompetitions(user.uid);
      } else {
        console.log("User not logged in");
        setCompetitions([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCompetitions = async (uid) => {
    try {
      const querySnapshot = await getDocs(collection(db, "matches"));
      const allMatches = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Match data:", data); 
        return { id: doc.id, ...data };
      });

      // กรองเฉพาะรายการที่ user จ่ายเงินแล้ว
      const paidMatches = allMatches.filter(match =>
        Array.isArray(match.paidUsers) && match.paidUsers.includes(uid)
      );

      console.log("Paid matches:", paidMatches);

      setCompetitions(paidMatches);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching competitions:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#fff" }}>กำลังโหลดรายการแข่งขัน...</Text>
      </View>
    );
  }

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
      <HorizontalCard
        key={comp.id}
        match={comp} 
        isRegistered={true} 
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
