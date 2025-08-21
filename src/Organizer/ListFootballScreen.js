import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  
} from "react-native";
import CupBrokenIcon from "../../components/icon/CupBrokenIcon";
import { LinearGradient } from "expo-linear-gradient";
import { DocFail } from "../../components/icon/DocFail";
import { FootballIcon } from "../../components/icon/FootballIcon";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


export default function ListFootballScreen() {
  const [competitions, setCompetitions] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
    const navigation = useNavigation(); // ✅ hook


  useEffect(() => {
  if (!currentUser) return;

  const fetchCompetitions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "matches"));
      const matchesData = [];

      for (const docSnap of querySnapshot.docs) {
        const matchData = { id: docSnap.id, ...docSnap.data() };

        // แสดงเฉพาะ match ของเจ้าของ
        if (matchData.ownerUid === currentUser.uid) {

          // ดึงจำนวนทีมจาก collection 'teams'
          const teamQuery = query(
            collection(db, "teams"),
            where("ownerUid", "==", currentUser.uid),
            where("matchId", "==", docSnap.id)
          );
          const teamSnapshot = await getDocs(teamQuery);
          const teams = teamSnapshot.docs.map((teamDoc) => teamDoc.data());

          const registeredTeams = teams.length;
          const paidTeams = teams.filter(t => t.status === "paid").length;
          const soldTeams = teams.filter(t => t.status === "sold").length;

          matchesData.push({
            ...matchData,
            registeredTeams,
            paidTeams,
            soldTeams,
          });
        }
      }

      setCompetitions(matchesData);
    } catch (error) {
      console.log("Error fetching competitions:", error);
    }
  };

  fetchCompetitions();
}, [currentUser]);


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      <LinearGradient
        colors={["#14141400", "#03C252"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.textBox}>
            <Text style={styles.titleText}>รายการแข่งขัน</Text>
            <Text style={styles.subTitleText}>
              รายการแข่งขันที่กำลังเกิดขึ้น
            </Text>
          </View>
          <FootballIcon size={5} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={
          competitions.length === 0 && styles.emptyContainer
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.boxtitle}>
          <Text style={styles.title}>รายการแข่งที่กำลังเกิดขึ้น</Text>
        </View>

        {competitions.length === 0 ? (
          <View style={styles.emptyContent}>
            <DocFail width={110} height={120} fill="#141414" />
            <Text style={styles.emptyText}>ไม่มีการแข่งขันที่กำลังแข่ง</Text>
          </View>
        ) : (
          competitions.map((comp) => (
            <View key={comp.id} style={styles.competitionBox}>
              {/* รูปภาพ */}
              <Image
                source={
                  comp.promoImage
                    ? { uri: comp.promoImage }
                    : require("../../assets/defualt.jpg")
                }
                style={styles.image}
              />
              {/* ชื่อรายการ */}
              <Text style={styles.fullname}>
                {comp.fullname || "ไม่มีชื่อ"}
              </Text>

              <View style={styles.threeBoxContainer}>
                {/* ฝั่งซ้าย: 2 ช่องแนวตั้ง */}
                <View style={styles.leftBox}>
                  {/* กรอบบน: จำนวนทีมสมัคร */}
                  <LinearGradient
                    colors={["#990D14", "#FF7DAD"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.leftTopBox}
                  >
                    <Text style={styles.boxLabel}>จำนวนทีมที่สมัคร</Text>
                    <Text style={styles.boxNumber}>
                      {comp.totalTeams || 0}/{comp.teamAmount || 0}{" "}
                      <Text style={styles.fontteam}>ทีม</Text>
                    </Text>
                  </LinearGradient>

                  {/* กรอบล่าง: จำนวนทีมชำระแล้ว */}
                  <LinearGradient
                    colors={["#781DF0", "#9747FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.leftBottomBox}
                  >
                    <Text style={styles.boxLabel}>จำนวนทีมที่ชำระแล้ว</Text>
                    <Text style={styles.boxNumber}>
                      {comp.totalTeams || 0}/{comp.teamAmount || 0}{" "}
                      <Text style={styles.fontteam}>ทีม</Text>
                    </Text>
                  </LinearGradient>
                </View>

                {/* ฝั่งขวา: 1 ช่องแนวนอน */}
                <LinearGradient
                  colors={["#C3780E", "#FFC300"]} // กรอบสีขาว
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.rightBox}
                >
                  <View style={styles.rightBoxContent}>
                    <Text style={styles.boxLabely}>จำนวนทีมที่ขายแล้ว</Text>
                    <CupBrokenIcon size={60} color="#fff" />
                    <Text style={styles.boxNumbery}>
                      {comp.totalTeams || 0}/{comp.teamAmount || 0}{" "}
                      <Text style={styles.fontteam}>ทีม</Text>
                    </Text>
                  </View>
                </LinearGradient>
              </View>
              <View style={styles.buttonContainer}>
  <TouchableOpacity 
  style={styles.fullWidthButton}
  onPress={() => navigation.navigate("DrawScreen", { title: comp.fullname })}
>
  <Text style={styles.buttonText}>จับฉลากการแข่งขัน</Text>
  <AntDesign name="right" size={18} color="#07F469" />
</TouchableOpacity>

<TouchableOpacity style={styles.fullWidthButton}>
  <Text style={styles.buttonText}>ตารางแข่ง</Text>
  <AntDesign name="right" size={18} color="#07F469" />
</TouchableOpacity>

<TouchableOpacity style={styles.fullWidthButton}>
  <Text style={styles.buttonText}>รายชื่อทีม</Text>
  <AntDesign name="right" size={18} color="#07F469" />
</TouchableOpacity>

<TouchableOpacity style={styles.fullWidthButton}>
  <Text style={styles.buttonText}>ทำงานร่วมกับผู้ช่วยจัดการแข่งขัน</Text>
  <AntDesign name="right" size={18} color="#07F469" />
</TouchableOpacity>

</View>


            </View>
          ))
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
    paddingBottom: 90,
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
  titleText: { color: "#fff", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  scrollContainer: { marginTop: 15, width: "100%" },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContent: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 200,
  },
  emptyText: {
    color: "#383838",
    fontSize: 14,
    marginTop: 10,
    fontFamily: "Kanit-SemiBold",
  },
  competitionBox: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  image: { width: "100%", height: 200, borderRadius: 15, resizeMode: "cover" },
  fullname: {
    color: "#07F469",
    fontSize: 16,
    fontFamily: "Kanit-SemiBold",
    marginTop: 8,
    textAlign: "center",
  },
  boxtitle: {
    backgroundColor: "#202020",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  title: { color: "#07F469", fontSize: 13, fontFamily: "Kanit-SemiBold" },

  /* กรอบสามกรอบ */
  threeBoxContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  leftBox: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },
  leftTopBox: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
  },
  leftBottomBox: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
  },
  rightBox: {
    flex: 1,
    height: 220,
    borderRadius: 15,
    overflow: "hidden",
  },
  boxLabel: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
    textAlign: "center",
    marginBottom: 5,
  },
  boxNumber: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "MuseoModerno-SemiBold",
    textAlign: "center",
  },
  fontteam: {
    fontFamily: "Kanit-SemiBold",
    fontSize: 18,
  },
  rightBoxContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  rightBox: {
    flex: 1,
    height: 220,
    borderRadius: 15,
    overflow: "hidden",
  },
  boxLabel: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
    textAlign: "center",
    marginTop: 5,
  },
  boxNumber: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "MuseoModerno-SemiBold",
    textAlign: "center",
    marginTop: 3,
  },
  boxLabely: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
    textAlign: "center",
    marginBottom: 15,
  },
  boxNumbery: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "MuseoModerno-SemiBold",
    textAlign: "center",
    marginTop: 22,
  },
  fontteam: {
    fontFamily: "Kanit-SemiBold",
    fontSize: 18,
  },
  buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 15,
  gap: 10, 
},
actionButton: {
  flex: 1, // ให้ปุ่มขยายเท่าๆกัน
  paddingVertical: 10,
  borderRadius: 10,
  alignItems: 'center',
},
actionButtonText: {
  color: '#fff',
  fontSize: 14,
  fontFamily: 'Kanit-SemiBold',
},
buttonContainer: {
  marginTop: 25,
  width: '100%',
  gap: 10, 
},
fullWidthButton: {
  width: '100%',
  flexDirection: 'row',      
  justifyContent: 'space-between', 
  alignItems: 'center',  
  paddingVertical: 12,
  paddingHorizontal: 15,
  borderRadius: 10,
  backgroundColor: '#202020',
},
buttonText: {
  color: '#07F469',
  fontSize: 14,
  fontFamily: 'Kanit-SemiBold',
},

});
