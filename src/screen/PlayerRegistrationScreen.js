// PlayerRegistrationScreen.js
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
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { FormLine } from "../../components/icon/FormLine";
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";

// 👇 import firebase
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function PlayerRegistrationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { match, teamId, teamData } = route.params || {};

  const [playerImages, setPlayerImages] = useState(Array(24).fill(null));
  const [playerNames, setPlayerNames] = useState(Array(24).fill(""));
  const [playerNumbers, setPlayerNumbers] = useState(Array(24).fill(null));

  const jerseyNumbers = Array.from({ length: 99 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  const pickPlayerImage = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const newImages = [...playerImages];
      newImages[index] = result.assets[0].uri;
      setPlayerImages(newImages);
    }
  };

  const updatePlayerName = (text, index) => {
    const newNames = [...playerNames];
    newNames[index] = text;
    setPlayerNames(newNames);
  };

  const updatePlayerNumber = (value, index) => {
    const newNumbers = [...playerNumbers];
    newNumbers[index] = value;
    setPlayerNumbers(newNumbers);
  };

  // 👇 save players to firestore
  const handleSubmit = async () => {
    const players = playerNames.map((name, index) => ({
      name,
      number: playerNumbers[index],
      image: playerImages[index],
    }));

    try {
      await setDoc(
        doc(db, "teams", teamId),
        {
          ...teamData,
          players: players,
        },
        { merge: true }
      );

      Alert.alert("สำเร็จ", "บันทึกข้อมูลนักเตะเรียบร้อยแล้ว");

      // ส่งต่อไป PaymentScreen
      navigation.navigate("Payment", {
        match,
        teamId,
        teamData,
        players,
      });
    } catch (error) {
      console.error("Error saving players: ", error);
      Alert.alert("ผิดพลาด", "ไม่สามารถบันทึกนักเตะได้");
    }
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
            <Text style={styles.titleText}>ลงชื่อนักเตะ</Text>
            <Text style={styles.subTitleText}>
              {match?.fullname || "ไม่มีชื่อรายการ"}
            </Text>
          </View>
          <FormLine size={50} color="#fff" />
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>รายชื่อนักเตะ</Text>
        <View style={styles.playerGrid}>
          {playerImages.map((imgUri, index) => (
            <View key={index} style={styles.playerBox}>
              <View style={styles.playerImagePlaceholder}>
                {imgUri && (
                  <Image
                    source={{ uri: imgUri }}
                    style={styles.playerImageUnder}
                  />
                )}
                <TouchableOpacity
                  style={styles.playerImageButton}
                  onPress={() => pickPlayerImage(index)}
                >
                  <Text style={styles.playerButtonText}>
                    {imgUri ? "เปลี่ยนรูป" : "เพิ่มรูป"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.dropdownContainer}>
                  <Dropdown
                    style={styles.dropdown}
                    data={jerseyNumbers}
                    labelField="label"
                    valueField="value"
                    placeholder="เบอร์"
                    placeholderStyle={styles.dropdownPlaceholder}
                    value={playerNumbers[index]}
                    onChange={(item) => updatePlayerNumber(item.value, index)}
                    maxHeight={150}
                    showsVerticalScrollIndicator
                    dropdownPosition="bottom"
                    selectedTextStyle={styles.dropdownText}
                    renderRightIcon={() => (
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={18}
                        color="#07F469"
                      />
                    )}
                    renderItem={(item) => (
                      <Text style={styles.dropdownText}>{item.label}</Text>
                    )}
                  />
                </View>
              </View>

              <TextInput
                style={styles.playerNameInput}
                placeholder={`ชื่อผู้เล่น #${index + 1}`}
                placeholderTextColor="#aaa"
                value={playerNames[index]}
                onChangeText={(text) => updatePlayerName(text, index)}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.boxwarning}>
          <Text style={styles.boxWarningText}>
            * ตรวจสอบข้อมูลให้ครบถ้วนก่อนกด "ดำเนินการต่อ"
          </Text>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
  scrollContent: { paddingBottom: 160 },
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
  label: {
    color: "#07F469",
    fontSize: 13,
    marginBottom: 8,
    fontFamily: "Kanit-SemiBold",
  },
  playerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  playerBox: { width: "30%", marginBottom: 15, alignItems: "center" },
  playerImagePlaceholder: {
    width: 105,
    height: 130,
    borderWidth: 1,
    borderColor: "#07F469",
    borderRadius: 15,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  playerImageUnder: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    resizeMode: "cover",
  },
  playerImageButton: {
    position: "absolute",
    bottom: 5,
    alignSelf: "center",
    backgroundColor: "rgba(21, 65, 39, 0.8)",
    borderRadius: 10,
    width: 60,
    height: 24,
    marginLeft: 35,
  },
  playerButtonText: {
    fontSize: 12,
    fontFamily: "Kanit-Regular",
    color: "#07F469",
    textAlign: "center",
  },
  dropdownContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 60,
    zIndex: 1000,
  },
  dropdown: {
    height: 25,
    backgroundColor: "#154127",
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 1,
  },
  playerNameInput: {
    marginTop: 6,
    backgroundColor: "#fff",
    color: "#141414",
    padding: 6,
    borderRadius: 10,
    fontSize: 12.5,
    borderWidth: 1,
    borderColor: "#07F469",
    textAlign: "center",
    fontFamily: "Kanit-Regular",
    width: 100,
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
  dropdownText: {
    fontFamily: "Kanit-Regular",
    fontSize: 15,
    color: "#07F469",
    textAlign: "center",
    width: "100%",
    alignSelf: "center",
    bottom: 1,
  },
  dropdownPlaceholder: {
    fontFamily: "Kanit-Regular",
    fontSize: 12,
    color: "#07F469",
    textAlign: "center",
    width: "100%",
  },
});
