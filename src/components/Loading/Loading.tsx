import React from "react";
import { ActivityIndicator, View, Modal } from "react-native";
import { redLife } from "../../constants/color";

interface LoadingProps {
  loading: boolean;
  opacity?: number;
  sizeIcon?: number | "small" | "large";
}

const Loading: React.FC<LoadingProps> = ({ loading, opacity, sizeIcon }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={loading}>
      <View
        style={{
          backgroundColor: opacity
            ? `rgba(0,0,0,${opacity})`
            : "rgba(0,0,0,0.15)",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator size={sizeIcon || 40} color={redLife} />
      </View>
    </Modal>
  );
};

export default Loading;