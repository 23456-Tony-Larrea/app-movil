import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { redStrong, redLife } from "../../constants/color";
import styles from "./style";
import Company from "../../components/Settings/Company";

const Settings = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          backgroundColor: redLife,
          padding: 24,
          borderRadius: 20,
          alignItems: "center",
          shadowColor: redStrong,
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
          width: "90%",
        }}
      >
        <Icon name="settings" size={48} color={redStrong} style={{ marginBottom: 12 }} />
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Configuración</Text>
        <Company />
      </View>
    </View>
  );
};

export default Settings;
