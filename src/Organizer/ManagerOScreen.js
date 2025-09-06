import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { RoundSupportAgent } from "../../components/icon/RoundSupportAgent";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function ManagerOScreen() {
  const navigation = useNavigation();
  const [inputRoomId, setInputRoomId] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!inputRoomId || !inputPassword) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกทั้ง ID Room และรหัสผ่าน");
      return;
    }

    setLoading(true);
    try {
      // ตรวจสอบ ID Room + Password
      const q = query(
        collection(db, "rooms"),
        where("roomId", "==", inputRoomId),
        where("password", "==", inputPassword)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const roomDoc = querySnapshot.docs[0];
        const roomData = roomDoc.data();

        // 🔹 เพิ่มผู้เข้าร่วมใน subcollection participants
        await addDoc(collection(db, "rooms", roomDoc.id, "participants"), {
          joinedAt: serverTimestamp(),
          // สามารถเพิ่ม userId, username ฯลฯ ได้
        });

        navigation.navigate("ScheduleScreen", { matchId: roomData.matchId });
      } else {
        Alert.alert("ผิดพลาด", "ID Room หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.log("Error joining room:", error);
      Alert.alert("ผิดพลาด", "เกิดข้อผิดพลาดในการเข้าห้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      <LinearGradient
        colors={["#14141400", "#07F469"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.textBox}>
            <Text style={styles.titleText}>เข้าร่วมห้องแข่งขัน</Text>
            <Text style={styles.subTitleText}>
              กรอก ID Room และรหัสผ่านเพื่อเข้าร่วม
            </Text>
          </View>

          <RoundSupportAgent width={50} height={50} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.boxtitle}>
          <Text style={styles.title}>กรอก ID Room กับ รหัสผ่าน</Text>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>ID Room</Text>
          <TextInput
            style={styles.inputField}
            placeholder="กรอก ID Room"
            placeholderTextColor="#888"
            value={inputRoomId}
            onChangeText={setInputRoomId}
          />

          <Text style={styles.inputLabel}>รหัสผ่าน</Text>
          <TextInput
            style={styles.inputField}
            placeholder="กรอกรหัสผ่าน"
            placeholderTextColor="#888"
            secureTextEntry
            value={inputPassword}
            onChangeText={setInputPassword}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleJoinRoom}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "กำลังตรวจสอบ..." : "เข้าร่วมห้อง"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414", paddingTop: 55, paddingHorizontal: 15 },
  headerBox: { width: "100%", height: 80, borderRadius: 20, paddingHorizontal: 15, justifyContent: "center" },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  textBox: { flex: 1, alignItems: "flex-end", marginEnd: 10 },
  titleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  scrollContainer: { marginTop: 15, width: "100%" },
  inputBox: { marginTop: 20, borderRadius: 10 },
  inputLabel: { color: "#07F469", fontSize: 13, fontFamily: "Kanit-SemiBold", marginBottom: 6 },
  inputField: { backgroundColor: "#fff", color: "#141414", borderRadius: 20, paddingVertical: 12, paddingHorizontal: 10, width: "100%", marginBottom: 25, borderWidth: 1, borderColor: "#07F469", fontFamily: "Kanit-Regular" },
  submitButton: { backgroundColor: "#07F469", borderRadius: 25, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  submitButtonText: { color: "#141414", fontSize: 16, fontFamily: "Kanit-SemiBold" },
  boxtitle: { backgroundColor: "#202020", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, alignSelf: "flex-start" },
  title: { color: "#07F469", fontSize: 13, fontFamily: "Kanit-SemiBold" },
});
