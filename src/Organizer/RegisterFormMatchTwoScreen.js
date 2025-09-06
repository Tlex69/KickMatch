// RegisterFormMatchTwoScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Edit2 } from "../../components/icon/Edit2";
import DateTimePicker from "@react-native-community/datetimepicker";

// Firebase
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function RegisterFormMatchTwoScreen({ route, navigation }) {
  const { matchId } = route.params || {};

  const [firstPrize, setFirstPrize] = useState("");
  const [secondPrize, setSecondPrize] = useState("");
  const [thirdPrize, setThirdPrize] = useState("");
  const [rules, setRules] = useState("");
  const [venue, setVenue] = useState("");
  const [contact, setContact] = useState("");

  // ✅ state สำหรับเวลา
  const [startTime, setStartTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = async () => {
    if (
      !firstPrize ||
      !secondPrize ||
      !thirdPrize ||
      !rules ||
      !venue ||
      !contact ||
      !startTime
    ) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      await updateDoc(doc(db, "matches", matchId), {
        firstPrize,
        secondPrize,
        thirdPrize,
        rules,
        venue,
        contact,
        startTime: startTime.toISOString(), // เก็บเป็น ISO string
      });
      navigation.navigate("RegisterFormMatchQR", { matchId });
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    }
  };

  // ✅ เมื่อเลือกวันที่/เวลา
  const onChangeTime = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setStartTime(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />
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
            <Text style={styles.subTitleText}>ข้อมูลเพิ่มเติมรายการแข่ง</Text>
          </View>
          <Edit2 size={42} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.formWrapper}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* --- input อื่น ๆ --- */}
        <Text style={styles.label}>รางวัลที่ผู้แข่งขันจะได้รับ</Text>
        <TextInput
          placeholder="อันดับที่ 1 เช่น เงินรางวัล + ถ้วยรางวัล"
          placeholderTextColor="#888"
          style={styles.input}
          value={firstPrize}
          onChangeText={setFirstPrize}
        />
        <TextInput
          placeholder="อันดับที่ 2 เช่น เงินรางวัล + ถ้วยรางวัล"
          placeholderTextColor="#888"
          style={styles.input}
          value={secondPrize}
          onChangeText={setSecondPrize}
        />
        <TextInput
          placeholder="อันดับที่ 3 เช่น เงินรางวัล + ถ้วยรางวัล"
          placeholderTextColor="#888"
          style={styles.input}
          value={thirdPrize}
          onChangeText={setThirdPrize}
        />

        <Text style={styles.label}>กฎกติกา-การแข่งขัน</Text>
        <TextInput
          placeholder="เช่น แข่งครึ่งละ 20 นาที หรือ แนบไฟล์"
          placeholderTextColor="#888"
          style={styles.input}
          value={rules}
          onChangeText={setRules}
        />

        <Text style={styles.label}>สถานที่แข่งขัน</Text>
        <TextInput
          placeholder="เช่น สนาม T-Rex โคราช หรือ ลิงค์ แมพ"
          placeholderTextColor="#888"
          style={styles.input}
          value={venue}
          onChangeText={setVenue}
        />

        <Text style={styles.label}>ติดต่อ/สอบถาม</Text>
        <TextInput
          placeholder="เบอร์มือถือ หรือ Line ID"
          placeholderTextColor="#888"
          style={styles.input}
          value={contact}
          onChangeText={setContact}
        />

        {/* ✅ เวลาเริ่มแข่งขันคู่แรก */}
        <Text style={styles.label}>เวลาเริ่มแข่งขันคู่แรก</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: "#141414", fontSize: 15 }}>
            {startTime.toLocaleString("th-TH", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={startTime}
              mode="datetime"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onChangeTime}
              textColor="#000" // iOS
              themeVariant="light" // iOS
            />
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>ดำเนินการต่อ</Text>
        </TouchableOpacity>
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
  input: {
    backgroundColor: "#fff",
    color: "#141414",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#9747FF",
  },
  pickerContainer: {
    backgroundColor: "#fff", // ✅ ปฏิทินพื้นหลังขาว
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#9747FF",
    borderRadius: 20,
    width: "100%",
    height: 50,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Kanit-SemiBold",
  },
});
