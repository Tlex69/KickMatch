import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HorizontalCard({
  image,
  title,
  subtitle,
  isRegistered = false,
  totalTeams = 12,
  maxTeams = 14,
  borderColor = '#07F469',
  buttonColor = '#154127',
  buttonTextColor = '#07F469',
  registeredButtonColor = '#444',
  registeredButtonTextColor = '#ccc',
  titleColor = '#07F469',
  hideTeamCount = false, 
}) {
  const navigation = useNavigation();

  const handleRegister = () => {
    navigation.navigate("Detail", {
      title,
      subtitle,
      totalTeams,
      maxTeams,
    });
  };

  return (
    <View style={[styles.card, { borderColor }]}>
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>

        <Text
          style={[
            styles.teamCount,
            hideTeamCount && { opacity: 0 }, 
          ]}
        >
          {totalTeams} / {maxTeams} ทีม
        </Text>

        <View style={styles.footerRight}>
          <TouchableOpacity
            style={[
              styles.registerButton,
              {
                backgroundColor: isRegistered ? registeredButtonColor : buttonColor,
              },
            ]}
            onPress={handleRegister}
          >
            <Text
              style={[
                styles.registerText,
                { color: isRegistered ? registeredButtonTextColor : buttonTextColor },
              ]}
            >
              {isRegistered ? "รายละเอียด" : "รายละเอียด"}
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