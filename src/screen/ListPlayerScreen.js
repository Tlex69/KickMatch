import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { FormLine } from "../../components/icon/FormLine";

export default function ListPlayerScreen() {
  const navigation = useNavigation();

  const staffCoaches = [
    {
      name: "โค้ชบอย",
      image:
        "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-560w,f_auto,q_auto:best/rockcms/2024-01/240126-klopp-mb-135-d86a1f.jpg",
    },
    {
      name: "โค้ชกอล์ฟ",
      image:
        "https://static.independent.co.uk/2025/02/22/17/ALEMANIA_BUNDESLIGA_47784.jpg",
    },
    {
      name: "โค้ชกอล์ฟ",
      image:
        "https://assets.goal.com/images/v3/blt8cb811763ffb2564/5af5ea90680221c2c05f83ea903895f127c456f6.jpg?auto=webp&format=pjpg&width=3840&quality=60",
    },
  ];

  // เพิ่ม number สำหรับแสดงบนรูป
  const players = [
    { number: 10, name: "ก้อง", image: "https://i2-prod.mirror.co.uk/incoming/article35382672.ece/ALTERNATES/s615/0_Real-Madrid-Unveil-New-Signing-Trent-Alexander-Arnold.jpg" },
    { number: 7, name: "อาร์ต", image: "https://images2.thanhnien.vn/528068263637045248/2024/6/3/jude-bellingham-17173866576851437191009.png" },
    { number: 9, name: "แบงค์", image: "https://res.cloudinary.com/supportersplace/image/upload/w_400,fl_lossy,f_auto,fl_progressive/files_lfc_nu/players/Szoboszlai-Sobo-aug24.jpg" },
    { number: 5, name: "ฟลุ๊ค", image: "https://static.independent.co.uk/2022/05/12/10/newFile-14.jpg" },
    { number: 4, name: "เอก", image: "https://i.pinimg.com/1200x/c7/e7/6c/c7e76cfb9848ecf9e076708ec311f582.jpg" },
    { number: 8, name: "กาย", image: "https://i.redd.it/7sogcvoljwcb1.jpg" },
    { number: 11, name: "บอส", image: "https://icdn.sempreinter.com/wp-content/uploads/2025/05/arsenal-fc-v-paris-saint-germain-uefa-champions-league-2024-25-semi-final-first-leg.jpg" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#07F469" barStyle="light-content" />

      <LinearGradient
        colors={["#14141400", "#03C252"]}
        style={styles.headerBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <MaterialIcons
            name="arrow-back-ios"
            size={22}
            color="#fff"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.textBox}>
            <Text style={styles.titleText}>ลงชื่อนักเตะ</Text>
            <Text style={styles.subTitleText}>อาทิ7ชาลเลนจ์คัพ2024</Text>
          </View>
          <FormLine size={50} color="#fff" />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>สตาฟโค้ช</Text>
        <View style={styles.staffContainer}>
          {staffCoaches.map((coach, index) => (
            <View key={index} style={styles.staffBox}>
              <Image source={{ uri: coach.image }} style={styles.staffImage} />
              <View style={styles.nameBox}>
                <Text style={styles.staffName}>{coach.name}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.label}>รายชื่อนักเตะ</Text>
        <View style={styles.staffContainer}>
          {players.map((player, index) => (
            <View key={index} style={styles.staffBox}>
              <View style={{ position: "relative" }}>
                <Image source={{ uri: player.image }} style={styles.staffImage} />
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{player.number}</Text>
                </View>
              </View>
              <View style={styles.nameBox}>
                <Text style={styles.staffName}>{player.name}</Text>
              </View>
            </View>
          ))}
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
  scrollContent: {
    paddingBottom: 50,
  },
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
    marginBottom: 8,
    fontFamily: "Kanit-SemiBold",
  },
  staffContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  staffBox: {
    width: "30%",
    alignItems: "center",
    marginBottom: 15,
  },
  staffImage: {
    width: 105,
    height: 130,
    borderWidth: 1,
    borderColor: "#07F469",
    borderRadius: 15,
    backgroundColor: "#333",
  },
  nameBox: {
    width: 105,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#07F469",
    borderRadius: 8,
    paddingVertical: 3,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  staffName: {
    color: "#141414",
    fontFamily: "Kanit-SemiBold",
    fontSize: 12,
    textAlign: "center",
  },
  numberBadge: {
    position: "absolute",
    right: 2,
    width: 40,
    height: 50,
    alignItems: "center",
    marginTop: -5,
    justifyContent: "center",
  },
  numberText: {
    color: "#07F469",
    fontFamily: "MuseoModerno-SemiBold",
    fontSize: 25,
  },
});
