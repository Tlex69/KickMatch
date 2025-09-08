import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FootballIcon } from "../../components/icon/FootballIcon";

// Firebase
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  setDoc,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function ControlMatchScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { match, fullname, matchId } = route.params;

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  const shakeAnimA = useRef(new Animated.Value(0)).current;
  const shakeAnimB = useRef(new Animated.Value(0)).current;

  const shake = (anim) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const decrementScore = (score, setScore, anim) => {
    if (score > 0) setScore(score - 1);
    else shake(anim);
  };

  // โหลดสกอร์ + สถานะจาก Firestore
  const fetchScores = async () => {
    if (!matchId) return;
    try {
      const resultsCol = collection(db, "results");
      const q = query(resultsCol, where("matchId", "==", matchId));
      const querySnap = await getDocs(q);

      querySnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.teamAId === match.teamA?.id && data.teamBId === match.teamB?.id) {
          setScoreA(data.scoreA || 0);
          setScoreB(data.scoreB || 0);
          setIsEnded(data.isEnded || false);
        }
      });
    } catch (error) {
      console.error("Fetch Scores Error:", error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  // อัพเดทผลล่าสุด
  const handleUpdateScore = async () => {
    if (isEnded) return;
    if (!matchId || !match.teamA?.id) {
      Alert.alert("ผิดพลาด", "ไม่พบข้อมูลทีม A");
      return;
    }

    try {
      const now = new Date();
      const resultRef = doc(
        db,
        "results",
        `${matchId}_${match.teamA.id}_${match.teamB?.id || "null"}`
      );

      await setDoc(
        resultRef,
        {
          matchId,
          teamAId: match.teamA.id,
          teamBId: match.teamB?.id || null,
          teamA: match.teamA.teamName,
          teamB: match.teamB?.teamName || null,
          teamALogo: match.teamA?.teamLogo || null,
          teamBLogo: match.teamB?.teamLogo || null,
          scoreA,
          scoreB,
          updatedAt: now,
        },
        { merge: true }
      );

      Alert.alert("สำเร็จ", "อัพเดทผลการแข่งขันแล้ว ✅");
    } catch (error) {
      console.error("Update Error:", error);
      Alert.alert("ผิดพลาด", "ไม่สามารถอัพเดทผลการแข่งขันได้");
    }
  };

  // ฟังก์ชันอัพเดทคะแนนลีก standings (ส่งสถิติทั้งหมด)
  const updateLeaguePoints = async (teamId, teamName, teamLogo, stats) => {
    if (!teamId) return;
    try {
      const teamRef = doc(db, "standings", teamId);
      const teamSnap = await getDoc(teamRef);

      if (teamSnap.exists()) {
        const current = teamSnap.data();
        await updateDoc(teamRef, {
          teamName,
          teamLogo,
          played: (current.played || 0) + 1,
          win: (current.win || 0) + stats.win,
          draw: (current.draw || 0) + stats.draw,
          lose: (current.lose || 0) + stats.lose,
          goalsFor: (current.goalsFor || 0) + stats.goalsFor,
          goalsAgainst: (current.goalsAgainst || 0) + stats.goalsAgainst,
          goalDifference:
            (current.goalsFor || 0) +
            stats.goalsFor -
            ((current.goalsAgainst || 0) + stats.goalsAgainst),
          points: (current.points || 0) + stats.points,
          updatedAt: new Date(),
        });
      } else {
        await setDoc(teamRef, {
          teamId,
          teamName,
          teamLogo,
          played: 1,
          win: stats.win,
          draw: stats.draw,
          lose: stats.lose,
          goalsFor: stats.goalsFor,
          goalsAgainst: stats.goalsAgainst,
          goalDifference: stats.goalsFor - stats.goalsAgainst,
          points: stats.points,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Update League Points Error:", error);
    }
  };

  const handleEndMatch = async () => {
  if (isEnded) return;
  if (!matchId) return;

  try {
    let winner = null;
    let loser = null;

    if (scoreA > scoreB) {
      winner = match.teamA;
      loser = match.teamB;
    } else if (scoreB > scoreA) {
      winner = match.teamB;
      loser = match.teamA;
    } else {
      winner = null; // เสมอ
      loser = null;
    }

    const matchRef = doc(
      db,
      "results",
      `${matchId}_${match.teamA.id}_${match.teamB?.id || "null"}`
    );

    await setDoc(
      matchRef,
      {
        matchId,
        teamAId: match.teamA.id,
        teamBId: match.teamB?.id || null,
        teamA: match.teamA.teamName,
        teamB: match.teamB?.teamName || null,
        teamALogo: match.teamA?.teamLogo || null,
        teamBLogo: match.teamB?.teamLogo || null,
        scoreA,
        scoreB,
        winner: winner?.teamName || null,
        loser: loser?.teamName || null,
        isEnded: true,
        endedAt: new Date(),
        group: match.group || null, // บันทึกกรุ๊ป
      },
      { merge: true }
    );

    // อัพเดท standings
    const updateStats = async (team, stats) => {
      if (!team?.id) return;
      const teamRef = doc(db, "standings", team.id);
      const teamSnap = await getDoc(teamRef);

      if (teamSnap.exists()) {
        const current = teamSnap.data();
        await updateDoc(teamRef, {
          played: (current.played || 0) + 1,
          win: (current.win || 0) + stats.win,
          draw: (current.draw || 0) + stats.draw,
          lose: (current.lose || 0) + stats.lose,
          goalsFor: (current.goalsFor || 0) + stats.goalsFor,
          goalsAgainst: (current.goalsAgainst || 0) + stats.goalsAgainst,
          goalDifference:
            (current.goalsFor || 0) + stats.goalsFor - ((current.goalsAgainst || 0) + stats.goalsAgainst),
          points: (current.points || 0) + stats.points,
          updatedAt: new Date(),
        });
      } else {
        await setDoc(teamRef, {
          teamId: team.id,
          teamName: team.teamName,
          teamLogo: team?.teamLogo || null,
          played: 1,
          win: stats.win,
          draw: stats.draw,
          lose: stats.lose,
          goalsFor: stats.goalsFor,
          goalsAgainst: stats.goalsAgainst,
          goalDifference: stats.goalsFor - stats.goalsAgainst,
          points: stats.points,
          updatedAt: new Date(),
        });
      }
    };

    if (scoreA > scoreB) {
      await updateStats(match.teamA, { win: 1, draw: 0, lose: 0, goalsFor: scoreA, goalsAgainst: scoreB, points: 3 });
      await updateStats(match.teamB, { win: 0, draw: 0, lose: 1, goalsFor: scoreB, goalsAgainst: scoreA, points: 0 });
    } else if (scoreB > scoreA) {
      await updateStats(match.teamB, { win: 1, draw: 0, lose: 0, goalsFor: scoreB, goalsAgainst: scoreA, points: 3 });
      await updateStats(match.teamA, { win: 0, draw: 0, lose: 1, goalsFor: scoreA, goalsAgainst: scoreB, points: 0 });
    } else {
      await updateStats(match.teamA, { win: 0, draw: 1, lose: 0, goalsFor: scoreA, goalsAgainst: scoreB, points: 1 });
      await updateStats(match.teamB, { win: 0, draw: 1, lose: 0, goalsFor: scoreB, goalsAgainst: scoreA, points: 1 });
    }

    setIsEnded(true);
    Alert.alert("สำเร็จ", `การแข่งขันสิ้นสุดแล้ว\nผล: ${scoreA} - ${scoreB}`);
    navigation.goBack();
  } catch (error) {
    console.error("End Match Error:", error);
    Alert.alert("ผิดพลาด", "ไม่สามารถจบการแข่งขันได้");
  }
};

  if (!match)
    return (
      <View style={styles.loader}>
        <Text style={{ color: "#ccc" }}>ไม่พบข้อมูลการแข่งขัน</Text>
      </View>
    );

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
            <Text style={styles.titleText}>ควบคุมการแข่งขัน</Text>
            <Text style={styles.subTitleText}>{fullname}</Text>
          </View>
          <FootballIcon size={50} color="#fff" />
        </View>
      </LinearGradient>

      {/* Match content */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 180 }}>
        <View style={styles.matchBox}>
          {/* ทีม A */}
          <View style={[styles.teamBox, { marginRight: 20 }]}>
            {match.teamA?.teamLogo && (
              <Image source={{ uri: match.teamA.teamLogo }} style={styles.teamLogo} />
            )}
            <Text style={styles.teamName}>
              {match.teamA?.teamName || "ไม่ระบุทีม A"}
            </Text>
            <Animated.View style={[styles.scoreBox, { transform: [{ translateX: shakeAnimA }] }]}>
              <Text style={styles.scoreText}>{scoreA}</Text>
            </Animated.View>
            {!isEnded && (
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => setScoreA(scoreA + 1)} style={styles.iconButton}>
                  <MaterialIcons name="add" size={15} color="#07F469" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => decrementScore(scoreA, setScoreA, shakeAnimA)}
                  style={styles.iconButton}
                >
                  <MaterialIcons name="remove" size={15} color="#07F469" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* VS */}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* ทีม B */}
          <View style={[styles.teamBox, { marginLeft: 20 }]}>
            {match.teamB?.teamLogo && (
              <Image source={{ uri: match.teamB.teamLogo }} style={styles.teamLogo} />
            )}
            <Text style={styles.teamName}>
              {match.teamB?.teamName || "ไม่ระบุทีม B"}
            </Text>
            <Animated.View style={[styles.scoreBox, { transform: [{ translateX: shakeAnimB }] }]}>
              <Text style={styles.scoreText}>{scoreB}</Text>
            </Animated.View>
            {!isEnded && (
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => setScoreB(scoreB + 1)} style={styles.iconButton}>
                  <MaterialIcons name="add" size={15} color="#07F469" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => decrementScore(scoreB, setScoreB, shakeAnimB)}
                  style={styles.iconButton}
                >
                  <MaterialIcons name="remove" size={15} color="#07F469" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* กล่องจัดการผลอื่นๆ */}
        <View style={styles.boxtitle}>
          <Text style={styles.title}>ควบคุมอื่นๆ</Text>
        </View>
        <TouchableOpacity
          style={styles.fullWidthButton}
          onPress={() => {
            const teams = [
              { ...match.teamA, players: match.teamA?.players || [] },
              { ...match.teamB, players: match.teamB?.players || [] },
            ];
            navigation.navigate("ControlOthersScreen", {
              match,
              fullname,
              matchId,
              teams,
              teamAId: match.teamA.id,
              teamBId: match.teamB.id,
            });
          }}
        >
          <Text style={styles.buttonText}>จัดการผลอื่นๆ</Text>
          <AntDesign name="right" size={18} color="#07F469" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fullWidthButton, { marginTop: 10, backgroundColor: "#202020" }]}
          onPress={() => {
            navigation.navigate("StreamerScreen", {
              match,
              matchId,
              fullname,
            });
          }}
        >
          <Text style={[styles.buttonText, { color: "#07F469" }]}>เริ่มไลฟ์สด</Text>
          <MaterialIcons name="live-tv" size={18} color="#07F469" />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottomButtons}>
        {isEnded ? (
          <Text style={styles.buttonSubText}>การแข่งขันนี้สิ้นสุดแล้ว ✅</Text>
        ) : (
          <>
            <Text style={styles.buttonSubText}>
              *อัพเดทผลล่าสุดเพื่อให้ผู้ใช้ได้รู้ผลการแข่งขัน*
            </Text>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateScore}>
              <Text style={styles.buttonupText}>อัพเดทผลล่าสุด</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.endmatch, { marginTop: 10 }]}
              onPress={handleEndMatch}
            >
              <Text style={styles.buttonendText}>จบการแข่งขัน</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#141414" },
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
  titleText: { color: "#fff", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  matchBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  teamBox: { alignItems: "center", flex: 1 },
  teamLogo: { width: 65, height: 70, borderRadius: 20, marginBottom: 15 },
  teamName: {
    color: "#07F469",
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "Kanit-SemiBold",
    textAlign: "center",
  },
  vsText: { color: "#07F469", fontSize: 30, marginTop: 30, fontFamily: "MuseoModerno-SemiBold" },
  scoreBox: {
    backgroundColor: "#154127",
    borderWidth: 1,
    borderColor: "#07F469",
    borderRadius: 15,
    width: 90,
    height: 105,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: { color: "#07F469", fontSize: 40, fontFamily: "Kanit-SemiBold" },
  buttonRow: { flexDirection: "row", justifyContent: "center", marginTop: 2 },
  iconButton: {
    backgroundColor: "#154127",
    borderWidth: 1,
    borderColor: "#07F469",
    borderRadius: 8,
    padding: 5,
    marginHorizontal: 5,
    width: 40,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  boxtitle: {
    backgroundColor: "#202020",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginBottom: 10,
    alignSelf: "flex-start",
    marginTop: 22,
  },
  title: { color: "#07F469", fontSize: 12, fontFamily: "Kanit-SemiBold" },
  fullWidthButton: {
    marginTop: 2,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#202020",
  },
  buttonText: { color: "#07F469", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  bottomButtons: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    width: "90%",
    alignSelf: "center",
    flexDirection: "column",
  },
  buttonSubText: {
    color: "#07F469",
    fontSize: 10,
    textAlign: "center",
    marginBottom: 6,
    fontFamily: "Kanit-Regular",
  },
  updateButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: "#07F469",
    alignItems: "center",
  },
  buttonupText: { color: "#154127", fontSize: 16, fontFamily: "Kanit-SemiBold" },
  endmatch: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: "#F44607",
    alignItems: "center",
  },
  buttonendText: { color: "#fff", fontSize: 16, fontFamily: "Kanit-SemiBold" },
});
