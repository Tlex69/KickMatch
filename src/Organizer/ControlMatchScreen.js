import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { FootballIcon } from "../../components/icon/FootballIcon";

// Firebase
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function ControlMatchScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { match, fullname, matchId, teamA, teamB } = route.params;

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const shakeAnimA = useRef(new Animated.Value(0)).current;
  const shakeAnimB = useRef(new Animated.Value(0)).current;

  const shake = (anim) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const decrementScore = (score, setScore, anim) => {
    if (score > 0) setScore(score - 1);
    else shake(anim);
  };

  const fetchScores = async () => {
    if (!matchId) return;

    try {
      const resultsCol = collection(db, "results");
      const q = query(resultsCol, where("matchId", "==", matchId));
      const querySnap = await getDocs(q);

      querySnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (
          data.teamAId === match.teamA.id &&
          data.teamBId === match.teamB.id
        ) {
          setScoreA(data.scoreA || 0);
          setScoreB(data.scoreB || 0);
        }
      });
    } catch (error) {
      console.error("Fetch Scores Error:", error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleUpdateScore = async () => {
    if (!matchId || !match.teamA?.id) {
      console.log("ข้อมูลทีมไม่สมบูรณ์", match);
      Alert.alert("ผิดพลาด", "ไม่พบข้อมูลทีม A");
      return;
    }

    try {
      const resultsCol = collection(db, "results");
      let querySnap;

      if (match.teamB?.id) {
        const q = query(
          resultsCol,
          where("matchId", "==", matchId),
          where("teamAId", "==", match.teamA.id),
          where("teamBId", "==", match.teamB.id)
        );
        querySnap = await getDocs(q);
      } else {
        // กรณีทีม B ไม่มี ให้ดึงเฉพาะ teamA
        const q = query(
          resultsCol,
          where("matchId", "==", matchId),
          where("teamAId", "==", match.teamA.id)
        );
        querySnap = await getDocs(q);
      }

      const now = new Date();

      if (!querySnap.empty) {
        const docId = querySnap.docs[0].id;
        const resultRef = doc(db, "results", docId);
        await setDoc(
          resultRef,
          {
            matchId,
            teamAId: match.teamA.id,
            teamBId: match.teamB?.id || null,
            teamA: match.teamA.teamName,
            teamB: match.teamB?.teamName || null,
            scoreA,
            scoreB,
            updatedAt: now,
          },
          { merge: true }
        );
      } else {
        const newResultRef = doc(resultsCol);
        await setDoc(newResultRef, {
          matchId,
          teamAId: match.teamA.id,
          teamBId: match.teamB?.id || null,
          teamA: match.teamA.teamName,
          teamB: match.teamB?.teamName || null,
          scoreA,
          scoreB,
          updatedAt: now,
        });
      }

      Alert.alert("สำเร็จ", "อัพเดทผลการแข่งขันแล้ว ✅");
    } catch (error) {
      console.error("Update Error:", error);
      Alert.alert("ผิดพลาด", "ไม่สามารถอัพเดทผลการแข่งขันได้");
    }
  };

  const handleEndMatch = async () => {
  if (!matchId) return;

  try {
    let winner = null;
    let loser = null;

    // กำหนดผู้ชนะ/แพ้
    if (scoreA > scoreB) {
      winner = match.teamA;
      loser = match.teamB;
    } else if (scoreB > scoreA) {
      winner = match.teamB;
      loser = match.teamA;
    } else {
      // กรณีเสมอ ให้เลือก teamA เป็นผู้ชนะโดยปริยาย
      winner = match.teamA;
      loser = match.teamB;
    }

    const matchRef = doc(db, "results", `${matchId}_${match.teamA.id}_${match.teamB?.id || "null"}`);

    await setDoc(
      matchRef,
      {
        matchId,
        teamAId: match.teamA.id,
        teamBId: match.teamB?.id || null,
        teamA: match.teamA.teamName,
        teamB: match.teamB?.teamName || null,
        scoreA,
        scoreB,
        winner: winner.teamName,
        winnerId: winner.id,
        loser: loser?.teamName || null,
        loserId: loser?.id || null,
        endedAt: new Date(),
      },
      { merge: true }
    );

    Alert.alert(
      "สำเร็จ",
      `การแข่งขันสิ้นสุดแล้ว\nผู้ชนะ: ${winner.teamName}\nผู้แพ้: ${loser?.teamName || "ไม่มี"}`
    );

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

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 180 }}>
        <View style={styles.matchBox}>
          {/* ทีม A */}
          <View style={[styles.teamBox, { marginRight: 20 }]}>
            {match.teamA?.teamLogo && (
              <Image
                source={{ uri: match.teamA.teamLogo }}
                style={styles.teamLogo}
              />
            )}
            <Text style={styles.teamName}>
              {match.teamA?.teamName || "ไม่ระบุทีม A"}
            </Text>

            <Animated.View
              style={[
                styles.scoreBox,
                { transform: [{ translateX: shakeAnimA }] },
              ]}
            >
              <Text style={styles.scoreText}>{scoreA}</Text>
            </Animated.View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setScoreA(scoreA + 1)}
                style={styles.iconButton}
              >
                <MaterialIcons name="add" size={15} color="#07F469" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => decrementScore(scoreA, setScoreA, shakeAnimA)}
                style={styles.iconButton}
              >
                <MaterialIcons name="remove" size={15} color="#07F469" />
              </TouchableOpacity>
            </View>
          </View>

          {/* VS */}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.scoreDivider} />
          </View>

          {/* ทีม B */}
          <View style={[styles.teamBox, { marginLeft: 20 }]}>
            {match.teamB?.teamLogo && (
              <Image
                source={{ uri: match.teamB.teamLogo }}
                style={styles.teamLogo}
              />
            )}
            <Text style={styles.teamName}>
              {match.teamB?.teamName || "ไม่ระบุทีม B"}
            </Text>

            <Animated.View
              style={[
                styles.scoreBox,
                { transform: [{ translateX: shakeAnimB }] },
              ]}
            >
              <Text style={styles.scoreText}>{scoreB}</Text>
            </Animated.View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setScoreB(scoreB + 1)}
                style={styles.iconButton}
              >
                <MaterialIcons name="add" size={15} color="#07F469" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => decrementScore(scoreB, setScoreB, shakeAnimB)}
                style={styles.iconButton}
              >
                <MaterialIcons name="remove" size={15} color="#07F469" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
      </ScrollView>

      <View style={styles.bottomButtons}>
        <Text style={styles.buttonSubText}>
          *อัพเดทผลล่าสุดเพื่อให้ผู้ใช้ได้รู้ผลการแข่งขัน*
        </Text>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateScore}
        >
          <Text style={styles.buttonupText}>อัพเดทผลล่าสุด</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.endmatch, { marginTop: 10 }]}
          onPress={handleEndMatch}
        >
          <Text style={styles.buttonendText}>จบการแข่งขัน</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
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
  matchBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    width: "100%",
    borderRadius: 15,
    marginBottom: 10,
    marginTop: -10,
  },
  teamBox: { alignItems: "center", flex: 1 },
  teamLogo: { width: 65, height: 70, borderRadius: 20, marginBottom: 15 },
  teamName: {
    color: "#07F469",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Kanit-SemiBold",
    marginBottom: 5,
  },
  vsText: {
    color: "#07F469",
    fontSize: 30,
    fontFamily: "MuseoModerno-Bold",
    marginTop: 30,
  },
  scoreBox: {
    backgroundColor: "#154127",
    borderWidth: 1,
    borderColor: "#07F469",
    borderRadius: 15,
    width: 90,
    height: 105,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 5,
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
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 25,
  },
  scoreDivider: {
    width: 25,
    height: 4,
    backgroundColor: "#07F469",
    alignSelf: "center",
    marginTop: 80,
    borderRadius: 2,
  },
  boxtitle: {
    backgroundColor: "#202020",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginBottom: 10,
    alignSelf: "flex-start",
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
    fontFamily: "Kanit-Regular",
    textAlign: "center",
    marginBottom: 6,
  },
  updateButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: "#07F469",
  },
  buttonupText: {
    color: "#154127",
    fontSize: 16,
    fontFamily: "Kanit-SemiBold",
    textAlign: "center",
  },
  endmatch: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: "#F44607",
  },
  buttonendText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Kanit-SemiBold",
    textAlign: "center",
  },
});
