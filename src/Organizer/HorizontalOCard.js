import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HorizontalCard({
  image,
  title, 
  subtitle,
  totalTeams = 12,
  maxTeams = 14,
  matchId,
  onStartPress, // ฟังก์ชันรับ matchId จาก parent
}) {
  const navigation = useNavigation();
  const [status, setStatus] = useState("waiting"); // waiting | in_progress

  const canStart = totalTeams >= maxTeams && status === "waiting";

  const handleRegister = () => {
    navigation.navigate("Detail", { title, subtitle, totalTeams, maxTeams });
  };

  const handleStart = () => {
    if (!canStart) return; 

    setStatus("in_progress"); 
    if (onStartPress) onStartPress(matchId); 
  };

  return (
    <View style={[styles.card]}>
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>ประเภท : {subtitle}</Text>
        <Text style={styles.teamCount}>{totalTeams} / {maxTeams} ทีม</Text>

        <View style={styles.footerRight}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={true}
          >
            <Text style={styles.registerText}>สถานะ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.startButton,
              {
                backgroundColor:
                  status === "in_progress" ? "#555" : canStart ? "#07F469" : "#555",
              },
            ]}
            onPress={handleStart}
            disabled={!canStart || status === "in_progress"}
          >
            <Text
              style={[
                styles.startButtonText,
                {
                  color:
                    status === "in_progress" ? "#ccc" : canStart ? "#141414" : "#ccc",
                },
              ]}
            >
              {status === "in_progress" ? "กำลังแข่ง" : "เริ่มแข่ง"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 18,
    width: "100%",
    height: 105,
    borderWidth: 1,
    borderColor: "#07F469",
  },
  image: { width: 100, height: "100%" },
  content: { flex: 1, padding: 10, paddingRight: 15, justifyContent: "space-between" },
  title: { fontSize: 14, fontFamily: "Kanit-SemiBold", marginBottom: 4, color: "#07F469" },
  subtitle: { fontSize: 11, fontFamily: "Kanit-Regular", color: "#aaa" },
  teamCount: { fontSize: 11, color: "#ccc", fontFamily: "Kanit-Regular", marginRight: 100 },
  footerRight: { position: "absolute", bottom: 10, right: 10, gap: 8 },
  registerButton: { width: 80, height: 28, borderRadius: 12, justifyContent: "center", alignItems: "center", backgroundColor: "#154127" },
  registerText: { fontFamily: "Kanit-SemiBold", fontSize: 12, color: "#07F469" },
  startButton: { borderRadius: 15, paddingHorizontal: 10, paddingVertical: 4 },
  startButtonText: { fontFamily: "Kanit-SemiBold", fontSize: 12, textAlign: "center" },
});
