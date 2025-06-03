import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";
import styles from "./style";
import { redLife } from "../../constants/color";

const DeleteBtn = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.btnUpload, { backgroundColor: "white" }]}
      onPress={() => onPress()}
    >
      <Icon name="delete" color={redLife} size={35} />
    </TouchableOpacity>
  );
};

export default DeleteBtn;
