import React, { memo } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { Text, TouchableOpacity } from "react-native";
import styles from "./style";
import { subTitleSize } from "../../constants/text";

const DeliverOrderBtn = ({ onPress, textBtn, color }) => {
  return (
    <TouchableOpacity
      style={[
        styles.btnDeliverOrder,
        {
          backgroundColor: color,
        },
      ]}
      onPress={() => onPress()}
    >
      <Text style={{ color: "white", fontSize: subTitleSize + 1 }}>
        {textBtn}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(DeliverOrderBtn);
