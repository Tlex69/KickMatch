import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import RoundCheckCircle from "../../components/icon/RoundCheckCircle";
export default function LoadingPaymentScreen({ navigation }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    rotateLoop.start();

    const timer = setTimeout(() => {
      rotateLoop.stop();
      setIsSuccess(true);
    }, 5000);

    return () => {
      rotateLoop.stop();
      clearTimeout(timer);
    };
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateReverse = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  if (!isSuccess) {
    return (
      <View style={[styles.container, { paddingHorizontal: 20 }]}>
        <View
          style={{
            marginBottom: 20,
            position: "relative",
            width: 70,
            height: 70,
            alignSelf: "center",
          }}
        >
          <Animated.View
            style={[styles.loaderLarge, { transform: [{ rotate }] }]}
          />
          <Animated.View
            style={[
              styles.loaderSmall,
              { transform: [{ rotate: rotateReverse }] },
            ]}
          />
        </View>

        <Text style={styles.loadingText}>กำลังตรวจสอบการชำระเงิน</Text>
        <Text style={styles.loadingSubText}>กรุณารอสักครู่...</Text>
                <Text style={styles.loadingSubText}>อย่าเปลี่ยนหน้าไปไหน</Text>

      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingHorizontal: 20 }]}>
      <RoundCheckCircle width={85} height={85} style={{ marginBottom: 20 }} />
      <Text style={styles.successText}>ชำระเงินสำเร็จ</Text>
      <Text style={styles.successSubText}>พร้อมลงสนาม!!</Text>
      <Text style={styles.successSubText}>คุณชำระเงินสำเร็จเรียบร้อยแล้ว</Text>

     

<TouchableOpacity
  style={styles.button2}
// จาก LoadingScreen
onPress={() => navigation.navigate("Home")}
>
  <Text style={styles.buttonText2}>กลับไปหน้าแรก</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderLarge: {
    position: "absolute",
    width: 70,
    height: 70,
    backgroundColor: "#07f469",
    borderRadius: 10,
  },
  loaderSmall: {
    position: "absolute",
    top: 17.5,
    left: 17.5,
    width: 35,
    height: 35,
    backgroundColor: "#b1ffd1",
    borderRadius: 6,
  },
  loadingText: {
    color: "#03C252",
    fontSize: 16,
    fontFamily: "Kanit-SemiBold",
    textAlign: "center",
  },
  loadingSubText: {
    color: "#ccc",
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Kanit-Regular",
    marginTop: 6,
  },
  successText: {
    fontSize: 16,
    color: "#03C252",
    fontFamily: "Kanit-SemiBold",
    marginBottom: 10,
    textAlign: "center",
  },
  successSubText: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 30,
    fontFamily: "Kanit-Regular",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#03C252",
    height: 50,
    width: 250,
    borderRadius: 25,
    alignItems: "center",
    marginTop:15
  },
  buttonText: {
    color: "#154127",
    fontSize: 17,
    fontFamily: "Kanit-SemiBold",
    marginTop: 10,
  },
  button2:{
     backgroundColor: "#07f469",
    height: 50,
    width: 250,
    borderRadius: 25,
    alignItems: "center",
    marginTop:15
  },
  buttonText2:{
     color: "#4f4f4f",
    fontSize: 17,
    fontFamily: "Kanit-SemiBold",
    marginTop: 10,
  }
});
