import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { FootballIcon } from "../../components/icon/FootballIcon";
import { Dropdown } from "react-native-element-dropdown";

// Firebase
import { db } from "../../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function ControlOthersScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { fullname = "", teamAId, teamBId, matchId } = route.params || {};

  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerActions, setPlayerActions] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchTeam = async (teamId, setTeam) => {
    if (!teamId) return;
    try {
      const teamRef = doc(db, "teams", teamId);
      const teamSnap = await getDoc(teamRef);
      if (teamSnap.exists()) setTeam(teamSnap.data());
    } catch (error) {
      console.error("Fetch team error:", error);
    }
  };

  const fetchMatchData = async () => {
    if (!matchId) return;
    try {
      const matchRef = doc(db, "matches", matchId);
      const matchSnap = await getDoc(matchRef);
      if (matchSnap.exists()) {
        const data = matchSnap.data();
        const teamData = selectedTeam ? data[selectedTeam] || {} : {};
        setPlayerActions(teamData);
      }
    } catch (error) {
      console.error("Fetch match error:", error);
    }
  };

  useEffect(() => {
    fetchTeam(teamAId, setTeamA);
    fetchTeam(teamBId, setTeamB);
  }, []);

  useEffect(() => {
    if (teamA?.teamName) setSelectedTeam(teamA.teamName);
  }, [teamA]);

  useEffect(() => {
    fetchMatchData();
  }, [selectedTeam]);

  const teamPlayers =
    selectedTeam === teamA?.teamName
      ? (teamA?.players || []).filter((p) => p.name?.trim())
      : selectedTeam === teamB?.teamName
      ? (teamB?.players || []).filter((p) => p.name?.trim())
      : [];

  const playerOptions = teamPlayers.map((p) => ({ label: p.name, value: p }));

  const addPlayerAction = (action) => {
    if (!selectedPlayer || !selectedTeam) return;

    setPlayerActions((prev) => {
      const current = prev[selectedPlayer.name] || {
        yellow: 0,
        red: 0,
        score: 0,
      };
      let newStats = { ...current };

      if (action === "ใบเหลือง" && current.yellow < 2) newStats.yellow += 1;
      if (action === "ใบแดง" && current.red < 1) newStats.red += 1;
      if (action === "ทำสกอร์") newStats.score += 1;

      return { ...prev, [selectedPlayer.name]: newStats };
    });
  };

  const handleUpdateAll = async () => {
    if (!matchId || !selectedTeam) return;
    setLoading(true);
    try {
      const matchRef = doc(db, "matches", matchId);
      const matchSnap = await getDoc(matchRef);
      const matchData = matchSnap.exists() ? matchSnap.data() : {};

      if (!matchData[selectedTeam]) matchData[selectedTeam] = {};
      Object.keys(playerActions).forEach((playerName) => {
        matchData[selectedTeam][playerName] = playerActions[playerName];
      });
      matchData.updatedAt = serverTimestamp();

      await setDoc(matchRef, matchData);
      alert("อัปเดตข้อมูลเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Update match error:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    }
    setLoading(false);
  };

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
            <Text style={styles.titleText}>จัดการผลอื่นๆ</Text>
            <Text style={styles.subTitleText}>{fullname}</Text>
          </View>
          <FootballIcon size={50} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <Text style={styles.label}>เลือกทีมจัดการ</Text>
        <View style={styles.teamRow}>
          <TouchableOpacity
            style={[
              styles.teamButton,
              selectedTeam === teamA?.teamName && styles.teamButtonActive,
            ]}
            onPress={() => {
              setSelectedTeam(teamA?.teamName);
              setSelectedPlayer(null);
            }}
          >
            <Text style={styles.teamText}>{teamA?.teamName || "ทีม A"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.teamButton,
              selectedTeam === teamB?.teamName && styles.teamButtonActive,
            ]}
            onPress={() => {
              setSelectedTeam(teamB?.teamName);
              setSelectedPlayer(null);
            }}
          >
            <Text style={styles.teamText}>{teamB?.teamName || "ทีม B"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>เลือกผู้เล่น</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={playerOptions}
          labelField="label"
          valueField="value"
          placeholder="เลือกผู้เล่น"
          value={selectedPlayer}
          onChange={(item) => setSelectedPlayer(item.value)}
        />

        {selectedPlayer && (
          <>
            <View style={styles.playerCard}>
              {selectedPlayer.image ? (
                <Image
                  source={{ uri: selectedPlayer.image }}
                  style={styles.playerImage}
                />
              ) : (
                <View style={[styles.playerImage, styles.noImage]}>
                  <Text style={[styles.playerNumber, { textAlign: "center" }]}>
                    No Image
                  </Text>
                </View>
              )}
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{selectedPlayer.name}</Text>
                <Text style={styles.playerNumber}>
                  เบอร์: {selectedPlayer.number || "-"}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  {[
                    ...Array(playerActions[selectedPlayer.name]?.yellow || 0),
                  ].map((_, i) => (
                    <View
                      key={"y" + i}
                      style={[styles.iconBox, { backgroundColor: "#FFD700" }]}
                    />
                  ))}
                  {[...Array(playerActions[selectedPlayer.name]?.red || 0)].map(
                    (_, i) => (
                      <View
                        key={"r" + i}
                        style={[styles.iconBox, { backgroundColor: "#FF0000" }]}
                      />
                    )
                  )}
                  {[
                    ...Array(playerActions[selectedPlayer.name]?.score || 0),
                  ].map((_, i) => (
                    <View
                      key={"s" + i}
                      style={[styles.iconBox, { backgroundColor: "#07F469" }]}
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#FFD700" }]}
                onPress={() => addPlayerAction("ใบเหลือง")}
              >
                <Text style={styles.actionText}>ใบเหลือง</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#FF0000" }]}
                onPress={() => addPlayerAction("ใบแดง")}
              >
                <Text style={styles.actionText}>ใบแดง</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#07F469" }]}
                onPress={() => addPlayerAction("ทำสกอร์")}
              >
                <Text style={styles.actionText}>ทำสกอร์</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.buttonSubText}>
          *อัพเดทผลล่าสุดเพื่อให้ผู้ใช้ได้รู้ผลการแข่งขัน*
        </Text>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateAll}
          disabled={loading}
        >
          <Text style={styles.updateText}>
            {loading ? "กำลังอัปเดต..." : "อัปเดตข้อมูลทั้งหมด"}
          </Text>
        </TouchableOpacity>
      </View>
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

label: { 
  color: "#07F469", 
  fontFamily: "Kanit-SemiBold", 
  fontSize: 13,
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 15,
  alignSelf: "flex-start",  
  backgroundColor: "#202020", 
  marginBottom: 8,
},

  teamRow: { flexDirection: "row", marginBottom: 15 },
  teamButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#555",
    marginHorizontal: 5,
    borderRadius: 18,
    alignItems: "center",
  },
  teamButtonActive: { borderColor: "#07F469" },
  teamText: { color: "#fff", fontFamily: "Kanit-SemiBold" },
  dropdown: {
    height: 50,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  placeholderStyle: {
    color: "#ccc",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
  },
  selectedTextStyle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#202020",
    padding: 10,
    borderRadius: 15,
    marginVertical: 10,
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#555",
  },
  noImage: { alignItems: "center", justifyContent: "center" },
  playerInfo: { marginLeft: 10 },
  playerName: { color: "#07F469", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  playerNumber: { color: "#fff", fontSize: 12, fontFamily: "Kanit-SemiBold" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontFamily: "Kanit-SemiBold" },
  iconBox: { width: 16, height: 18, borderRadius: 5, marginRight: 2 },
  footer: { padding: 10 },
  updateButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: "#07F469",
  },
  buttonSubText: {
    color: "#07F469",
    fontSize: 10,
    fontFamily: "Kanit-Regular",
    textAlign: "center",
    marginBottom: 6,
  },
  updateText: {
    color: "#154127",
    fontSize: 16,
    fontFamily: "Kanit-SemiBold",
    textAlign: "center",
  },
});
