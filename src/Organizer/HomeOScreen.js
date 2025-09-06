import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Octicons } from "@expo/vector-icons";

export default function HomeOScreen({ route }) {
  const { plan = "ฝ่ายจัด" } = route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const gradient1Opacity = fadeAnim;
  const gradient2Opacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const handleSubmitFeedback = () => {
    if (feedback.trim() === "") {
      Alert.alert("กรุณากรอกข้อความก่อนส่ง");
      return;
    }
    Alert.alert("ขอบคุณสำหรับข้อเสนอแนะของคุณ!");
    setFeedback(""); // เคลียร์ข้อความหลังส่ง
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title1}>
            Kick<Text style={styles.title2}>Match</Text>
          </Text>
          <View style={styles.planBadge}>
            <Text style={styles.planText}>{plan}</Text>
          </View>
        </View>
        <View style={styles.bellCircle}>
          <Octicons name="bell" size={17} color="#07F469" />
        </View>
      </View>

      <View style={styles.boxtitle}>
        <Text style={styles.title}>ประโยชน์ต่อผู้ใช้ฝ่ายจัด</Text>
      </View>

      {/* การ์ดเก่า + Gradient Animated */}
<View style={{ marginTop: 10 }}>
  <Animated.View style={[styles.card, { overflow: "hidden" }]}>
    {/* Gradient Animated */}
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: gradient1Opacity }]}>
      <LinearGradient
        colors={["#093d8cff", "#ff7300ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: gradient2Opacity }]}>
      <LinearGradient
        colors={["#7869FF", "#457EF0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>

    {/* เนื้อหาการ์ด */}
    <View style={{ alignItems: "center" }}>
      <Text style={styles.cardTitle}>การลงทะเบียนรายการแข่งขัน</Text>
      <Text style={styles.cardText}>
        การลงทะเบียนรายการแข่งขันต้องเสียค่าใช้จ่าย ค่าใช้ไม่เกิน 100 บาท ต่อรายการแข่งขัน
      </Text>
      <Text style={styles.cardTextSmall}>
        ค่าใช้จ่ายนี้จะช่วยสนับสนุนการพัฒนาและบำรุงรักษาระบบ
      </Text>
    </View>
  </Animated.View>
</View>


      {/* การ์ด Gradient Animated */}
      <View style={{ marginTop: 10 }}>
        <View style={styles.boxtitle}>
          <Text style={styles.title}>อื่นๆ</Text>
        </View>

        <View style={{ ...styles.card, overflow: "hidden", marginTop: 10 }}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: gradient1Opacity }]}
          >
            <LinearGradient
              colors={["#372C98", "#03C252"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: gradient2Opacity }]}
          >
            <LinearGradient
              colors={["#7869FF", "#457EF0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          <View style={{ alignItems: "center" }}>
            <Text style={styles.cardTitle}>รออัพเดท</Text>
            <Text style={styles.cardText}>
              ข้อมูลและฟีเจอร์เพิ่มเติมจะถูกอัพเดทเร็วๆ นี้
            </Text>
            <Text style={styles.cardTextSmall}>
              กรุณาติดตามอัปเดตจากผู้พัฒนา
            </Text>
          </View>
        </View>
      </View>

 
<View style={{ marginTop: 10 }}>
  <View style={styles.boxtitle}>
    <Text style={styles.title}>ข้อเสนอแนะ / Feedback</Text>
  </View>

  <View style={[styles.card, { flexDirection: "row", alignItems: "center", marginTop: 10 }]}>
    <TextInput
      style={[styles.input, { flex: 1, minHeight: 40, marginBottom: 0 }]}
      placeholder="พิมพ์ข้อเสนอแนะของคุณ..."
      placeholderTextColor="#888"
      value={feedback}
      onChangeText={setFeedback}
      multiline={false}
    />
    <TouchableOpacity onPress={handleSubmitFeedback} style={{ marginLeft: 10 }}>
      <LinearGradient
        colors={["#07F469", "#03C252"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15 }}
      >
        <Text style={styles.submitText}>ส่ง</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingTop: 55,
    paddingHorizontal: 25,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title1: { color: "#fff", fontSize: 21, fontFamily: "MuseoModerno-Bold" },
  title2: { color: "#07F469" },
  planBadge: {
    marginLeft: 5,
    backgroundColor: "#DBB924",
    width: 40,
    height: 15,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 5,
  },
  planText: {
    color: "#fff",
    fontSize: 8,
    fontFamily: "Kanit-SemiBold",
    marginTop: 1,
  },
  bellCircle: {
    width: 33,
    height: 33,
    borderRadius: 20,
    backgroundColor: "#154127",
    justifyContent: "center",
    alignItems: "center",
  },
  boxtitle: {
    backgroundColor: "#202020",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  title: { color: "#07F469", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  card: {
    backgroundColor: "#1F1F1F",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginTop: 10,
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
    marginBottom: 10,
  },
  cardText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Kanit-Regular",
    textAlign: "center",
    marginBottom: 8,
  },
  cardTextSmall: {
    color: "#ccc",
    fontFamily: "Kanit-Regular",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
  backgroundColor: "#2A2A2A",
  color: "#fff",
  borderRadius: 15,
  paddingHorizontal: 10,
  fontFamily: "Kanit-Regular",
},

  submitButton: {
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  submitText: {
    color: "#141414",
    fontFamily: "Kanit-SemiBold",
    textAlign: "center",
  },
});
