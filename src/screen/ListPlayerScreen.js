import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { FormLine } from "../../components/icon/FormLine";

export default function ListPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    teamName,
    players = [],
    staff  = [],
    matchName,
  } = route.params || {};

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
          <MaterialIcons
            name="arrow-back-ios"
            size={22}
            color="#fff"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.textBox}>
            <Text style={styles.titleText}>{teamName || "รายชื่อทีม"}</Text>
            <Text style={styles.subTitleText}>{matchName || "การแข่งขัน"}</Text>
          </View>
          <FormLine size={50} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
     {staff.filter(coach => coach?.name && coach?.image).length > 0 ? (
  <>
    <Text style={styles.label}>สตาฟโค้ช</Text>
    <View style={styles.staffContainer}>
      {staff
        .filter(coach => coach?.name && coach?.image) // ✅ กรองเฉพาะที่มีทั้ง name และ image
        .map((coach, index) => (
          <View key={index} style={styles.staffBox}>
            <Image source={{ uri: coach.image }} style={styles.staffImage} />
            <View style={styles.nameBox}>
              <Text style={styles.staffName}>{coach.name}</Text>
            </View>
          </View>
        ))}
    </View>
  </>
) : null}


       {players.filter(player => player?.name && player?.image).length > 0 && (
         <>
    <Text style={styles.label}>รายชื่อนักเตะ</Text>
    <View style={styles.staffContainer}>
      {players
        .filter(player => player?.name && player?.image) 
        .map((player, index) => (
          <View key={index} style={styles.staffBox}>
            <Image source={{ uri: player.image }} style={styles.staffImage} />
            {player.number && (
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{player.number}</Text>
              </View>
            )}
            <View style={styles.nameBox}>
              <Text style={styles.staffName}>{player.name}</Text>
            </View>
          </View>
        ))}
    </View>
  </>
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
  scrollContent: { paddingBottom: 50 },
  headerBox: {
    width: "100%",
    height: 80,
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textBox: { flex: 1, alignItems: "flex-end", marginEnd: 10 },
  titleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  label: {
    color: "#07F469",
    fontSize: 13,
    marginBottom: 8,
    fontFamily: "Kanit-SemiBold",
  },
  staffContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  staffBox: { width: "30%", alignItems: "center", marginBottom: 15 },
  staffImage: {
    width: 105,
    height: 130,
    borderWidth: 1,
    borderColor: "#07F469",
    borderRadius: 15,
    backgroundColor: "#333",
  },
  nameBox: {
    width: 105,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#07F469",
    borderRadius: 8,
    paddingVertical: 3,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  staffName: {
    color: "#141414",
    fontFamily: "Kanit-SemiBold",
    fontSize: 12,
    textAlign: "center",
  },
  numberBadge: {
    position: "absolute",
    right: 2,
    width: 40,
    height: 50,
    alignItems: "center",
    marginTop: -5,
    justifyContent: "center",
  },
  numberText: {
    color: "#07F469",
    fontFamily: "MuseoModerno-SemiBold",
    fontSize: 25,
  },
});
