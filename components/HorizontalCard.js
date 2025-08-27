import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HorizontalCard({
  match = {},
  isRegistered = false,
  disabled = false, // ✅ เพิ่ม prop disabled
  borderColor = '#07F469',
  buttonColor = '#154127',
  buttonTextColor = '#07F469',
  registeredButtonColor = '#444',
  registeredButtonTextColor = '#ccc',
  titleColor = '#07F469',
}) {
  const navigation = useNavigation();

  const handleRegister = () => {
    if (disabled) return; // ถ้า disabled ไม่ให้ทำงาน
    navigation.navigate("Detail", { match }); 
  };

  return (
    <View style={[styles.card, { borderColor, opacity: disabled ? 0.5 : 1 }]}>
      <Image
        source={match.promoImage ? { uri: match.promoImage } : require("../assets/f1.jpg")}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {match.fullname || "ไม่มีชื่อรายการ"}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          ประเภท : {match.category2 || "-"} | {match.playerType || "-"}
        </Text>
        <Text style={styles.teamCount}>
          {match.totalTeams || 0} / {match.teamAmount || 0} ทีม
        </Text>
        <View style={styles.footerRight}>
          <TouchableOpacity
            style={[
              styles.registerButton,
              { 
                backgroundColor: isRegistered || disabled ? registeredButtonColor : buttonColor,
              },
            ]}
            onPress={handleRegister}
            disabled={isRegistered || disabled} // ✅ ปิดปุ่มถ้าเต็มหรือสมัครแล้ว
          >
            <Text
              style={[
                styles.registerText,
                { color: isRegistered || disabled ? registeredButtonTextColor : buttonTextColor },
              ]}
            >
              {isRegistered ? "สมัครแล้ว" : disabled ? "เต็มแล้ว" : "สมัครเลย"} 
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Kanit-Regular",
    color: "#aaa",
  },
  footerRight: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  teamCount: {
    fontSize: 11,
    color: "#ccc",
    fontFamily: "Kanit-Regular",
    marginRight: 100,
  },
  registerButton: {
    width: 80,
    height: 28,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontFamily: "Kanit-SemiBold",
    fontSize: 12,
  },
});
