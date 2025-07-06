import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Edit2 } from "../../components/icon/Edit2";

export default function OrganizerRegisterScreen({ navigation }) {
  const [fullname, setFullname] = useState("");
  const [organization, setOrganization] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = () => {
    if (!fullname || !organization || !contact) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    Alert.alert("ส่งคำขอสมัครเรียบร้อย", "รอการอนุมัติจากแอดมิน");
  };

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.textBox}>
            <Text style={styles.titleText}>สมัครเป็นฝ่ายจัด</Text>
            <Text style={styles.subTitleText}>
              สมัครแพ็คเกจเพื่อเป็นฝ่ายจัด
            </Text>
          </View>
          <Edit2 size={42} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.ScrollView}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={["#FFA726", "#F57C00"]} style={styles.card}>
          <Text style={styles.cardTitle}>Basic Plan</Text>
          <Text style={styles.cardPrice}>Free</Text>
          <Text style={styles.cardDesc}>For small business.</Text>

          <View style={styles.cardListItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardListText}>
              สร้างรายการได้ สูงสุด 2 รายการ / เดือน
            </Text>
          </View>
          <View style={styles.cardListItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardListText}>
              รับสมัครทีม สูงสุด 16 ทีม / รายการ
            </Text>
          </View>
          <View style={styles.cardListItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardListText}>จับฉลากทีมอัตโนมัติ</Text>
          </View>
          <View style={styles.cardListItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardListText}>ตารางแข่งอัตโนมัติ</Text>
          </View>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() =>
              navigation.navigate("Organizerform", { plan: "basic" })
            }
          >
            <Text style={styles.cardButtonText}>สมัครเลย</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient colors={["#86AEFF", "#673AB7"]} style={styles.card}>
          <Text style={styles.cardTitle}>Advanced Plan</Text>
          <Text style={styles.cardPrice2}>฿199 / เดือน</Text>
          <Text style={styles.cardDesc2}>สำหรับฝ่ายจัดระดับมืออาชีพ</Text>

          <View style={styles.cardListItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardListText}>
              สร้างรายการได้ ไม่จำกัดรายการ
            </Text>
          </View>
          <View style={styles.cardListItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardListText}>รับสมัครทีม ไม่จำกัดทีม</Text>
          </View>
          <View style={styles.cardListItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardListText}>จับฉลากทีมอัตโนมัติ</Text>
          </View>
          <View style={styles.cardListItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.cardListText}>ตารางแข่งอัตโนมัติ</Text>
          </View>
          <TouchableOpacity
            style={[styles.cardButton, { backgroundColor: "#fff" }]}
            onPress={() =>
              navigation.navigate("Organizerform", { plan: "advanced" })
            }
          >
            <Text style={[styles.cardButtonText, { color: "#673AB7" }]}>
              สมัครเลย
            </Text>
          </TouchableOpacity>
        </LinearGradient>
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
  ScrollView: {
    marginTop: 10,
    marginBottom: 40,
  },
  headerBox: {
    height: 80,
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: "row",
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

  card: {
    marginTop: 20,
    backgroundColor: "#BD7B1E",
    borderRadius: 20,
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "MuseoModerno-SemiBold",
  },
  cardPrice: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "MuseoModerno-SemiBold",
    marginTop: 2,
  },
  cardDesc: {
    color: "#fff",
    marginVertical: 10,
    fontFamily: "MuseoModerno-SemiBold",
    lineHeight: 20,
    fontSize: 13,
  },
  cardListItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 2,
  },
  cardListText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Kanit-Regular",
  },
  cardButton: {
    backgroundColor: "#202020",
    paddingVertical: 11,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#FFBF66",
    fontSize: 15,
    fontFamily: "Kanit-SemiBold",
  },
  cardDesc2: {
    color: "#fff",
    marginVertical: 10,
    fontFamily: "Kanit-SemiBold",
    lineHeight: 20,
    fontSize: 13,
  },
  cardPrice2: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Kanit-SemiBold",
    marginTop: 2,
  },
});
