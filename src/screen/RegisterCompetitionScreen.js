import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { FormLine } from "../../components/icon/FormLine";
import * as ImagePicker from "expo-image-picker";

export default function RegisterCompetitionScreen() {
  const navigation = useNavigation();

  const [teamName, setTeamName] = useState("");
  const [teamColor, setTeamColor] = useState("");
  const [teamLogo, setTeamLogo] = useState(null);
  const [staffImages, setStaffImages] = useState([null, null, null]);
  const [staffNames, setStaffNames] = useState(["", "", ""]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setTeamLogo(result.assets[0].uri);
    }
  };

  const pickStaffImage = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const newImages = [...staffImages];
      newImages[index] = result.assets[0].uri;
      setStaffImages(newImages);
    }
  };

  const updateStaffName = (text, index) => {
    const newNames = [...staffNames];
    newNames[index] = text;
    setStaffNames(newNames);
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
            <Text style={styles.titleText}>ลงสมัครแข่ง</Text>
            <Text style={styles.subTitleText}>อาทิ7ชาลเลนจ์คัพ2024</Text>
          </View>
          <FormLine size={50} color="#fff" />
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <View
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* โลโก้ทีม */}
        <Text style={styles.label}>โลโก้ทีม</Text>
        <View style={styles.logoRow}>
          <TouchableOpacity style={styles.logoBox} onPress={pickImage}>
            {teamLogo ? (
              <Image source={{ uri: teamLogo }} style={styles.logoImage} />
            ) : (
              <Text style={styles.logoText}>เลือกรูปโลโก้</Text>
            )}
          </TouchableOpacity>
          <View style={styles.teamInfoBox}>
            <Text style={styles.infoLabel}>ชื่อทีม:</Text>
            <TextInput
              style={[
                styles.input,
                { marginTop: 5, height: 35, paddingLeft: 12 },
              ]}
              placeholder="เช่น น้ำเงิน, ดำ-แดง"
              placeholderTextColor="#aaa"
              value={teamName}
              onChangeText={setTeamName}
                selectionColor="#07F469"

            />
            <Text style={styles.infoLabel}>สีเสื้อ:</Text>
            <TextInput
              style={[
                styles.input,
                { marginTop: 5, height: 35, paddingLeft: 12 },
              ]}
              placeholder="เช่น น้ำเงิน, ดำ-แดง"
              placeholderTextColor="#aaa"
              value={teamColor}
              onChangeText={setTeamColor}
                selectionColor="#07F469"

            />
          </View>
        </View>

        {/* สตาฟโค้ด */}
        <Text style={styles.label}>สตาฟโค้ด</Text>
        <View style={styles.staffRow}>
          {staffImages.map((imgUri, index) => (
            <View key={index} style={styles.staffBox}>
              <View style={styles.staffImagePlaceholder}>
                {imgUri && (
                  <Image
                    source={{ uri: imgUri }}
                    style={styles.staffImageUnder}
                  />
                )}
                <TouchableOpacity
                  style={styles.staffImageButton}
                  onPress={() => pickStaffImage(index)}
                >
                  <Text style={styles.staffButtonText}>
                    {imgUri ? "เปลี่ยนรูป" : "เพิ่มรูป"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.staffNameInput}
                placeholder="ใส่ชื่อที่นี่"
                placeholderTextColor="#aaa"
                value={staffNames[index]}
                onChangeText={(text) => updateStaffName(text, index)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Footer: หมายเหตุ + ปุ่ม */}
      <View style={styles.footer}>
        <View style={styles.boxwarning}>
          <Text style={styles.boxWarningText}>
            * กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนกด "ดำเนินการต่อ"
          </Text>
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate("PlayerRegistration")}
        >
          <Text style={styles.submitButtonText}>ดำเนินการต่อ</Text>
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
    flex: 1,
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
  label: {
    color: "#07F469",
    fontSize: 13,
    marginTop: 20,
    marginBottom: 8,
    fontFamily: "Kanit-SemiBold",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#07F469",
    color: "#141414",
    borderRadius: 20,
    alignContent: "center",
    justifyContent: "center",
    width: "100%",
    fontFamily: "Kanit-Regular",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 10,
  },
  logoBox: {
    width: 100,
    height: 135,
    borderRadius: 15,
    borderWidth: 1,
    marginTop: 15,
    borderColor: "#07F469",
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  logoText: {
    color: "#aaa",
    textAlign: "center",
    fontFamily: "Kanit-Regular",
    fontSize: 10,
  },
  teamInfoBox: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontFamily: "Kanit-SemiBold",
    color: "#07F469",
    fontSize: 13,
    marginTop: 15,
  },
  staffRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  staffBox: {
    alignItems: "center",
    width: "30%",
  },
  staffImagePlaceholder: {
    width: 110,
    height: 125,
    borderWidth: 1,
    borderColor: "#07F469",
    borderRadius: 15,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  staffImageUnder: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    resizeMode: "cover",
  },
  staffImageButton: {
    position: "absolute",
    bottom: 5,
    alignSelf: "center",
    backgroundColor: "rgba(21, 65, 39, 0.8)",
    borderRadius: 10,
    width: 60,
    height: 24,
    marginLeft: 35,
  },
  staffButtonText: {
    fontSize: 12,
    fontFamily: "Kanit-Regular",
    color: "#07F469",
    textAlign: "center",
  },
  staffNameInput: {
    marginTop: 10,
    backgroundColor: "#fff",
    color: "#141414",
    padding: 6,
    borderRadius: 10,
    fontSize: 12,
    borderWidth: 1,
    borderColor: "#07F469",
    textAlign: "center",
    fontFamily: "Kanit-Regular",
    width: 110,
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
    backgroundColor: "#07F469",
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
});
