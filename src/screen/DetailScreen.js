import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function DetailScreen() {
  const navigation = useNavigation();
  const { match } = useRoute().params || {};

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />

      <View style={styles.imageContainer}>
        <Image
          source={match?.promoImage ? { uri: match.promoImage } : require("../../assets/f1.jpg")}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backButtonCircle}>
            <Ionicons name="arrow-back" size={24} color="#07F469" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.titleText}>{match?.fullname || "ไม่มีชื่อรายการ"}</Text>

        <View style={styles.boxsub}>
          <Text style={styles.subtitle}>รายละเอียด</Text>
        </View>

        <View style={styles.boxdetail}>
          <Text style={styles.subdetail}>
            ประเภทการแข่งขัน : <Text style={styles.subsubdetail}>{match?.category2 || "-"}</Text>
          </Text>
          <Text style={styles.subdetail}>
            ประเภทผู้เล่น : <Text style={styles.subsubdetail}>{match?.playerType || "-"}</Text>
          </Text>
          <Text style={styles.subdetail}>
            จำนวนทีมที่สมัครแล้ว / จำนวนทีมที่รับสมัคร :{" "}
            <Text style={styles.subsubdetail}>
              {match?.totalTeams || 0} / {match?.teamAmount || 0} ทีม
            </Text>
          </Text>
          <Text style={styles.subdetail}>
            ค่าสมัครต่อทีม : <Text style={styles.subsubdetail}>{match?.price || 0} บาท</Text>
          </Text>
        </View>

        <View style={styles.boxreward}>
          <Text style={styles.subreward}>รางวัลการแข่งขัน :</Text>
          <Text style={styles.subsubreward}>{match?.firstPrize || "-"}</Text>
          <Text style={styles.subsubreward}>{match?.secondPrize || "-"}</Text>
          <Text style={styles.subsubreward}>{match?.thirdPrize || "-"}</Text>
        </View>

        <View style={styles.boxrules}>
          <Text style={styles.subrules}>
            กฎกติกา : <Text style={styles.subsubrules}>{match?.rules || "-"}</Text>
          </Text>

          <View style={styles.boxother}>
            <Text style={styles.subother}>
              สถานที่จัดแข่งขัน : <Text style={styles.subsubother}>{match?.venue || "-"}</Text>
            </Text>
            <Text style={styles.subother}>
              หมดเขตสมัคร : <Text style={styles.subsubother}>{match?.endDate || "-"}</Text>
            </Text>
            <Text style={styles.subother}>
              ติดต่อ/สอบถาม : <Text style={styles.subsubother}>{match?.contact || "-"}</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.registerButtonFixed}
          onPress={() => navigation.navigate("RegisterCompetition", { match })}
        >
          <Text style={styles.registerButtonText}>สมัครแข่ง</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  imageContainer: { width: "100%", height: 320, position: "relative" },
  image: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: { position: "absolute", top: 50, left: 15 },
  backButtonCircle: {
    backgroundColor: "#154127",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  detailContainer: { paddingHorizontal: 20, paddingTop: 20 },
  titleText: { color: "#07F469", fontSize: 18, fontFamily: "Kanit-SemiBold" },
  boxsub: { width: 90, height: 28, backgroundColor: "#202020", borderRadius: 15, alignItems: "center", marginTop: 20 },
  subtitle: { fontFamily: "Kanit-SemiBold", fontSize: 13, color: "#07F469", marginTop: 2 },
  boxdetail: { marginTop: 5 },
  subdetail: { fontFamily: "Kanit-Regular", fontSize: 14, color: "#07F469", paddingTop: 15 },
  subsubdetail: { color: "#fff" },
  boxreward: { marginTop: 25 },
  subreward: { fontFamily: "Kanit-Regular", color: "#07F469" },
  subsubreward: { fontFamily: "Kanit-Regular", color: "#fff", marginTop: 5 },
  boxrules: { marginTop: 25 },
  subrules: { fontFamily: "Kanit-Regular", color: "#07F469", fontSize: 14 },
  subsubrules: { color: "#fff" },
  boxother: { marginTop: 25, marginBottom: 140 },
  subother: { fontFamily: "Kanit-Regular", color: "#07F469", paddingTop: 15 },
  subsubother: { color: "#fff" },
  registerButtonFixed: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    width: 350,
    height: 50,
    backgroundColor: "#07F469",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  registerButtonText: { color: "#154127", fontSize: 17, fontFamily: "Kanit-SemiBold" },
});
