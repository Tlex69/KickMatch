import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ranking2 } from "../../components/icon/Ranking2";
import { DocFail } from "../../components/icon/DocFail"; 

export default function RankingScreen() {
  const [competitions, setCompetitions] = useState([]); 
  const team = { name: "ทีม A" }; 

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
            <Text style={styles.titleText}>สถิติทีม</Text>
            <Text style={styles.subTitleText}>สถิติที่เคยลงแข่ง</Text>
          </View>

          <Ranking2 size={45} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={competitions.length === 0 && styles.emptyContainer}
        showsVerticalScrollIndicator={false}
      >
        {competitions.length === 0 ? (
          <View style={styles.emptyContent}>
            <DocFail width={110} height={120} fill="#141414" />
            <Text style={styles.emptyText}>ยังไม่มีรายการ</Text>
          </View>
        ) : (
          <View style={styles.boxcard}>
            {/* แสดงรายการแข่งขันที่มี */}
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
  boxcard: {
    paddingBottom: 35,
    width: "100%",
  },
});
