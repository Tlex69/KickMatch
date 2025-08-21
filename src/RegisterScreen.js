import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // import auth จากไฟล์ firebase.js

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("สมัครบัญชีสำเร็จ");
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title1}>
          Create <Text style={styles.title2}>account</Text>
        </Text>

        <View style={styles.boxtextinput1}>
          <Text style={styles.titleinput}>อีเมล</Text>
          <TextInput
            style={styles.input}
            placeholder="อีเมล"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.boxtextinput2}>
          <Text style={styles.titleinput}>รหัสผ่าน</Text>
          <TextInput
            style={styles.input}
            placeholder="รหัสผ่าน"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.boxtextinput3}>
          <Text style={styles.titleinput}>ยืนยันรหัสผ่าน</Text>
          <TextInput
            style={styles.input}
            placeholder="ยืนยันรหัสผ่าน"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>สมัครบัญชี</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>กลับไปหน้าเข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles เดิมของคุณ
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07F469",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  box: {
    alignContent: "center",
    alignSelf: "center",
    backgroundColor: "#141414",
    width: "402",
    borderRadius: 50,
    padding: 10,
    height: "85%",
    top: 80,
  },
  title1: {
    fontSize: 32,
    fontFamily: "MuseoModerno-Bold",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    top: 30,
  },
  title2: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#07F469",
  },
  input: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    backgroundColor: "white",
    width: 335,
    fontFamily: "Kanit-SemiBold",
  },
  button: {
    backgroundColor: "#07F469",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30, // เดิม 10 → ให้ห่างจาก input ชัดขึ้น
    width: 335,
    height: 60,
    alignSelf: "center",
  },
  buttonText: {
    color: "#154127",
    fontFamily: "Kanit-SemiBold",
    fontSize: 18,
  },
  loginText: {
    marginTop: 20, // เดิม 110 → ลดให้ใกล้ปุ่ม
    textAlign: "center",
    color: "#07F469",
    fontFamily: "Kanit-SemiBold",
    fontSize: 12
  },
  titleinput: {
    color: "#07F469",
    left: 30,
    bottom: 8,
    fontSize: 13,
    fontFamily: "Kanit-SemiBold",
  },
 boxtextinput1: {
    marginTop: 30, // ใช้ margin แทน top เพื่อไม่ดันองค์ประกอบอื่น
  },
  boxtextinput2: {
    marginTop: 15,
  },
  boxtextinput3: {
    marginTop: 15,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#141414",
    alignSelf: "center",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#07F469",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});