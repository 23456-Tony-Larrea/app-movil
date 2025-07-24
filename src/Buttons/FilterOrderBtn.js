import React from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import styles from "./style";

const BtnFilterOrder = ({ fnEnableFilter }) => {
  return (
    <TouchableOpacity
      style={styles.btnFilterOrder}
      onPress={() => fnEnableFilter()}
    >
      <Icon name="search1" color={"white"} size={25} />
    </TouchableOpacity>
  );
};

export default BtnFilterOrder;
