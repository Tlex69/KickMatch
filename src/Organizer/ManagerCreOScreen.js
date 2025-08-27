import React, { useState, useEffect } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { RoundSupportAgent } from "../../components/icon/RoundSupportAgent";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

export default function ManagerCreOScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { matchId } = route.params;

  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  // ตรวจสอบว่าห้องนี้สร้างแล้วหรือยัง
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const q = query(collection(db, "rooms"), where("matchId", "==", matchId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const roomDoc = querySnapshot.docs[0];
          const roomData = roomDoc.data();
          setCreatedRoom({
            id: roomDoc.id,
            roomId: roomData.roomId,
            password: roomData.password,
          });
        }
      } catch (error) {
        console.log("Error fetching room:", error);
      }
    };
    fetchRoom();
  }, [matchId]);

  // ฟังจำนวนผู้เข้าร่วมแบบ realtime
  useEffect(() => {
    if (!createdRoom?.id) return;

    const participantsRef = collection(db, "rooms", createdRoom.id, "participants");
    const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
      setParticipantCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [createdRoom?.id]);

  const handleCreateRoom = async () => {
    if (!roomId || !password) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกทั้ง ID Room และรหัสผ่าน");
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "rooms"), {
        matchId,
        roomId,
        password,
        createdAt: new Date(),
      });

      setCreatedRoom({ id: docRef.id, roomId, password });
      Alert.alert("สำเร็จ", "สร้างห้องเรียบร้อยแล้ว!");
    } catch (error) {
      console.log("Error creating room:", error);
      Alert.alert("ผิดพลาด", "ไม่สามารถสร้างห้องได้");
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
            <Text style={styles.titleText}>สร้างห้องแข่งขัน</Text>
            <Text style={styles.subTitleText}>
              ให้ผู้ช่วยหรือผู้เล่นเข้าร่วมได้
            </Text>
          </View>

          <RoundSupportAgent width={50} height={50} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.boxtitle}>
          <Text style={styles.title}>ID Room และรหัสผ่าน</Text>
        </View>

        {!createdRoom ? (
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>ID Room</Text>
            <TextInput
              style={styles.inputField}
              placeholder="กรอก ID Room"
              placeholderTextColor="#888"
              value={roomId}
              onChangeText={setRoomId}
            />

            <Text style={styles.inputLabel}>รหัสผ่าน</Text>
            <TextInput
              style={styles.inputField}
              placeholder="กรอกรหัสผ่าน"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreateRoom}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "กำลังสร้าง..." : "สร้างห้อง"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>ID Room</Text>
            <TextInput
              style={[styles.inputField, { backgroundColor: "#ddd" }]}
              value={createdRoom.roomId}
              editable={false}
            />

            <Text style={styles.inputLabel}>รหัสผ่าน</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={[
                  styles.inputField,
                  { flex: 1, backgroundColor: "#ddd" },
                ]}
                value={createdRoom.password}
                secureTextEntry={!showPassword}
                editable={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ marginLeft: 8 }}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={22}
                  color="#07F469"
                  marginBottom={20}
                />
              </TouchableOpacity>
            </View>

            {/* แสดงจำนวนผู้เข้าร่วมแบบเส้น-ข้อความ-เส้น */}
            <View style={styles.participantBox}>
              <View style={styles.line} />
              <Text style={styles.participantText}>
                ผู้เข้าร่วม: {participantCount} คน
              </Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { marginTop: 20 }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.submitButtonText}>กลับไปหน้าหลัก</Text>
            </TouchableOpacity>
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
  textBox: { flex: 1, alignItems: "flex-end", marginEnd: 10 },
  titleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  scrollContainer: { marginTop: 15, width: "100%" },
  inputBox: { marginTop: 20, borderRadius: 10 },
  inputLabel: {
    color: "#07F469",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: "#fff",
    color: "#141414",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#07F469",
    fontFamily: "Kanit-Regular",
  },
  submitButton: {
    backgroundColor: "#07F469",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 15,
  },
  submitButtonText: {
    color: "#141414",
    fontSize: 16,
    fontFamily: "Kanit-SemiBold",
  },
  boxtitle: {
    backgroundColor: "#202020",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  title: { color: "#07F469", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  participantBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: "#07F469",
  },
  participantText: {
    color: "#07F469",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
    marginHorizontal: 8,
    textAlign: "center",
  },
});
