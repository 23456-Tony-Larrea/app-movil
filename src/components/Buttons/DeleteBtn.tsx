import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity, GestureResponderEvent } from "react-native";
import styles from "./style";
import { redLife } from "../../constants/color";

interface DeleteBtnProps {
  onPress: (event: GestureResponderEvent) => void; // Función que se ejecuta al presionar el botón
}

const DeleteBtn: React.FC<DeleteBtnProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.btnUpload, { backgroundColor: "white" }]}
      onPress={onPress}
    >
      <Icon name="delete" color={redLife} size={35} />
    </TouchableOpacity>
  );
};

export default DeleteBtn;