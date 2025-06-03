import React from "react";
import { View, Modal } from "react-native";
import { redLife } from "../../constants/color";
import Icon from "react-native-vector-icons/AntDesign";

const Success = ({ success, opacity }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={success}>
      <View
        backgroundColor={
          opacity ? "rgba(0,0,0," + opacity + ")" : "rgba(0,0,0,0.4)"
        }
        style={{
          justifyContent: "center",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Icon
          name="checkcircle"
          color={"white"}
          size={80}
          style={{
            elevation: 50,
            borderColor: redLife,
            // borderWidth: 1,
            borderRadius: 100,
            backgroundColor: redLife,
          }}
        />
      </View>
    </Modal>
  );
};

export default Success;
