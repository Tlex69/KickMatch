import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import NumberElevenBoldIcon from "../../../components/icon/NumberElevenBoldIcon";
import HorizontalCard from "../../../components/HorizontalCard";
import { db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function ElevenScreen() {
  const navigation = useNavigation();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElevenMatches = async () => {
      try {
        const q = query(collection(db, "matches"), where("category1", "==", "ฟุตบอล11คน"));
        const querySnapshot = await getDocs(q);
        const matchesData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() || {};
          matchesData.push({
            id: doc.id,
            ...data,
          });
        });

        setMatches(matchesData);
      } catch (error) {
        console.log("Error fetching 11-player matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchElevenMatches();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF1521" />
      </View>
    );
  }

  if (!matches.length) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "#ccc", fontSize: 16 }}>
          ยังไม่มีรายการแข่งขันบอล 11 คน
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF1521" barStyle="light-content" />

      <LinearGradient
        colors={["#14141400", "#FF1521"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <MaterialIcons
            name="arrow-back-ios"
            size={22}
            color="#fff"
            onPress={() => navigation.goBack()}
          />

          <View style={styles.textBox}>
            <Text style={styles.titleText}>ประเภทรายการ</Text>
            <Text style={styles.subTitleText}>บอล 11 คน</Text>
          </View>

          <NumberElevenBoldIcon size={50} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {matches.map((match) => (
          <HorizontalCard
            key={match.id}
            match={match}
            isRegistered={false}
            borderColor="#ff9499"
            buttonColor="#d7000b"
            buttonTextColor="#fff"
            registeredButtonColor="#444"
            registeredButtonTextColor="#ccc"
            titleColor="#ff5760"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414", paddingTop: 55, paddingHorizontal: 15 },
  headerBox: { width: '100%', height: 80, borderRadius: 20, paddingHorizontal: 15, justifyContent: "center" },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  textBox: { flex: 1, alignItems: "flex-end", marginEnd: 10 },
  titleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  scrollContainer: { marginTop: 15, width: "100%" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#141414" },
});
