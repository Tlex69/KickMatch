import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import DiceIcon from "../../components/icon/DiceIcon";

export default function ScheduleScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { matchId } = route.params;
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    if (!matchId) return setLoading(false);

    let unsubscribeResults = null;

    const fetchData = async () => {
      try {
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);
        if (!matchSnap.exists()) {
          setLoading(false);
          return;
        }
        setMatchData(matchSnap.data());

        const drawRef = doc(db, "draws", matchId);
        const drawSnap = await getDoc(drawRef);
        if (!drawSnap.exists()) {
          setLoading(false);
          return;
        }
        const drawData = drawSnap.data();

        const resultsCol = collection(db, "results");
        const q = query(resultsCol, where("matchId", "==", matchId));

        unsubscribeResults = onSnapshot(q, (querySnap) => {
          const resultsData = querySnap.docs.map((doc) => doc.data());

          let scheduleData = drawData.pairs.map((pair) => {
            const result = resultsData.find(
              (r) =>
                (r.teamAId === pair.teamA?.id &&
                  r.teamBId === pair.teamB?.id) ||
                (r.teamAId === pair.teamB?.id && r.teamBId === pair.teamA?.id)
            );

            let scoreA = 0,
              scoreB = 0,
              winner = null,
              loser = null;

            if (result) {
              if (result.teamAId === pair.teamA?.id) {
                scoreA = result.scoreA || 0;
                scoreB = result.scoreB || 0;
              } else {
                scoreA = result.scoreB || 0;
                scoreB = result.scoreA || 0;
              }
              winner = result.winner;
              loser = result.loser;
            }

            return {
              ...pair,
              matchTime: pair.matchTime ? new Date(pair.matchTime) : new Date(),
              scoreA,
              scoreB,
              winner,
              loser,
              round: pair.round || "รอบแรก",
            };
          });

          let lastMatchTime = scheduleData.reduce((latest, match) => {
            return match.matchTime && match.matchTime > latest
              ? match.matchTime
              : latest;
          }, new Date());

          // คู่ผู้ชนะ
          const winners = resultsData
            .filter((r) => r.winner)
            .map((r) => ({ id: r.winnerId || r.teamAId, teamName: r.winner }));

          const winnerNextRoundMatches = [];
          for (let i = 0; i < winners.length; i += 2) {
            const teamA = winners[i];
            const teamB = winners[i + 1] || null;
            lastMatchTime = new Date(lastMatchTime.getTime() + 60 * 60 * 1000);

            const matchResult = resultsData.find(
              (r) =>
                (r.teamAId === teamA?.id && r.teamBId === teamB?.id) ||
                (r.teamAId === teamB?.id && r.teamBId === teamA?.id)
            );
            const teamALogo = drawData.pairs
              .flatMap((p) => [p.teamA, p.teamB])
              .find((t) => t?.id === teamA?.id)?.teamLogo;
            const teamBLogo = drawData.pairs
              .flatMap((p) => [p.teamA, p.teamB])
              .find((t) => t?.id === teamB?.id)?.teamLogo;

            let scoreA = 0,
              scoreB = 0,
              winner = null,
              loser = null;
            if (matchResult) {
              if (matchResult.teamAId === teamA?.id) {
                scoreA = matchResult.scoreA || 0;
                scoreB = matchResult.scoreB || 0;
              } else {
                scoreA = matchResult.scoreB || 0;
                scoreB = matchResult.scoreA || 0;
              }
              winner = matchResult.winner;
              loser = matchResult.loser;
            }

            winnerNextRoundMatches.push({
              matchTime: lastMatchTime,
              teamA: { ...teamA, teamLogo: teamALogo },
              teamB: teamB ? { ...teamB, teamLogo: teamBLogo } : null,
              scoreA,
              scoreB,
              winner,
              loser,
              round: "รอบผู้ชนะ",
            });
          }

          // คู่ผู้แพ้
          const losers = resultsData
            .filter((r) => r.loser)
            .map((r) => ({ id: r.loserId || r.teamBId, teamName: r.loser }));

          const loserNextRoundMatches = [];
          for (let i = 0; i < losers.length; i += 2) {
            const teamA = losers[i];
            const teamB = losers[i + 1] || null;
            lastMatchTime = new Date(lastMatchTime.getTime() + 60 * 60 * 1000);

            const matchResult = resultsData.find(
              (r) =>
                (r.teamAId === teamA?.id && r.teamBId === teamB?.id) ||
                (r.teamAId === teamB?.id && r.teamBId === teamA?.id)
            );
            const teamALogo = drawData.pairs
              .flatMap((p) => [p.teamA, p.teamB])
              .find((t) => t?.id === teamA?.id)?.teamLogo;
            const teamBLogo = drawData.pairs
              .flatMap((p) => [p.teamA, p.teamB])
              .find((t) => t?.id === teamB?.id)?.teamLogo;

            let scoreA = 0,
              scoreB = 0,
              winner = null,
              loser = null;
            if (matchResult) {
              if (matchResult.teamAId === teamA?.id) {
                scoreA = matchResult.scoreA || 0;
                scoreB = matchResult.scoreB || 0;
              } else {
                scoreA = matchResult.scoreB || 0;
                scoreB = matchResult.scoreA || 0;
              }
              winner = matchResult.winner;
              loser = matchResult.loser;
            }

            loserNextRoundMatches.push({
              matchTime: lastMatchTime,
              teamA: { ...teamA, teamLogo: teamALogo },
              teamB: teamB ? { ...teamB, teamLogo: teamBLogo } : null,
              scoreA,
              scoreB,
              winner,
              loser,
              round: "รอบผู้แพ้",
            });
          }

          const finalSchedule = [
            ...scheduleData,
            ...winnerNextRoundMatches,
            ...loserNextRoundMatches,
          ];
          setSchedule(finalSchedule);
          setLoading(false);
        });
      } catch (error) {
        console.log("Error fetching schedule:", error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (unsubscribeResults) unsubscribeResults();
    };
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
        {schedule
          .filter(
            (match) =>
              !match.round?.includes("รอบรองชนะเลิศ") &&
              !match.round?.includes("รอบชิง")
          )
          .map((match, index) => {
            const isGreyRound = match.round.includes("รอบผู้แพ้");
            const isMatchEnded = !!(match.winner && match.loser);

            return (
              <View
                key={index}
                style={[
                  styles.matchBox,
                  isGreyRound && { backgroundColor: "#1A1A1A" },
                  isMatchEnded && { opacity: 0.6 },
                ]}
              >
                {/* ทีม A */}
                <View style={styles.teamBox}>
                  <Image
                    source={{ uri: match.teamA.teamLogo }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginBottom: 5,
                    }}
                  />
                  <Text
                    style={[
                      styles.teamName,
                      match.winner === match.teamA?.teamName && {
                        color: "#07F469",
                        fontWeight: "bold",
                      },
                      match.loser === match.teamA?.teamName && {
                        color: "#F44607",
                      },
                    ]}
                  >
                    {match.teamA?.teamName || "ไม่ระบุชื่อทีม"}
                  </Text>
                  <Text
                    style={{
                      color: "#07F469",
                      fontSize: 16,
                      marginBottom: 50,
                      fontFamily: "MuseoModerno-SemiBold",
                    }}
                  >
                    {match.scoreA}
                  </Text>
                </View>

                {/* VS + เวลา + รอบ */}
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
                  <Text style={styles.roundText}>{match.round}</Text>
                </View>

                {/* ทีม B */}
                <View style={styles.teamBox}>
                  {match.teamB ? (
                    <>
                      <Image
                        source={{ uri: match.teamB.teamLogo }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          marginBottom: 5,
                        }}
                      />
                      <Text
                        style={[
                          styles.teamName,
                          match.winner === match.teamB?.teamName && {
                            color: "#07F469",
                            fontWeight: "bold",
                          },
                          match.loser === match.teamB?.teamName && {
                            color: "#F44607",
                          },
                        ]}
                      >
                        {match.teamB?.teamName || "ไม่ระบุชื่อทีม"}
                      </Text>
                      <Text
                        style={{
                          color: "#07F469",
                          fontSize: 16,
                          marginBottom: 50,
                          fontFamily: "MuseoModerno-SemiBold",
                        }}
                      >
                        {match.scoreB}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.teamName}>รอผลแข่ง</Text>
                  )}
                </View>

               {/* ปุ่มควบคุมการแข่งขัน หรือ ชื่อผู้ชนะ */}
{isMatchEnded ? (
  <View
    style={[
      styles.winnerBox,
      isGreyRound && { backgroundColor: "#0D2F18" },
    ]}
  >
    <Text style={styles.winnerText}>
      ผู้ชนะ: {match.winner || "ไม่ทราบชื่อทีม"}
    </Text>
  </View>
) : (
  <TouchableOpacity
    style={styles.controlButton}
    onPress={() => {
      if (match.teamB && !isMatchEnded) {
        navigation.navigate("ControlMatchScreen", {
          match,
          fullname: matchData?.fullname || "ไม่พบชื่อแมตช์",
          matchId,
        });
      }
    }}
    disabled={!match.teamB || isMatchEnded}
  >
    <Text style={styles.controlButtonText}>ควบคุมการแข่งขัน</Text>
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
  headerContent: { flexDirection: "row", alignItems: "center" },
  textBox: { flex: 1, alignItems: "flex-end", marginEnd: 10 },
  titleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
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
  teamName: {
    color: "#07F469",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Kanit-SemiBold",
    marginBottom: 5,
  },
  vsText: {
    color: "#07F469",
    fontSize: 35,
    fontFamily: "MuseoModerno-Bold",
    marginHorizontal: 10,
    marginBottom: 5,
    marginTop: 2,
  },
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
  roundText: {
    color: "#07F469",
    fontSize: 9,
    marginTop: -10,
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Kanit-Regular",
  },
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
  controlButtonText: {
    color: "#07F469",
    fontFamily: "Kanit-SemiBold",
    fontSize: 12,
  },
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
winnerText: {
  color: "#07F469",
  fontFamily: "Kanit-SemiBold",
  fontSize: 13,
},

});
