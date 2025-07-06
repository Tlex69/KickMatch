import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    Alert.alert("เข้าสู่ระบบสำเร็จ", `อีเมล: ${email}`);
    navigation.replace("Home");
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
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>สมัครบัญชี</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>กลับไปหน้าเข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
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
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "white",
    width: 335,
    fontFamily: "Kanit-SemiBold",
  },
  button: {
    backgroundColor: "#07F469",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: 335,
    height: 60,
    alignSelf: "center",
    top: 60,
  },
  buttonText: {
    color: "#154127",
    fontFamily: "Kanit-SemiBold",
    fontSize: 18,
  },
  loginText: {
    marginTop: 110,
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
    top: 30,
  },
  boxtextinput2: {
    top: 40,
  },
  boxtextinput3: {
    top: 50,
  },
});
