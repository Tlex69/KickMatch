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
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Edit2 } from "../../components/icon/Edit2";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";

// firebase
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function RegisterFormMatchScreen({ navigation }) {
  const [fullname, setFullname] = useState("");
  const [playerType, setPlayerType] = useState(null);
  const [teamAmount, setTeamAmount] = useState("");
  const [category1, setCategory1] = useState(null);
  const [category2, setCategory2] = useState(null);
  const [promoImage, setPromoImage] = useState(null);
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isFocus, setIsFocus] = useState(false);
  const [isFocusTeam, setIsFocusTeam] = useState(false);
  const [isFocusCategory1, setIsFocusCategory1] = useState(false);
  const [isFocusCategory2, setIsFocusCategory2] = useState(false);

  const playerTypeOptions = [
    { label: "เยาวชน", value: "เยาวชน" },
    { label: "ประชาชนทั่วไป", value: "ประชาชน" },
  ];
  const teamAmountOptions = [
    { label: "4 ทีม", value: 4 },
    { label: "8 ทีม", value: 8 },
    { label: "12 ทีม", value: 12 },
    { label: "16 ทีม", value: 16 },
    { label: "32 ทีม", value: 32 },
    { label: "36 ทีม", value: 36 },
    { label: "48 ทีม", value: 48 },
  ];
  const category1Options = [
    { label: "ฟุตบอล 7 คน", value: "ฟุตบอล7คน" },
    { label: "ฟุตบอล 8 คน", value: "ฟุตบอล8คน" },
    { label: "ฟุตบอล 9 คน", value: "ฟุตบอล9คน" },
    { label: "ฟุตบอล 11 คน", value: "ฟุตบอล11คน" },
  ];
  const category2Options = [
    { label: "บอลลีก", value: "บอลลีก" },
    { label: "บอลถ้วย", value: "บอลถ้วย" },
    { label: "ลีกคัพ", value: "ลีกคัพ" },
  ];

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

  const handleContinue = async () => {
    if (
      !fullname ||
      !playerType ||
      !teamAmount ||
      !category1 ||
      !category2 ||
      !promoImage ||
      !price
    ) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "matches"), {
        fullname,
        playerType,
        teamAmount,
        category1,
        category2,
        promoImage,
        price,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        createdAt: serverTimestamp(),
      });

      // บันทึกสำเร็จ → ไปหน้า RegisterFormMatchTwoScreen พร้อมส่ง docId
      navigation.navigate("RegisterFormMatchTwo", { matchId: docRef.id });
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
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
            <Text style={styles.subTitleText}>ลงทะเบียนสร้างรายการแข่ง</Text>
          </View>
          <Edit2 size={42} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Text style={styles.label}>ชื่อรายการแข่ง</Text>
        <TextInput
          placeholder="เช่น คิกแมตท์ คัฟ"
          placeholderTextColor="#888"
          style={styles.input}
          value={fullname}
          onChangeText={setFullname}
        />

        <Text style={styles.label}>ประเภทผู้เล่น</Text>
        <Dropdown
          style={[styles.input, isFocus && { borderColor: "#6200EE" }]}
          placeholderStyle={{ color: "#888", fontFamily: "Kanit-Regular" }}
          selectedTextStyle={{ color: "#141414", fontFamily: "Kanit-Regular" }}
          itemTextStyle={{
            fontFamily: "Kanit-Regular",
            color: "#141414",
            fontSize: 14,
          }}
          data={playerTypeOptions}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "เลือกประเภทผู้เล่น" : "..."}
          value={playerType}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setPlayerType(item.value);
            setIsFocus(false);
          }}
        />

        <Text style={styles.label}>จำนวนทีมที่รับสมัคร</Text>
        <Dropdown
          style={[styles.input, isFocusTeam && { borderColor: "#6200EE" }]}
          placeholderStyle={{ color: "#888", fontFamily: "Kanit-Regular" }}
          selectedTextStyle={{ color: "#141414", fontFamily: "Kanit-Regular" }}
          itemTextStyle={{
            fontFamily: "Kanit-Regular",
            color: "#141414",
            fontSize: 14,
          }}
          data={teamAmountOptions}
          labelField="label"
          valueField="value"
          placeholder={!isFocusTeam ? "เลือกจำนวนทีม" : "..."}
          value={teamAmount}
          onFocus={() => setIsFocusTeam(true)}
          onBlur={() => setIsFocusTeam(false)}
          onChange={(item) => {
            setTeamAmount(item.value);
            setIsFocusTeam(false);
          }}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>ประเภทรายการ 1</Text>
            <Dropdown
              style={[
                styles.input,
                isFocusCategory1 && { borderColor: "#6200EE" },
              ]}
              placeholderStyle={{ color: "#888", fontFamily: "Kanit-Regular" }}
              selectedTextStyle={{
                color: "#141414",
                fontFamily: "Kanit-Regular",
              }}
              itemTextStyle={{
                fontFamily: "Kanit-Regular",
                color: "#141414",
                fontSize: 14,
              }}
              data={category1Options}
              labelField="label"
              valueField="value"
              placeholder={!isFocusCategory1 ? "ประเภทรายการ 1" : "..."}
              value={category1}
              onFocus={() => setIsFocusCategory1(true)}
              onBlur={() => setIsFocusCategory1(false)}
              onChange={(item) => {
                setCategory1(item.value);
                setIsFocusCategory1(false);
              }}
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>ประเภทรายการ 2</Text>
            <Dropdown
              style={[
                styles.input,
                isFocusCategory2 && { borderColor: "#6200EE" },
              ]}
              placeholderStyle={{ color: "#888", fontFamily: "Kanit-Regular" }}
              selectedTextStyle={{
                color: "#141414",
                fontFamily: "Kanit-Regular",
              }}
              itemTextStyle={{
                fontFamily: "Kanit-Regular",
                color: "#141414",
                fontSize: 14,
              }}
              data={category2Options}
              labelField="label"
              valueField="value"
              placeholder={!isFocusCategory2 ? "ประเภทรายการ 2" : "..."}
              value={category2}
              onFocus={() => setIsFocusCategory2(true)}
              onBlur={() => setIsFocusCategory2(false)}
              onChange={(item) => {
                setCategory2(item.value);
                setIsFocusCategory2(false);
              }}
            />
          </View>
        </View>

        <Text style={styles.label}>รูปโปรโมตรายการ</Text>
        <View style={styles.promoImageContainer}>
          <Text style={styles.promoText}>แนบรูปโปรโมต</Text>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={handlePickPromoImage}
          >
            <Text style={styles.attachButtonText}>
              {promoImage ? "เปลี่ยนรูป" : "แนบรูป"}
            </Text>
          </TouchableOpacity>
        </View>
        {promoImage && (
          <Image
            source={{ uri: promoImage }}
            style={styles.promoImagePreview}
            resizeMode="cover"
          />
        )}

        <Text style={styles.label}>ค่าสมัครต่อทีม</Text>
        <TextInput
          placeholder="เช่น 2,500 บาท"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="number-pad"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>วันที่เริ่มแข่งขัน</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>{startDate.toLocaleString()}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="datetime"
            display="default"
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        <Text style={styles.label}>วันที่สิ้นสุดการแข่งขัน</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text>{endDate.toLocaleString()}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="datetime"
            display="default"
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleContinue}>
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
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 55,
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
  textBox: { flex: 1, alignItems: "flex-end", marginEnd: 10 },
  titleText: { color: "#fff", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  subTitleText: { color: "#fff", fontSize: 14, fontFamily: "Kanit-SemiBold" },
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
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#9747FF",
    fontFamily: "Kanit-Regular",
    fontSize: 15,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfWidth: { flex: 1, marginHorizontal: 5 },
  promoImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#9747FF",
    borderRadius: 20,
    width: "100%",
    height: 50,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  promoText: {
    fontFamily: "Kanit-Regular",
    fontSize: 16,
    marginLeft: 10,
    color: "#888",
  },
  attachButton: {
    backgroundColor: "#9747FF",
    borderRadius: 15,
    height: 50,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  attachButtonText: {
    color: "#fff",
    fontFamily: "Kanit-SemiBold",
    fontSize: 14,
  },
  promoImagePreview: {
    width: "40%",
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: "cover",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#9747FF",
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
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
  submitText: { color: "#fff", fontSize: 17, fontFamily: "Kanit-SemiBold" },
});
