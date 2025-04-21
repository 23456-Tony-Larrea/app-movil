import React from "react";
import Icon from "react-native-vector-icons/Entypo";
import { TouchableOpacity, GestureResponderEvent } from "react-native";
import styles from "./style";
import { redLife } from "../../constants/color";

interface UploadBtnProps {
  onPress: (event: GestureResponderEvent) => void; // Función que se ejecuta al presionar el botón
}

const UploadBtn: React.FC<UploadBtnProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.btnUpload, { backgroundColor: "white" }]}
      onPress={onPress}
    >
      <Icon name="upload" color={redLife} size={35} />
    </TouchableOpacity>
  );
};

export default UploadBtn;