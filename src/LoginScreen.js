import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // ดึง auth จาก firebase.js

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("เข้าสู่ระบบสำเร็จ", `ยินดีต้อนรับ: ${email}`);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title1}>
          Login <Text style={styles.title2}>here</Text>
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

        <Text style={styles.forgot}>ลืมรหัสผ่าน?</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>ยังไม่มีบัญชี? สมัครสมาชิก</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles เดิมของคุณ (คงไว้)
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
    fontSize: 28,
    fontFamily: 'MuseoModerno-Bold',
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    top: 40
  },
  title2: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#07F469",
  },
  input: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: "white",
    width: 335,
    height: 55,
    fontSize: 15,
    fontFamily : 'Kanit-Regular'
  },
  button: {
    backgroundColor: "#07F469",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 120,
    width: 335,
    height: 55,
    alignSelf: "center",
  },
  buttonText: {
    color: "#154127",
    fontFamily: 'Kanit-SemiBold',
    fontSize: 17,
    marginBottom: -2,
  },
  registerText: {
    marginTop: 30, 
    textAlign: "center",
    color: "#07F469",
    fontFamily:'Kanit-SemiBold',
    fontSize: 12,
  },
  titleinput: {
    color: "#07F469",
    left: 30,
    bottom: 8,
    fontSize: 12,
    fontFamily:'Kanit-SemiBold'
  },
  boxtextinput1:{
    top: 70
  },
  boxtextinput2:{
    top: 80
  },
  forgot: {
    top: 80,
    left: 285,
    fontSize: 12,
    color: '#07F469',
    fontFamily:'Kanit-SemiBold'
  }
});
