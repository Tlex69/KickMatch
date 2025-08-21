import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import { Edit } from "../../components/icon/Edit";
import { FootballPitch } from "../../components/icon/FootballPitch";
import { RoundSupportAgent } from "../../components/icon/RoundSupportAgent";
import { getAuth, signOut } from "firebase/auth";

export default function UserScreen() {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  // Logout function
  const handleLogout = () => {
    signOut(auth)
      .then(() => navigation.replace("Login"))
      .catch((error) => console.log("Logout error:", error));
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

      <View style={styles.header}>
        <Image
          source={{ uri: user?.photoURL || "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.displayName || "ผู้ใช้"}</Text>
          <Text style={styles.userId}>UID: {user?.uid}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutCircle}>
          <MaterialIcons name="logout" size={18} color="#07F469" />
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionText}>ทั่วไป</Text>
          </View>

          <OptionItem
            label="แก้ไขโปรไฟล์"
            icon={<Edit name="edit" size={18} color="#07F469" />}
            onPress={() => {}}
          />
          <OptionItem
            label="ประวัติการแข่งขัน"
            icon={<MaterialIcons name="history" size={20} color="#07F469" />}
            onPress={() => navigation.navigate("History")}
          />
          <OptionItem
            label="รายการที่ชอบ"
            icon={<AntDesign name="heart" size={20} color="#07F469" />}
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionText}>ฝ่ายจัด</Text>
          </View>

          <OptionItem
            label="จัดการแข่งขัน"
            icon={<FootballPitch name="chalkboard-teacher" size={18} color="#07F469" />}
            onPress={() =>
               navigation.navigate("HomeO", { userId: auth.currentUser.uid })

            }
          />
          <OptionItem
            label="ผู้ช่วยในการแข่งขัน"
            icon={<RoundSupportAgent size={20} color="#07F469" />}
            onPress={() => navigation.navigate("ManagerO")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", alignItems: "center" },
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
  userInfo: { flex: 1, marginLeft: 15 },
  name: { color: "#07F469", fontSize: 14, fontFamily: "Kanit-SemiBold" },
  userId: { color: "#138140", fontSize: 11, marginTop: 2, fontFamily: "Kanit-Regular" },
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
  section: { marginTop: 10, marginBottom: 25 },
  sectionLabel: {
    backgroundColor: "#202020",
    alignSelf: "flex-start",
    width: 55,
    height: 25,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  sectionText: { fontFamily: "Kanit-SemiBold", fontSize: 12, color: "#07F469", marginTop: 2 },
  optionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  iconCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#07F46920",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionLabel: { flex: 1, fontSize: 14, color: "#07F469", fontFamily: "Kanit-Regular" },
  chevron: { marginLeft: 5 },
});
