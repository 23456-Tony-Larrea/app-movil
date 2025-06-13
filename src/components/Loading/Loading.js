import React from "react";
import { ActivityIndicator, View, Modal } from "react-native";
import { redLife } from "../../constants/color";

const Loading = ({ loading, opacity, sizeIcon }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={loading}>
      <View
        backgroundColor={
          opacity ? "rgba(0,0,0," + opacity + ")" : "rgba(0,0,0,0.15)"
        }
        style={{
          justifyContent: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator size={sizeIcon ? sizeIcon : 40} color={redLife} />
      </View>
    </Modal>
  );
};

export default Loading;
