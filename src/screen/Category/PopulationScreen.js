import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import PlayFootballIcon from "../../../components/icon/PlayFootballIcon";
import HorizontalCard from "../../../components/HorizontalCard";
import { db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const localImage = require("../../../assets/f1.jpg");

export default function PopulationScreen() {
  const navigation = useNavigation();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopulationMatches = async () => {
      try {
        const q = query(
          collection(db, "matches"),
          where("playerType", "==", "ประชาชน")
        );
        const querySnapshot = await getDocs(q);
        const matchesData = [];
        querySnapshot.forEach((doc) => {
          matchesData.push({ id: doc.id, ...doc.data() });
        });
        setMatches(matchesData);
      } catch (error) {
        console.log("Error fetching population matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopulationMatches();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#141414" }}>
        <ActivityIndicator size="large" color="#FFC300" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      <LinearGradient
        colors={["#14141400", "#FFC300"]}
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
            <Text style={styles.subTitleText}>ประชาชน</Text>
          </View>

          <PlayFootballIcon size={50} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {matches.length === 0 ? (
          <Text style={{ color: "#ccc", textAlign: "center", marginTop: 20 }}>
            ยังไม่มีรายการแข่งขันสำหรับประชาชน
          </Text>
        ) : (
          <View style={styles.boxcard}>
            {matches.map((match) => (
              <HorizontalCard
                key={match.id}
                image={match.promoImage ? { uri: match.promoImage } : localImage}
                title={match.title || "ไม่มีชื่อรายการ"}
                subtitle={`ประเภท : ${match.category2 || "-"} | ประชาชน`}
                onPress={() => navigation.navigate("DetailScreen", { matchId: match.id })}
                isRegistered={false}
                borderColor="#FFC300"
                buttonColor="#FFC300"
                buttonTextColor="#9D6414"
                registeredButtonColor="#444"
                registeredButtonTextColor="#ccc"
                titleColor="#C3780E"
                onRegister={() => console.log("กดสมัคร")}
                totalTeams={match.totalTeams || 0}
                maxTeams={match.teamAmount || 0}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414", paddingTop: 55, paddingHorizontal: 15 },
  headerBox: { width: '100%', height: 80, borderRadius: 20, paddingHorizontal: 15, justifyContent: "center" },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  textBox: { flex: 1, alignItems: "flex-end", marginEnd:10 },
  titleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  scrollContainer: { marginTop: 15, width: "100%" },
  boxcard: { paddingBottom: 35, width: "100%" },
});
