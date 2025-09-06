import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { FormLine } from "../../components/icon/FormLine";
import * as ImagePicker from "expo-image-picker";
import { db, auth } from "../../firebase";
import { doc, setDoc, Timestamp, updateDoc, arrayUnion } from "firebase/firestore";


export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { match, teamId, teamData, players } = route.params || {};
  const staff = teamData?.staff || [];

  const [slipImage, setSlipImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setSlipImage(result.assets[0].uri);
  };

  const onConfirm = async () => {
  try {
    if (!teamId) throw new Error("teamId ไม่ถูกต้อง");

    const teamRef = doc(db, "teams", teamId);
    const matchRef = doc(db, "matches", match?.id);

    // อัปเดตสถานะทีม
    await setDoc(teamRef, {
      paymentStatus: "success",
      paymentDate: Timestamp.fromDate(new Date()),
    }, { merge: true });

    
if (matchRef && auth.currentUser?.uid) {
  await updateDoc(matchRef, {
    paidUsers: arrayUnion(auth.currentUser.uid) 
  });// เพิ่ม current user UID ลงใน match.paidUsers
if (matchRef && auth.currentUser?.uid) {
  await updateDoc(matchRef, {
    paidUsers: arrayUnion(auth.currentUser.uid),
    totalTeams: (match.totalTeams || 0) + 1, // เพิ่มจำนวนทีมที่สมัคร
  });
}
}


    Alert.alert("สำเร็จ", "ยืนยันการชำระเงินเรียบร้อยแล้ว");
    navigation.replace("LoadingPayment", {
      teamName: teamData?.teamName,
      matchName: match?.fullname,
      teamId,
      matchId: match?.id,
    });
  } catch (error) {
    console.error("Payment update error:", error);
    Alert.alert("ผิดพลาด", "ไม่สามารถอัปเดตสถานะได้");
  }
};

  const qrCodeUri = match?.qrCode || null;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={["#14141400", "#03C252"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.textBox}>
            <Text style={styles.titleText}>ชำระค่าสมัคร</Text>
            <Text style={styles.subTitleText}>
              {match?.fullname || "ไม่มีชื่อรายการ"}
            </Text>
          </View>
          <FormLine size={50} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* รายละเอียดทีม */}
        <View style={styles.teamRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelfirstT}>
              ชื่อทีม :{" "}
              <Text style={styles.labelfirstTsub}>
                {teamData?.teamName || "-"}
              </Text>
            </Text>
            <Text style={styles.labelfirstT}>
              สีเสื้อของทีม :{" "}
              <Text style={styles.labelfirstTsub}>
                {teamData?.teamColor || "-"}
              </Text>
            </Text>
          </View>

          <View style={styles.logoBox}>
            <Text style={styles.labelfirstT}>โลโก้ทีม : </Text>
            {teamData?.teamLogo ? (
              <Image source={{ uri: teamData.teamLogo }} style={styles.logo} />
            ) : (
              <View style={[styles.logo, { backgroundColor: "#1a1a1a" }]} />
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.listplayer}
          onPress={() =>
            navigation.navigate("ListPlayer", {
              players,
              staff,
              teamName: teamData?.teamName,
              matchName: match?.fullname || "การแข่งขัน",
            })
          }
        >
          <View style={styles.listplayerContent}>
            <Text style={styles.listplayerText}>
              เช็ครายชื่อสมาชิกในทีม
            </Text>
            <Feather name="chevron-right" size={26} color="#07F469" />
          </View>
        </TouchableOpacity>

        {/* กล่องข้อมูล QR และสลิป */}
        <LinearGradient
          colors={["#003AAE", "#192132"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.infoBox}
        >
          <View style={styles.boxtitle}>
            <Text style={styles.title}>การชำระค่าสมัคร</Text>
          </View>

          {qrCodeUri ? (
            <Image
              source={{ uri: qrCodeUri }}
              style={{
                width: 200,
                height: 200,
                alignSelf: "center",
                marginVertical: 15,
                borderRadius: 10,
              }}
            />
          ) : (
            <Text
              style={{ color: "#fff", textAlign: "center", marginVertical: 15 }}
            >
              QR Code ยังไม่ถูกสร้าง
            </Text>
          )}

          <Text style={styles.title}>
            ค่าสมัครต่อทีม :{" "}
            <Text style={styles.price}>{match?.price || "???"} บาท</Text>
          </Text>

          <TouchableOpacity style={styles.buttonslip} onPress={pickImage}>
            <View style={styles.slipContent}>
              <Text style={styles.slipplayerText}>
                {slipImage ? "เปลี่ยนสลิป" : "แนปสลิป"}
              </Text>
            </View>
          </TouchableOpacity>

          {slipImage && (
            <Image source={{ uri: slipImage }} style={styles.slipPreview} />
          )}
        </LinearGradient>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.boxwarning}>
          <Text style={styles.boxWarningText}>
            * ตรวจสอบข้อมูลให้ครบถ้วนก่อนกด "ยืนยันการชำระเงิน"
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: "#07F469" }]}
          onPress={onConfirm}
        >
          <Text style={styles.submitButtonText}>ยืนยันการชำระเงิน</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingTop: 55,
    paddingHorizontal: 15,
  },
  scrollContent: { paddingBottom: 180 },
  headerBox: {
    width: "100%",
    height: 80,
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textBox: { flex: 1, alignItems: "flex-end", marginEnd: 10 },
  titleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 12,
    marginBottom: 12,
  },
  labelfirstT: {
    color: "#07F469",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
    marginBottom: 18,
  },
  labelfirstTsub: { color: "#fff", fontSize: 13, fontFamily: "Kanit-SemiBold" },
  logoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginLeft: 10,
  },
  logo: {
    width: 77,
    height: 77,
    resizeMode: "contain",
    borderRadius: 10,
    backgroundColor: "#1a1a1a",
  },
  listplayer: {
    width: "100%",
    height: 45,
    backgroundColor: "#202020",
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 15,
  },
  listplayerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  listplayerText: {
    color: "#07F469",
    fontFamily: "Kanit-SemiBold",
    fontSize: 13,
  },
  infoBox: { padding: 12, borderRadius: 15, marginBottom: -100 },
  boxtitle: { marginBottom: 12 },
  title: { fontSize: 15, color: "#07F469", fontFamily: "Kanit-SemiBold", alignSelf: "center" },
  price: { color: "#fff", fontSize: 15, fontFamily: "Kanit-Regular" },
  buttonslip: {
    height: 40,
    backgroundColor: "#154127",
    borderRadius: 15,
    justifyContent: "center",
    marginTop: 15,
  },
  slipContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  slipplayerText: {
    color: "#07F469",
    fontSize: 13,
    fontFamily: "Kanit-Regular",
  },
  slipPreview: { 
    width: "100%",        
    height: 300,        
    borderRadius: 10,     
    marginTop: 15,        
    resizeMode: "contain",
  },
  boxwarning: {
    backgroundColor: "#1D1D1D",
    borderColor: "#FFCC00",
    borderWidth: 1,
    borderRadius: 15,
    padding: 12,
    marginBottom: 20,
  },
  boxWarningText: {
    color: "#FFCC00",
    fontSize: 12,
    fontFamily: "Kanit-Regular",
    lineHeight: 18,
  },
  submitButton: {
    width: "100%",
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#141414",
    fontSize: 16,
    fontFamily: "Kanit-SemiBold",
  },
  footer: {
    bottom: 25,
  },
});
