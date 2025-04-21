import React, { memo } from "react";
import { Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import styles from "./style";
import { subTitleSize } from "../../constants/text";

interface DeliverOrderBtnProps {
  onPress: (event: GestureResponderEvent) => void; // Función que se ejecuta al presionar el botón
  textBtn: string; // Texto que se muestra en el botón
  color: string; // Color de fondo del botón
}

const DeliverOrderBtn: React.FC<DeliverOrderBtnProps> = ({ onPress, textBtn, color }) => {
  return (
    <TouchableOpacity
      style={[
        styles.btnDeliverOrder,
        {
          backgroundColor: color,
        },
      ]}
      onPress={onPress}
    >
      <Text style={{ color: "white", fontSize: subTitleSize + 1 }}>
        {textBtn}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(DeliverOrderBtn);