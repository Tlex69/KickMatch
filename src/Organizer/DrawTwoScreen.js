import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DiceIcon from "../../components/icon/DiceIcon";
import { db } from "../../firebase";

export default function DrawTwoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { matchId, startTime: startTimeParam } = route.params; // รับ startTime จากหน้าแรก
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pairs, setPairs] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  if (!matchId) return setLoading(false);

  const fetchData = async () => {
    try {
      const matchRef = doc(db, "matches", matchId);
      const matchSnap = await getDoc(matchRef);
      if (!matchSnap.exists()) {
        console.log("No such match!");
        setLoading(false);
        return;
      }
      const match = matchSnap.data();
      setMatchData(match);

      // ใช้ startTime ที่ส่งมาจากหน้าแรก ถ้าไม่มีค่อย fallback
      let startTime = startTimeParam
        ? startTimeParam.seconds
          ? new Date(startTimeParam.seconds * 1000)
          : new Date(startTimeParam)
        : match.startTime
        ? new Date(match.startTime.seconds * 1000)
        : new Date();

      const q = query(
        collection(db, "registrations"),
        where("matchId", "==", matchId)
      );
      const teamSnap = await getDocs(q);
      const teamsData = [];
      teamSnap.forEach((doc) => {
        const data = doc.data() || {};
        teamsData.push({
          id: doc.id,
          teamName: data.teamName || "ไม่ระบุชื่อทีม",
          teamLogo: data.teamLogo || null,
          teamColor: data.teamColor || "",
        });
      });

      let tempPairs = [];

      if (match.category2 === "บอลลีก") {
        //ลีก: ทุกทีมเจอกันครบ
        for (let i = 0; i < teamsData.length; i++) {
          for (let j = i + 1; j < teamsData.length; j++) {
            tempPairs.push({
              teamA: teamsData[i],
              teamB: teamsData[j],
              matchTime: new Date(startTime),
              round: "ลีก",
            });
            startTime = new Date(startTime.getTime() + 55 * 60000);
          }
        }
      } else {
        // แบบ knockout: สุ่มทีม
        for (let i = teamsData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [teamsData[i], teamsData[j]] = [teamsData[j], teamsData[i]];
        }

        for (let i = 0; i < teamsData.length; i += 2) {
          const teamA = teamsData[i];
          const teamB = teamsData[i + 1] || null;
          tempPairs.push({
            teamA,
            teamB,
            matchTime: new Date(startTime),
            round: "รอบแรก",
          });
          startTime = new Date(startTime.getTime() + 55 * 60000);
        }
      }

      setPairs(tempPairs);
      setTeams(teamsData);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [matchId]);


  const handleSaveDraw = async () => {
    if (!pairs.length) return;

    setSaving(true);
    try {
      const drawRef = doc(db, "draws", matchId); 
      await setDoc(drawRef, {
        matchId,
        pairs: pairs.map((pair) => ({
          teamA: pair.teamA,
          teamB: pair.teamB,
          round: pair.round,
          matchTime: pair.matchTime.toISOString(),
        })),
      });

      Alert.alert(
        "สำเร็จ",
        "บันทึกการจับฉลากเรียบร้อยแล้ว",
        [
          {
            text: "ตกลง",
            onPress: () => navigation.navigate("HomeO"),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log("Error saving draw:", error);
      Alert.alert("ผิดพลาด", "ไม่สามารถบันทึกการจับฉลากได้");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#07F469" />
      </View>
    );
  }

  if (!teams.length) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "#ccc", fontSize: 16 }}>
          ยังไม่มีทีมลงทะเบียน
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={["#14141400", "#07F469"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <MaterialIcons
            name="arrow-back"
            size={26}
            color="#fff"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.textBox}>
            <Text style={styles.titleText}>จับฉลากการแข่งขัน</Text>
            <Text style={styles.subTitleText}>
              {matchData?.fullname || "ไม่พบชื่อแมตช์"}
            </Text>
          </View>
          <DiceIcon size={50} color="#fff" />
        </View>
      </LinearGradient>

      {/* Teams */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {pairs.map((pair, index) => {
          const isGreyRound =
            pair.round.includes("รอบรองชนะเลิศ") ||
            pair.round.includes("รอบชิง");
          return (
            <View
              key={index}
              style={[
                styles.pairBox,
                isGreyRound && { backgroundColor: "#333" },
              ]}
            >
              <View style={styles.teamBox}>
                {pair.teamA.teamLogo && !isGreyRound && (
                  <Image
                    source={{ uri: pair.teamA.teamLogo }}
                    style={styles.teamLogo}
                  />
                )}
                <Text
                  style={[styles.teamName, isGreyRound && { color: "#999" }]}
                >
                  {pair.teamA.teamName}
                </Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <View
                  style={[
                    styles.timeBox,
                    isGreyRound && { backgroundColor: "#555" },
                  ]}
                >
                  <Text
                    style={[styles.timeText, isGreyRound && { color: "#999" }]}
                  >
                    {pair.matchTime
                      ? pair.matchTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}{" "}
                    
                  </Text>
                </View>
                <Text
                  style={[styles.roundText, isGreyRound && { color: "#999" }]}
                >
                  {pair.round}
                </Text>
                <Text style={[styles.vsText, isGreyRound && { color: "#999" }]}>
                  VS
                </Text>
              </View>

              <View style={styles.teamBox}>
                {pair.teamB ? (
                  <>
                    {pair.teamB.teamLogo && !isGreyRound && (
                      <Image
                        source={{ uri: pair.teamB.teamLogo }}
                        style={styles.teamLogo}
                      />
                    )}
                    <Text
                      style={[
                        styles.teamName,
                        isGreyRound && { color: "#999" },
                      ]}
                    >
                      {pair.teamB.teamName}
                    </Text>
                  </>
                ) : (
                  <Text
                    style={[styles.teamName, isGreyRound && { color: "#999" }]}
                  >
                    พักรอบ
                  </Text>
                )}
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveDraw}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "กำลังบันทึก..." : "ยืนยันการจับฉลาก"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  headerBox: {
    width: "95%",
    height: 90,
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  headerContent: { flexDirection: "row", alignItems: "center" },
  textBox: { flex: 1, alignItems: "flex-end", marginEnd: 10 },
  titleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  pairBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 20,
    width: "100%",
    height: 140,
    marginBottom: 10,
    borderRadius: 15,
  },
  teamBox: { alignItems: "center", flex: 1 },
  teamLogo: { width: 60, height: 65, borderRadius: 20, marginBottom: 5 },
  teamName: {
    color: "#07F469",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Kanit-SemiBold",
  },
  vsText: {
    color: "#07F469",
    fontSize: 35,
    fontFamily: "MuseoModerno-Bold",
    marginHorizontal: 10,
    marginBottom: 5,
    marginTop: -10,
  },
  timeBox: {
    backgroundColor: "#154127",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 15,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  timeText: {
    color: "#07F469",
    fontSize: 12,
    fontFamily: "Kanit-Regular",
    textAlign: "center",
  },
  roundText: {
    color: "#07F469",
    fontSize: 9,
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Kanit-Regular",
  },
  saveButton: {
    backgroundColor: "#07F469",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#141414",
    fontSize: 16,
    fontFamily: "Kanit-SemiBold",
  },
});