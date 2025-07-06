import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function DetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { name = "อาทิ7ชาลเลนจ์คัพ2024", imageUri } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />

      <View style={styles.imageContainer}>
        <Image
          source={imageUri ? { uri: imageUri } : require("../../assets/f1.jpg")}
          style={styles.image}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonCircle}>
            <Ionicons name="arrow-back" size={24} color="#07F469" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.titleText}>{name}</Text>
        <View style={styles.boxsub}>
          <Text style={styles.subtitle}>รายละเอียด</Text>
        </View>
        <View style={styles.boxdetail}>
          <Text style={styles.subdetail}>
            ประเภทการแข่งขัน :{" "}
            <Text style={styles.subsubdetail}>ฟุตบอล 7 คน , บอลถ้วย</Text>
          </Text>
          <Text style={styles.subdetail}>
            ประเภทผู้เล่น : <Text style={styles.subsubdetail}>ประชาชน</Text>
          </Text>
          <Text style={styles.subdetail}>
            จำนวนทีมที่รับสมัคร :{" "}
            <Text style={styles.subsubdetail}>36 ทีม</Text>
          </Text>
          <Text style={styles.subdetail}>
            ค่าสมัครต่อทีม : <Text style={styles.subsubdetail}>10,000 บาท</Text>
          </Text>
        </View>
        <View style={styles.boxreward}>
          <Text style={styles.subreward}>ประเภทการแข่งขัน : </Text>
          <Text style={styles.subsubreward}>
            ที่ 1 รับ เงินรางวัล 200,000 บาท + ถ้วยรางวัล
          </Text>
          <Text style={styles.subsubreward}>
            ที่ 2 รับ เงินรางวัล 50,000 บาท + ถ้วยรางวัล
          </Text>
          <Text style={styles.subsubreward}>
            ที่ 3 รับ เงินรางวัล 10,000 บาท + ถ้วยรางวัล
          </Text>
        </View>
        <View style={styles.boxrules}>
          <Text style={styles.subrules}>
            กฎกติกา : <Text style={styles.subsubrules}>กดเพื่อดู</Text>
          </Text>

          <View style={styles.boxother}>
            <Text style={styles.subother}>
              สถานที่จัดแข่งขัน :{" "}
              <Text style={styles.subsubother}>จังหวัดกรุงเทพมหานคร</Text>
            </Text>
            <Text style={styles.subother}>
              หมดเขตสมัคร : <Text style={styles.subsubother}>10 ก.ค. 2568</Text>
            </Text>
            <Text style={styles.subother}>
              ติดต่อ/สอบถาม : <Text style={styles.subsubother}>0994672794</Text>
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.registerButtonFixed}
          onPress={() => {
            console.log("สมัครเลย");
          }}
        >
          <Text style={styles.registerButtonText}>สมัครแข่ง</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  imageContainer: {
    width: "100%",
    height: 320,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 15,
  },
  backButtonCircle: {
    backgroundColor: "#154127",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  detailContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleText: {
    color: "#07F469",
    fontSize: 18,
    fontFamily: "Kanit-SemiBold",
  },
  boxsub: {
    width: 90,
    height: 28,
    backgroundColor: "#202020",
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  subtitle: {
    fontFamily: "Kanit-SemiBold",
    fontSize: 13,
    color: "#07F469",
    marginTop: 2,
  },
  boxdetail: {
    marginTop: 5,
  },
  subdetail: {
    fontFamily: "Kanit-Regular",
    fontSize: 14,
    color: "#07F469",
    paddingTop: 15,
  },
  subsubdetail: {
    color: "#fff",
  },
  boxreward: {
    marginTop: 25,
  },
  subreward: {
    fontFamily: "Kanit-Regular",
    color: "#07F469",
  },
  subsubreward: {
    fontFamily: "Kanit-Regular",
    color: "#fff",
    marginTop: 5,
  },
  boxrules: {
    marginTop: 25,
  },
  subrules: {
    fontFamily: "Kanit-Regular",
    color: "#07F469",
    fontSize: 14,
  },
  subsubrules: {
    color: "#fff",
  },
  boxother: {
    marginTop: 25,
    marginBottom: 140,
  },
  subother: {
    fontFamily: "Kanit-Regular",
    color: "#07F469",
    paddingTop: 15,
  },
  subsubother: {
    color: "#fff",
  },
  registerButtonFixed: {
  position: 'absolute',
  bottom: 50,
  alignSelf: 'center',
  width: 350,
  height: 50,
  backgroundColor: '#07F469',
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
},
registerButtonText: {
  color: '#154127',
  fontSize: 17,
  fontFamily: 'Kanit-SemiBold',
},

});
