// RegisterFormMatchTwoScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Edit2 } from "../../components/icon/Edit2";

// Firebase
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function RegisterFormMatchTwoScreen({ route, navigation }) {
  const { matchId } = route.params || {};
  const [promoImage, setPromoImage] = useState(null);

  const handlePickPromoImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("ต้องการสิทธิ์เข้าถึงรูปภาพ");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!pickerResult.canceled) {
      setPromoImage(pickerResult.assets[0].uri);
    }
  };

  const handleConfirm = async () => {
    if (!promoImage) {
      Alert.alert("กรุณาแนบ QR Code ก่อนดำเนินการต่อ");
      return;
    }

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert("เกิดข้อผิดพลาด", "ไม่พบผู้ใช้ปัจจุบัน");
        return;
      }

      await updateDoc(doc(db, "matches", matchId), {
        qrCode: promoImage,
        ownerUid: currentUser.uid, // บันทึก uid ของผู้สร้างรายการ
      });

      navigation.navigate("LoadingPaymentOScreen", { matchId });
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={["#14141400", "#9747FF"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.textBox}>
            <Text style={styles.titleText}>ตั้งรายการใหม่</Text>
            <Text style={styles.subTitleText}>ลงทะเบียนสร้างรายการแข่ง</Text>
          </View>
          <Edit2 size={42} color="#fff" />
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.formWrapper}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>
          QR Code ชำระเงิน (โปรดล็อกจำนวนเงิน)
        </Text>

        <TouchableOpacity
          style={styles.qrAttachButton}
          onPress={handlePickPromoImage}
        >
          <MaterialIcons
            name={promoImage ? "edit" : "add"}
            size={20}
            color="#B67DFF"
          />
          <Text style={styles.qrAttachText}>
            {promoImage ? "เปลี่ยน QR Code" : "แนบ QR Code ที่นี่"}
          </Text>
        </TouchableOpacity>

        {promoImage && (
          <>
            <Image
              source={{ uri: promoImage }}
              style={styles.qrPreview}
            />

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                กรุณาตรวจสอบข้อมูลการชำระเงินให้ถูกต้องก่อนเผยแพร่รายการแข่งขัน
              </Text>
              <Text style={styles.bulletText}>
                • <Text style={styles.highlight}>ระบุ จำนวนเงินค่าสมัครต่อทีม ให้ชัดเจน</Text>
              </Text>
              <Text style={styles.bulletText}>
                • ตรวจสอบ เบอร์พร้อมเพย์ / เลขบัญชี และ <Text style={styles.highlight}>QR Code</Text> ให้แน่นอน
              </Text>
              <Text style={styles.bulletText}>
                • หากข้อมูลผิด ผู้สมัครอาจโอนเงินผิดยอดหรือผิดบัญชี
              </Text>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>ยืนยันการสร้างรายการแข่ง</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 55,
    paddingHorizontal: 15,
  },
  headerBox: {
    width: "100%",
    height: 80,
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
    marginBottom: 20,
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
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
  },
  subTitleText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
  },
  formWrapper: {
    width: "100%",
  },
  label: {
    color: "#9747FF",
    fontSize: 13,
    marginBottom: 6,
    fontFamily: "Kanit-SemiBold",
    paddingTop: 10,
  },
  qrAttachButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  qrAttachText: {
    color: "#B67DFF",
    fontSize: 12,
    fontFamily: "Kanit-Regular",
    marginLeft: 6,
  },
  qrPreview: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: "contain",
    backgroundColor: "#000",
  },
  warningBox: {
    backgroundColor: "#1C1C1C",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  warningText: {
    color: "#B67DFF",
    fontSize: 12,
    marginBottom: 8,
    fontFamily: "Kanit-SemiBold",
  },
  bulletText: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 4,
    fontFamily: "Kanit-Regular",
  },
  highlight: {
    color: "#B67DFF",
    fontFamily: "Kanit-Regular",
  },
  confirmButton: {
    backgroundColor: "#9747FF",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Kanit-SemiBold",
  },
});
