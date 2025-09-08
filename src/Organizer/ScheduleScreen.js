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
        const match = matchSnap.data();
        setMatchData(match);

        // ดึงผลการจับฉลาก
        const drawRef = doc(db, "draws", matchId);
        const drawSnap = await getDoc(drawRef);
        if (!drawSnap.exists()) return setLoading(false);
        const drawData = drawSnap.data();

        // ดึงผลการแข่งขัน
        const resultsCol = collection(db, "results");
        const q = query(resultsCol, where("matchId", "==", matchId));

        unsubscribeResults = onSnapshot(q, async (querySnap) => {
          const resultsData = querySnap.docs.map((doc) => doc.data());

          // คำนวณตารางคะแนน (ลีกคัพ)
          const table = {};
          resultsData.forEach((r) => {
            if (!r.teamAId || !r.teamBId) return;
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

          // สร้าง schedule
          const scheduleData = [];

          // รอบลีก / รอบแรก
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
              group: pair.round || "-",
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

          // 🟢 หากเป็นลีกคัพและรอบแรกจบ ให้สร้างรอบน็อกเอาท์
          if (match.category2 === "ลีกคัพ") {
            const groupRef = doc(db, "groups", matchId);
            const groupSnap = await getDoc(groupRef);
            const groupData = groupSnap.exists() ? groupSnap.data()?.groups : {};
            const knockoutTeams = [];

            for (let groupName in groupData) {
              const teamsInGroup = groupData[groupName];
              const groupTable = teamsInGroup
                .map((team) => table[team.id] || { name: team.teamName, pts: 0, gf: 0, ga: 0 })
                .map(t => ({ ...t, gd: t.gf - t.ga }))
                .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);

              // top 2 ของแต่ละกลุ่มเข้ารอบน็อกเอาท์
              knockoutTeams.push(...groupTable.slice(0, 2).map(t => ({
                id: teamsInGroup.find(team => team.teamName === t.name).id,
                teamName: t.name,
                teamLogo: teamsInGroup.find(team => team.teamName === t.name).teamLogo,
              })));
            }

            // สุ่มจับคู่รอบน็อกเอาท์
            for (let i = knockoutTeams.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [knockoutTeams[i], knockoutTeams[j]] = [knockoutTeams[j], knockoutTeams[i]];
            }

            let knockoutTime = new Date(scheduleData[scheduleData.length - 1]?.matchTime || new Date());
            for (let i = 0; i < knockoutTeams.length; i += 2) {
              const pair = {
                id: `${matchId}_${knockoutTeams[i]?.id}_${knockoutTeams[i+1]?.id}`,
                round: "น็อกเอาท์",
                matchTime: new Date(knockoutTime),
                teamA: knockoutTeams[i],
                teamB: knockoutTeams[i+1] || null,
              };
              scheduleData.push(pair);
              knockoutTime = new Date(knockoutTime.getTime() + 55*60000);
            }
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

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {schedule.map((match) => {
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
                <Text style={styles.score}>{match.scoreA || 0}</Text>
              </View>

              {/* VS + เวลา + กลุ่ม */}
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
                {match.group && (
                  <Text style={styles.groupText}>{match.group}</Text>
                )}
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
                <Text style={styles.score}>{match.scoreB || 0}</Text>
              </View>

              {/* ปุ่มควบคุม / แสดงผู้ชนะ */}
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
  groupText: {
    color: "#07F469",
    fontSize: 11,
    marginTop: -4,
    fontFamily: "Kanit-Regular",
    backgroundColor: "#154127",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
});
