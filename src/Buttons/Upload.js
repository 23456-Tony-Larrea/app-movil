import React from "react";
import Icon from "react-native-vector-icons/Entypo";
import { TouchableOpacity } from "react-native";
import styles from "./style";
import { redLife } from "../../constants/color";

const UploadBtn = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.btnUpload, { backgroundColor: "white" }]}
      onPress={() => onPress()}
    >
      <Icon name="upload" color={redLife} size={35} />
    </TouchableOpacity>
  );
};

export default UploadBtn;
