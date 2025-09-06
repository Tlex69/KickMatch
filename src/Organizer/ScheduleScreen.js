import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export default function ScheduleScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { matchId } = route.params;
  const [schedule, setSchedule] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    if (!matchId) return setLoading(false);
    let unsubscribeResults = null;

    const fetchData = async () => {
      try {
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);
        if (!matchSnap.exists()) return setLoading(false);
        setMatchData(matchSnap.data());

        const drawRef = doc(db, "draws", matchId);
        const drawSnap = await getDoc(drawRef);
        if (!drawSnap.exists()) return setLoading(false);
        const drawData = drawSnap.data();

        const resultsCol = collection(db, "results");
        const q = query(resultsCol, where("matchId", "==", matchId));

        unsubscribeResults = onSnapshot(q, (querySnap) => {
          const resultsData = querySnap.docs.map((doc) => doc.data());

          // 🟢 คำนวณตารางคะแนน
          const table = {};
          resultsData.forEach((r) => {
            if (!r.teamAId || !r.teamBId) return; // กัน error

            if (!table[r.teamAId])
              table[r.teamAId] = { name: r.teamA, pts: 0, gf: 0, ga: 0 };
            if (!table[r.teamBId])
              table[r.teamBId] = { name: r.teamB, pts: 0, gf: 0, ga: 0 };

            table[r.teamAId].gf += r.scoreA;
            table[r.teamAId].ga += r.scoreB;
            table[r.teamBId].gf += r.scoreB;
            table[r.teamBId].ga += r.scoreA;

            if (r.scoreA > r.scoreB) table[r.teamAId].pts += 3;
            else if (r.scoreB > r.scoreA) table[r.teamBId].pts += 3;
            else {
              table[r.teamAId].pts += 1;
              table[r.teamBId].pts += 1;
            }
          });

          const standingsArr = Object.values(table)
            .map((t) => ({ ...t, gd: t.gf - t.ga }))
            .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
          setStandings(standingsArr);

          // 🟢 Knockout Schedule
          const scheduleData = [];

          // รอบแรก (จาก drawData.pairs)
          drawData.pairs.forEach((pair) => {
            const result = resultsData.find(
              (r) =>
                (r.teamAId === pair.teamA?.id &&
                  r.teamBId === pair.teamB?.id) ||
                (r.teamAId === pair.teamB?.id && r.teamBId === pair.teamA?.id)
            );
            scheduleData.push({
              id: `${matchId}_${pair.teamA?.id}_${pair.teamB?.id}`,
              round: "รอบแรก",
              matchTime: pair.matchTime ? new Date(pair.matchTime) : new Date(),
              teamA: pair.teamA,
              teamB: pair.teamB,
              scoreA: result?.scoreA || 0,
              scoreB: result?.scoreB || 0,
              winner: result?.winner,
              winnerId: result?.winnerId,
              winnerLogo: result?.winnerLogo || null,
              loser: result?.loser,
              loserId: result?.loserId,
              loserLogo: result?.loserLogo || null,
              isEnded: result?.isEnded || false,
            });
          });

          // ถ้ารอบแรกจบ → สร้างชิงที่ 3 + ชิงชนะเลิศ
          // ถ้ารอบแรกจบ → สร้างชิงที่ 3 + ชิงชนะเลิศ
if (
  scheduleData.length === 2 &&
  scheduleData.every((m) => m.isEnded)
) {
  const winners = scheduleData.map((m) => ({
    id: m.winnerId,
    teamName: m.winner,
    teamLogo: m.winnerLogo,
  }));
  const losers = scheduleData.map((m) => ({
    id: m.loserId,
    teamName: m.loser,
    teamLogo: m.loserLogo,
  }));

  const firstRoundEndTime = scheduleData[1].matchTime || new Date(); // ใช้เวลารอบแรกล่าสุด

  // รอบรองชนะเลิศ (ชิงที่ 3) ห่าง +1 ชั่วโมง
  const resultThird = resultsData.find(
    (r) =>
      (r.teamAId === losers[0]?.id && r.teamBId === losers[1]?.id) ||
      (r.teamAId === losers[1]?.id && r.teamBId === losers[0]?.id)
  );

  const thirdMatchTime = new Date(firstRoundEndTime.getTime() + 60 * 60 * 1000); // +1 ชั่วโมง

  scheduleData.push({
    id: `${matchId}_${losers[0]?.id}_${losers[1]?.id}`,
    round: "รอบรองชนะเลิศ",
    matchTime: thirdMatchTime,
    teamA: losers[0],
    teamB: losers[1],
    scoreA: resultThird?.scoreA || 0,
    scoreB: resultThird?.scoreB || 0,
    winner: resultThird?.winner,
    loser: resultThird?.loser,
    isEnded: resultThird?.isEnded || false,
  });

  // รอบชิงชนะเลิศ ห่าง +1 ชั่วโมงจากรอบรอง
  const resultFinal = resultsData.find(
    (r) =>
      (r.teamAId === winners[0]?.id && r.teamBId === winners[1]?.id) ||
      (r.teamAId === winners[1]?.id && r.teamBId === winners[0]?.id)
  );

  const finalMatchTime = new Date(thirdMatchTime.getTime() + 60 * 60 * 1000); // +1 ชั่วโมง

  scheduleData.push({
    id: `${matchId}_${winners[0]?.id}_${winners[1]?.id}`,
    round: "รอบชิงชนะเลิศ",
    matchTime: finalMatchTime,
    teamA: winners[0],
    teamB: winners[1],
    scoreA: resultFinal?.scoreA || 0,
    scoreB: resultFinal?.scoreB || 0,
    winner: resultFinal?.winner,
    loser: resultFinal?.loser,
    isEnded: resultFinal?.isEnded || false,
  });
}

          setSchedule(scheduleData);
          setLoading(false);
        });
      } catch (err) {
        console.log("Error fetching schedule:", err);
        setLoading(false);
      }
    };

    fetchData();
    return () => unsubscribeResults && unsubscribeResults();
  }, [matchId]);

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#07F469" />
      </View>
    );

  if (!schedule.length)
    return (
      <View style={styles.loader}>
        <Text style={{ color: "#ccc", fontSize: 16 }}>
          ยังไม่มีตารางการแข่งขัน
        </Text>
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
            <Text style={styles.titleText}>ตารางการแข่งขัน</Text>
            <Text style={styles.subTitleText}>
              {matchData?.fullname || "ไม่พบชื่อแมตช์"}
            </Text>
          </View>
          <DiceIcon size={50} color="#fff" />
        </View>
      </LinearGradient>

      
      {/* Schedule List */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {["รอบแรก", "รอบรองชนะเลิศ", "รอบชิงชนะเลิศ"].map((round) => {
          const matches = schedule.filter((m) => m.round === round);
          if (!matches.length) return null;
          return (
            <View key={round}>
              <Text style={styles.roundText}>{round}</Text>
              {matches.map((match) => {
                const isMatchEnded = !!match.isEnded;
                return (
                  <View
                    key={match.id}
                    style={[styles.matchBox, isMatchEnded && { opacity: 0.6 }]}
                  >
                    {/* ทีม A */}
                    <View style={styles.teamBox}>
                      {match.teamA?.teamLogo && (
                        <Image
                          source={{ uri: match.teamA.teamLogo }}
                          style={styles.teamLogo}
                        />
                      )}
                      <Text style={styles.teamName}>
                        {match.teamA?.teamName || "-"}
                      </Text>
                      <Text style={styles.score}>{match.scoreA}</Text>
                    </View>
                    
                <View style={{ alignItems: "center" }}>

                </View>
                    {/* VS */}
                    <View style={{ alignItems: "center" }}>
                      <View style={styles.timeBox}>
                      <Text style={styles.timeText}>
                      {match.matchTime
                        ? match.matchTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </Text>
                      </View>
                      <Text style={styles.vsText}>VS</Text>
                      <Text style={styles.roundSmall}>{match.round}</Text>
                    </View>

                    {/* ทีม B */}
                    <View style={styles.teamBox}>
                      {match.teamB?.teamLogo && (
                        <Image
                          source={{ uri: match.teamB.teamLogo }}
                          style={styles.teamLogo}
                        />
                      )}
                      <Text style={styles.teamName}>
                        {match.teamB?.teamName || "-"}
                      </Text>
                      <Text style={styles.score}>{match.scoreB}</Text>
                    </View>

                    {/* ปุ่มควบคุม */}
                    {isMatchEnded ? (
                      <View style={styles.winnerBox}>
                        <Text style={styles.winnerText}>
                          {match.winner ? `ผู้ชนะ : ${match.winner}` : "เสมอ"}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.controlButton}
                        disabled={!match.teamB}
                        onPress={() =>
                          navigation.navigate("ControlMatchScreen", {
                            match,
                            fullname: matchData?.fullname,
                            matchId,
                          })
                        }
                      >
                        <Text style={styles.controlButtonText}>
                          ควบคุมการแข่งขัน
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textBox: { flex: 1, alignItems: "flex-end", marginEnd: 10 },
 titleText: { color: "#fff", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  roundText: {
    color: "#07F469",
    fontSize: 14,
fontFamily: "Kanit-SemiBold",
    marginBottom: 8,
  },
  matchBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#202020",
    padding: 20,
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
    position: "relative",
  },
  teamBox: { alignItems: "center", flex: 1 },
  teamLogo: { width: 50, height: 50, borderRadius: 25, marginBottom: 5 },
  teamName: {
    color: "#07F469",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Kanit-SemiBold",
    marginBottom: 5,
  },
  score: { color: "#07F469", fontSize: 18, marginBottom: 50, fontFamily: "Kanit-SemiBold" },
  vsText: { color: "#07F469", fontSize: 35, marginBottom: 0, marginTop: 2 ,fontFamily: "MuseoModerno-SemiBold" },
  roundSmall: { color: "#07F469", fontSize: 12, fontFamily: "Kanit-SemiBold", marginBottom: 5},
  controlButton: {
    position: "absolute",
    marginTop: 140,
    left: 20,
    right: 20,
    paddingVertical: 8,
    backgroundColor: "#154127",
    borderRadius: 15,
    alignItems: "center",
  },
  controlButtonText: { color: "#07F469", fontSize: 12,fontFamily: "Kanit-SemiBold" },
  winnerBox: {
    position: "absolute",
    marginTop: 140,
    left: 20,
    right: 20,
    paddingVertical: 8,
    backgroundColor: "#154127",
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#07F469",
  },
  winnerText: { color: "#07F469", fontSize: 13,fontFamily: "Kanit-SemiBold" },
  standingsButton: { alignSelf: "flex-end", marginRight: 20, marginBottom: 10 },
  standingsButtonText: { color: "#07F469", fontSize: 13,fontFamily: "Kanit-SemiBold" },
  timeBox: {
    backgroundColor: "#154127",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 15,
    marginTop: -50,
  },
  timeText: {
    color: "#07F469",
    fontSize: 12,
    fontFamily: "Kanit-Regular",
    textAlign: "center",
  },
});
