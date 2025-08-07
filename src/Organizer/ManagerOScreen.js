import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { RoundSupportAgent } from "../../components/icon/RoundSupportAgent";

export default function ManagerOScreen() {
  const navigation = useNavigation();
  const [isJoinRoomVisible, setJoinRoomVisible] = useState(true); // เปิดฟอร์มเข้า ID Room

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      <LinearGradient
        colors={["#14141400", "#07F469"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.textBox}>
            <Text style={styles.titleText}>รายการแข่งขัน</Text>
            <Text style={styles.subTitleText}>ทำงานร่วมกับผู้ช่วยจัดการแข่งขัน</Text>
          </View>

          <RoundSupportAgent width={50} height={50} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.boxtitle}>
                <Text style={styles.title}>ใส่ ID Room กับ รหัสผ่าน</Text>
              </View>
        <View style={styles.inputBox}>
          
          <Text style={styles.inputLabel}>ID Room</Text>
          <TextInput
            style={styles.inputField}
            placeholder="กรอก ID Room"
            placeholderTextColor="#888"
          />

          <Text style={styles.inputLabel}>รหัสผ่าน</Text>
          <TextInput
            style={styles.inputField}
            placeholder="กรอกรหัสผ่าน"
            placeholderTextColor="#888"
            secureTextEntry
          />

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>ดำเนินการต่อ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContainer: {
    marginTop: 15,
    width: "100%",
  },
  inputBox: {
    marginTop: 20,
    borderRadius: 10,
  },
  inputLabel: {
    color: "#07F469",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: "#fff",
    color: "#141414",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#07F469",
    fontFamily: "Kanit-Regular",
  },
  submitButton: {
    backgroundColor: "#07F469",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
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
    alignSelf: "flex-start",
  },
  title: {
    color: "#07F469",
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
  },
});
