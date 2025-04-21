import React from "react";
import { View, Modal, StyleSheet } from "react-native";
import { redLife } from "../../constants/color";
import Icon from "react-native-vector-icons/AntDesign";

interface SuccessProps {
  success: boolean;
  opacity?: number; // Opcional, ya que puede no estar definido
}

const Success: React.FC<SuccessProps> = ({ success, opacity }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={success}>
      <View
        style={[
          styles.container,
          { backgroundColor: opacity ? `rgba(0,0,0,${opacity})` : "rgba(0,0,0,0.4)" },
        ]}
      >
        <Icon
          name="checkcircle"
          color={"white"}
          size={80}
          style={styles.icon}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
  },
  icon: {
    elevation: 50,
    borderColor: redLife,
    borderRadius: 100,
    backgroundColor: redLife,
  },
});

export default Success;