import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HorizontalCard({
  image,
  title,
  subtitle,
  totalTeams = 0,
  maxTeams = 12,
  borderColor = '#07F469',
  titleColor = '#07F469',
  statusText = "เปิดรับสมัครอยู่",
  statusColor = "#07F469",
}) {
  const navigation = useNavigation();

  // คำนวณเปอร์เซ็นต์การสมัคร
// คำนวณเปอร์เซ็นต์การสมัคร
const progress = Math.min(totalTeams / maxTeams, 1);

  return (
    <View style={[styles.card, { borderColor }]}>
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>

        <View style={{ marginTop: 4 }}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
          <Text style={styles.teamCount}>
  สมัครแล้ว {totalTeams}/{maxTeams} ทีม
</Text>


          {/* Progress bar */}
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        <View style={styles.footerRight}>
          <TouchableOpacity
            style={[styles.registerButton]}
            onPress={() =>
              navigation.navigate("Detail", {
                title,
                subtitle,
                totalTeams,
                maxTeams,
              })
            }
          >
            <Text style={styles.registerText}>ดูรายชื่อทีม</Text>
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
  },
  image: {
    width: 100,
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 10,
    paddingRight: 15,
    paddingBottom: 15,
    position: "relative",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Kanit-Regular",
    color: "#aaa",
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Kanit-SemiBold",
    marginBottom: 2,
  },
  teamCount: {
    fontSize: 11,
    color: "#ccc",
    fontFamily: "Kanit-Regular",
  },
  progressBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    marginTop: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#07F469",
    borderRadius: 3,
  },
  footerRight: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  registerButton: {
    width: 80,
    height: 28,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#154127',
  },
  registerText: {
    fontFamily: "Kanit-SemiBold",
    fontSize: 12,
    color: '#07F469',
  },
});
