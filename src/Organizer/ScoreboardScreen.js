import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { FootballIcon } from "../../components/icon/FootballIcon";

import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

export default function ScoreboardScreen({ route }) {
  const navigation = useNavigation();
  const { matchId, fullname } = route.params;

  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLeagueCup, setIsLeagueCup] = useState(false);

  useEffect(() => {
    if (!matchId) return;

    const fetchData = async () => {
      try {
        // ✅ ดึงข้อมูล match ก่อน
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);

        if (!matchSnap.exists()) {
          setLoading(false);
          return;
        }

        const matchData = matchSnap.data();
        const category = matchData.category2 || "";
        setIsLeagueCup(category === "ลีกคัพ");

        if (category === "ลีกคัพ") {
          // ✅ ถ้าเป็นลีกคัพ → ดึง groups
          const groupRef = doc(db, "groups", matchId);
          const groupSnap = await getDoc(groupRef);

          if (groupSnap.exists()) {
            const data = groupSnap.data();
            const groupData = Object.entries(data.groups || {}).map(
              ([key, teams]) => ({
                id: key,
                name: `กลุ่ม ${key}`,
                teams,
              })
            );

            // ✅ คำนวณคะแนนของแต่ละกลุ่ม
            const q = query(
              collection(db, "results"),
              where("matchId", "==", matchId)
            );
            const snap = await getDocs(q);

            groupData.forEach((g) => {
              const stats = {};
              g.teams.forEach((t) => {
                stats[t.teamName] = {
                  team: t.teamName,
                  played: 0,
                  win: 0,
                  draw: 0,
                  loss: 0,
                  gf: 0,
                  ga: 0,
                  points: 0,
                };
              });

              snap.forEach((docSnap) => {
                const d = docSnap.data();
                const { teamA, teamB, scoreA = 0, scoreB = 0 } = d;

                if (stats[teamA] && stats[teamB]) {
                  stats[teamA].played += 1;
                  stats[teamB].played += 1;

                  stats[teamA].gf += scoreA;
                  stats[teamA].ga += scoreB;
                  stats[teamB].gf += scoreB;
                  stats[teamB].ga += scoreA;

                  if (scoreA > scoreB) {
                    stats[teamA].win += 1;
                    stats[teamB].loss += 1;
                    stats[teamA].points += 3;
                  } else if (scoreB > scoreA) {
                    stats[teamB].win += 1;
                    stats[teamA].loss += 1;
                    stats[teamB].points += 3;
                  } else {
                    stats[teamA].draw += 1;
                    stats[teamB].draw += 1;
                    stats[teamA].points += 1;
                    stats[teamB].points += 1;
                  }
                }
              });

              g.table = Object.values(stats)
                .sort((a, b) => {
                  const diffPoints = b.points - a.points;
                  if (diffPoints !== 0) return diffPoints;
                  return b.gf - b.ga - (a.gf - a.ga);
                })
                .map((item, index) => ({ ...item, rank: index + 1 }));
            });

            setGroups(groupData);
          }
        } else {
          // ✅ ถ้าเป็นบอลลีกหรืออื่นๆ → ดึง results แล้วทำตารางรวม
          const q = query(
            collection(db, "results"),
            where("matchId", "==", matchId)
          );
          const snap = await getDocs(q);
          const teamsStats = {};

          snap.forEach((doc) => {
            const d = doc.data();
            const { teamA, teamB, scoreA = 0, scoreB = 0 } = d;

            if (!teamsStats[teamA])
              teamsStats[teamA] = {
                team: teamA,
                played: 0,
                win: 0,
                draw: 0,
                loss: 0,
                gf: 0,
                ga: 0,
                points: 0,
              };
            if (!teamsStats[teamB])
              teamsStats[teamB] = {
                team: teamB,
                played: 0,
                win: 0,
                draw: 0,
                loss: 0,
                gf: 0,
                ga: 0,
                points: 0,
              };

            teamsStats[teamA].played += 1;
            teamsStats[teamB].played += 1;

            teamsStats[teamA].gf += scoreA;
            teamsStats[teamA].ga += scoreB;
            teamsStats[teamB].gf += scoreB;
            teamsStats[teamB].ga += scoreA;

            if (scoreA > scoreB) {
              teamsStats[teamA].win += 1;
              teamsStats[teamB].loss += 1;
              teamsStats[teamA].points += 3;
            } else if (scoreB > scoreA) {
              teamsStats[teamB].win += 1;
              teamsStats[teamA].loss += 1;
              teamsStats[teamB].points += 3;
            } else {
              teamsStats[teamA].draw += 1;
              teamsStats[teamB].draw += 1;
              teamsStats[teamA].points += 1;
              teamsStats[teamB].points += 1;
            }
          });

          const sortedTable = Object.values(teamsStats)
            .sort((a, b) => {
              const diffPoints = b.points - a.points;
              if (diffPoints !== 0) return diffPoints;
              return b.gf - b.ga - (a.gf - a.ga);
            })
            .map((item, index) => ({ ...item, rank: index + 1 }));

          setTable(sortedTable);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [matchId]);

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#07F469" />
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      {/* Header */}
      <SafeAreaView>
        <LinearGradient
          colors={["#14141400", "#07F469"]}
          style={styles.headerBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <MaterialIcons
              name="arrow-back-ios"
              size={22}
              color="#fff"
              onPress={() => navigation.goBack()}
            />

            <View style={styles.textBox}>
              <Text style={styles.titleText}>ตารางคะแนน</Text>
              <Text style={styles.subTitleText}>{fullname}</Text>
            </View>

            <View />
            <FootballIcon size={5} color="#fff" />
          </View>
        </LinearGradient>
      </SafeAreaView>

      {/* ✅ แสดงตาราง */}
      <ScrollView style={{ paddingHorizontal: 16, marginTop: 15 }}>
        {isLeagueCup ? (
          // ✅ ถ้าเป็นลีกคัพ → วนกลุ่ม
          groups.map((g) => (
            <View key={g.id} style={{ marginBottom: 20 }}>
              <Text style={styles.groupTitle}>{g.name}</Text>
              <View style={styles.headerRow}>
                <Text style={styles.cell}>ลำดับ</Text>
                <Text style={[styles.cell, { flex: 2 }]}>ทีม</Text>
                <Text style={styles.cell}>แข่ง</Text>
                <Text style={styles.cell}>ชนะ</Text>
                <Text style={styles.cell}>เสมอ</Text>
                <Text style={styles.cell}>แพ้</Text>
                <Text style={styles.cell}>แต้ม</Text>
              </View>
              {g.table.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.row,
                    idx % 2 === 0 && { backgroundColor: "#1A1A1A" },
                  ]}
                >
                  <Text style={styles.cell}>{item.rank}</Text>
                  <Text style={[styles.cell, { flex: 2 }]}>{item.team}</Text>
                  <Text style={styles.cell}>{item.played}</Text>
                  <Text style={styles.cell}>{item.win}</Text>
                  <Text style={styles.cell}>{item.draw}</Text>
                  <Text style={styles.cell}>{item.loss}</Text>
                  <Text style={styles.cell}>{item.points}</Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          // ✅ บอลลีก/อื่นๆ
          <>
            <View style={styles.headerRow}>
              <Text style={styles.cell}>ลำดับ</Text>
              <Text style={[styles.cell, { flex: 2 }]}>ทีม</Text>
              <Text style={styles.cell}>แข่ง</Text>
              <Text style={styles.cell}>ชนะ</Text>
              <Text style={styles.cell}>เสมอ</Text>
              <Text style={styles.cell}>แพ้</Text>
              <Text style={styles.cell}>แต้ม</Text>
            </View>

            <FlatList
              data={table}
              keyExtractor={(item) => item.team}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.row,
                    index % 2 === 0 && { backgroundColor: "#1A1A1A" },
                  ]}
                >
                  <Text style={styles.cell}>{item.rank}</Text>
                  <Text style={[styles.cell, { flex: 2 }]}>{item.team}</Text>
                  <Text style={styles.cell}>{item.played}</Text>
                  <Text style={styles.cell}>{item.win}</Text>
                  <Text style={styles.cell}>{item.draw}</Text>
                  <Text style={styles.cell}>{item.loss}</Text>
                  <Text style={styles.cell}>{item.points}</Text>
                </View>
              )}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerBox: {
    width: "95%",
    height: 90,
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textBox: { flex: 1, alignItems: "flex-end", marginEnd: 10 },
  titleText: { color: "#fff", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#07F469",
  },
  row: { flexDirection: "row", paddingVertical: 8 },
  cell: {
    flex: 1,
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Kanit-Regular",
  },
  groupTitle: {
    color: "#07F469",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
    marginBottom: 5,
  },
});
