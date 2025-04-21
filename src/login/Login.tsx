import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { redLife } from "../constants/color";
import { subTitleSize } from "../constants/text";
import { MainStackParamList } from "../navigation/MainStackParamList";

export default function Login() {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const handleSignInPress = () => {
    navigation.navigate("Root");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "60%",
          height: "70%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image source={require("../../assets/images/Life-icon.jpg")} />
      </View>
      <TouchableOpacity
        style={[styles.btnDeliverOrder]}
        onPress={handleSignInPress}
      >
        <Text style={{ color: "white", fontSize: subTitleSize + 1 }}>
          Ingresar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDeliverOrder: {
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: redLife,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "7%",
  },
});