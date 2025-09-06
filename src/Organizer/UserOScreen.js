import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  MaterialIcons,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";

import { Edit } from "../../components/icon/Edit";
import { FootballPitch } from "../../components/icon/FootballPitch";
import { RoundSupportAgent } from "../../components/icon/RoundSupportAgent";

export default function UserOScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const plan = route.params?.plan || null;

  const user = {
    name: "สมชาย ใจดี",
    id: "ID: 12345678",
    avatar: "https://i.pravatar.cc/100",
  };

  const handleBackToUser = () => {
    // 🧠 ตัวอย่างเช่น กลับไปใช้ Navbar ปกติ
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const OptionItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.iconCircle}>{icon}</View>
      <Text style={styles.optionLabel}>{label}</Text>
      <Entypo
        name="chevron-right"
        size={20}
        color="#07F469"
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07F469" />

      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.userId}>{user.id}</Text>
        </View>
        <TouchableOpacity style={styles.logoutCircle}>
          <MaterialIcons name="logout" size={18} color="#07F469" />
        </TouchableOpacity>
      </View>

      {/* Box Content */}
      <View style={styles.box}>
        <View style={styles.section}>
          <Text style={styles.sectionText}>ทั่วไป</Text>

          <OptionItem
            label="แก้ไขโปรไฟล์"
            icon={<Edit name="edit" size={18} color="#07F469" />}
          />
          <OptionItem
            label="ประวัติการแข่งขัน"
            icon={<MaterialIcons name="history" size={20} color="#07F469" />}
          />
          <OptionItem
            label="รายการที่ชอบ"
            icon={<AntDesign name="heart" size={20} color="#07F469" />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionText}>ฝ่ายจัด</Text>

          <OptionItem
            label="ผู้ช่วยในการแข่งขัน"
            icon={<RoundSupportAgent size={20} color="#07F469" />}
            onPress={() => navigation.navigate("ManagerO")}
          />
          <OptionItem
              label="เปลี่ยนเป็นผู้ใช้ทั่วไป"
              icon={<FootballPitch size={18} color="#07F469" />}
              onPress={() => navigation.navigate("Home")}
            />
          
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 70,
    width: "90%",
    justifyContent: "space-between",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#154127",
    marginLeft: 10,
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    color: "#07F469",
    fontSize: 14,
    fontFamily: "Kanit-SemiBold",
  },
  userId: {
    color: "#138140",
    fontSize: 11,
    marginTop: 2,
    fontFamily: "Kanit-Regular",
  },
  logoutCircle: {
    width: 30,
    height: 30,
    borderRadius: 18,
    backgroundColor: "#154127",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  box: {
    backgroundColor: "#141414",
    width: "101%",
    height: "80%",
    borderRadius: 30,
    marginTop: 30,
    padding: 20,
  },
  section: {
    marginTop: 10,
    marginBottom: 25,
  },
  sectionLabel: {
    backgroundColor: "#202020",
    alignSelf: "flex-start",
    width: 55,
    height: 25,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  sectionText: {
    fontFamily: "Kanit-SemiBold",
    fontSize: 12,
    color: "#07F469",
    marginTop: 2,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#07F46920",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: "#07F469",
    fontFamily: "Kanit-Regular",
  },
  chevron: {
    marginLeft: 5,
  },
});
