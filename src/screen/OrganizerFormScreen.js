import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Edit2 } from "../../components/icon/Edit2";

import { auth, db, storage } from "../../firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function OrganizerFormScreen({ route, navigation }) {
  const { plan: routePlan } = route.params || {};
  const plan = routePlan || "basic"; // ค่า default เป็น "basic"

  const [fullname, setFullname] = useState("");
  const [idCard, setIdCard] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [slipImage, setSlipImage] = useState(null);

  // เลือกรูปสลิป
  const handlePickSlip = async () => {
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
      setSlipImage(pickerResult.assets[0].uri);
    }
  };

  // อัปโหลดสลิปไป Storage
  const uploadSlipToStorage = async (uri, userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `slips/${userId}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  // ส่งฟอร์ม
  const handleSubmit = async () => {
    if (!fullname || !idCard || !phone) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (plan === "advanced" && !slipImage) {
      Alert.alert("กรุณาแนบสลิปการโอนเงิน");
      return;
    }

    try {
      const userId = auth.currentUser.uid;

      let slipURL = null;
      if (slipImage) {
        slipURL = await uploadSlipToStorage(slipImage, userId);
      }

      // บันทึกข้อมูล Organizer
      await setDoc(doc(db, "organizers", userId), {
        fullname,
        idCard,
        phone,
        note,
        slipImage: slipURL,
        plan,
        status: "pending",
        createdAt: new Date(),
      });

      // เปลี่ยน role ของผู้ใช้
      await updateDoc(doc(db, "users", userId), {
        role: "organizer",
      });

      Alert.alert("สมัครสำเร็จ", "รอการอนุมัติจากผู้ดูแลระบบ");
      navigation.navigate("Loading");

    } catch (error) {
      console.log(error);
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    }
  };

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.textBox}>
            <Text style={styles.titleText}>สมัครเป็นฝ่ายจัด</Text>
            <Text style={styles.subTitleText}>กรอกข้อมูลสมัคร</Text>
          </View>
          <Edit2 size={42} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.formWrapper}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>ชื่อ-นามสกุล</Text>
        <TextInput
          placeholder="ชื่อ-นามสกุล"
          placeholderTextColor="#888"
          style={styles.input}
          value={fullname}
          onChangeText={setFullname}
        />

        <Text style={styles.label}>เลขบัตรประชาชน</Text>
        <TextInput
          placeholder="เลขบัตรประชาชน"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={13}
          value={idCard}
          onChangeText={setIdCard}
        />

        <Text style={styles.label}>เบอร์โทรศัพท์</Text>
        <TextInput
          placeholder="เบอร์โทรศัพท์"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>หมายเหตุ (ถ้ามี)</Text>
        <TextInput
          placeholder="หมายเหตุ (ถ้ามี)"
          placeholderTextColor="#888"
          style={[styles.input, { height: 80 }]}
          value={note}
          onChangeText={setNote}
          multiline
        />

        {plan === "advanced" && (
          <>
            <Text style={styles.qrLabel}>QR พร้อมเพย์ของฝ่ายจัด</Text>
            <Image
              source={require("../../assets/qr.jpg")}
              style={styles.qrImage}
            />

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePickSlip}
            >
              <Text style={styles.uploadText}>
                {slipImage ? "เปลี่ยนสลิปการโอน" : "แนบสลิปการโอน"}
              </Text>
            </TouchableOpacity>

            {slipImage && (
              <Image source={{ uri: slipImage }} style={styles.slipPreview} />
            )}
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>ส่งคำขอสมัคร</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// styles เหมือนเดิม

// styles เหมือนเดิม

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingTop: 55,
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
    color: "#07F469",
    fontSize: 13,
    marginBottom: 6,
    fontFamily: "Kanit-SemiBold",
    paddingTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    color: "#141414",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#07F469",
    fontFamily: "Kanit-Regular",
  },
  qrLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Kanit-SemiBold",
  },
  qrImage: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: "#673AB7",
    borderRadius: 20,
    height: 50,
    width: "100%",
    marginBottom: 15,
    alignItems: "center",
  },
  uploadText: {
    color: "#fff",
    fontSize: 15,
    marginTop: 10,
    fontFamily: "Kanit-SemiBold",
  },
  slipPreview: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: "#03C252",
    borderRadius: 20,
    width: "100%",
    height: 50,
    alignItems: "center",
    marginBottom: 50,
  },
  submitText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Kanit-SemiBold",
    marginTop: 10,
  },
});
