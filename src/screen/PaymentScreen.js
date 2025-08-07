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
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { FormLine } from "../../components/icon/FormLine";

export default function PaymentScreen() {
  const navigation = useNavigation();
  const [slipImage, setSlipImage] = useState(null);

  // ฟังก์ชันเลือกภาพสลิป
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please allow access to your photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setSlipImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image: ", error);
    }
  };

  // ฟังก์ชันกดยืนยัน
  const onConfirm = () => {
    if (!slipImage) {
      Alert.alert("แจ้งเตือน", "กรุณาแนบสลิปก่อนยืนยันการชำระเงิน");
      return;
    }
    Alert.alert("สำเร็จ", "ยืนยันการชำระเงินเรียบร้อยแล้ว");
    // ทำงานต่อ เช่น ส่งข้อมูลไป server
  };

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
            <Text style={styles.subTitleText}>อาทิ7ชาลเลนจ์คัพ2024</Text>
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
              ชื่อทีม : <Text style={styles.labelfirstTsub}>อีโก้ เอฟซี</Text>
            </Text>
            <Text style={styles.labelfirstT}>
              สีเสื้อของทีม : <Text style={styles.labelfirstTsub}>เหลือง-ดำ</Text>
            </Text>
          </View>

          <View style={styles.logoBox}>
            <Text style={styles.labelfirstT}>โลโก้ทีม : </Text>
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/011/049/345/non_2x/soccer-football-badge-logo-sport-team-identity-illustrations-isolated-on-white-background-vector.jpg",
              }}
              style={styles.logo}
            />
          </View>
        </View>

        {/* ปุ่มเช็ครายชื่อ */}
        <TouchableOpacity style={styles.listplayer} onPress={() => navigation.navigate("ListPlayer")}>
          <View style={styles.listplayerContent}>
            <Text style={styles.listplayerText}>เช็ครายชื่อสมาชิกในทีม</Text>
            <Feather name="chevron-right" size={26} color="#07F469" />
          </View>
        </TouchableOpacity>

        {/* กล่องข้อมูล QR และการแนปสลิป */}
        <LinearGradient
          colors={["#003AAE", "#192132"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.infoBox}
        >
          <View style={styles.boxtitle}>
            <Text style={styles.title}>การชำระค่าสมัคร</Text>
          </View>

          <Image
            source={{
              uri: "https://www.101servizi.com/wp-content/uploads/2020/07/QRCodeArticolo.jpg",
            }}
            style={styles.QrCodeImage}
          />

          <Text style={styles.title}>
            ค่าสมัครต่อทีม : <Text style={styles.price}>10,000 บาท</Text>
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
          style={[
            styles.submitButton,
            { backgroundColor: slipImage ? "#07F469" : "#666666" },
          ]}
          onPress={() => navigation.navigate("LoadingPayment")}
          disabled={!slipImage}
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
  scrollContent: {
    paddingBottom: 180,
  },
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
  textBox: {
    flex: 1,
    alignItems: "flex-end",
    marginEnd: 10,
  },
  titleText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
  },
  subTitleText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
  },
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
  labelfirstTsub: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
  },
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
  QrCodeImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: "#1a1a1a",
  },
  listplayer: {
    width: "100%",
    height: 45,
    backgroundColor: "#202020",
    borderRadius: 15,
    marginTop: 5,
  },
  listplayerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingHorizontal: 15,
  },
  listplayerText: {
    color: "#07F469",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
  },
  infoBox: {
    width: "100%",
    flexGrow: 0,
    borderRadius: 15,
    padding: 12,
    marginTop: 12,
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: "#141414",
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
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#141414",
    fontSize: 16,
    fontFamily: "Kanit-SemiBold",
  },
  boxtitle: {
    backgroundColor: "#202020",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginTop: 2,
    alignSelf: "center",
  },
  title: {
    color: "#07F469",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
  },
  price: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
    fontWeight: "bold",
  },
  buttonslip: {
    width: 125,
    height: 30,
    backgroundColor: "#07F469",
    borderRadius: 15,
    marginTop: 15,
    justifyContent: "center",
  },
  slipContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  slipplayerText: {
    color: "#154127",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
  },
  slipPreview: {
    width: 200,
    height: 250,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
});
