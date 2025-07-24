import React, { useContext, useState } from "react";
import {
  Alert,
  Modal,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Ionicons";
import { blueStrong, grey, redLife } from "../../constants/color";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import globalStyles from "../../global/style";
import styles from "./style";

const ModalDeliverOrder = ({ openModal, setOpenModal }) => {
  const {
    // orderStates,
    // orderState,
    // setOrderState,
    // setloading,
    // getTransportOrders,
  } = useContext(TransportOrderContext);
  const [comment, setcomment] = useState("Ingresa un comentario");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const fnFilterOrder = async () => {
    // if (value && value !== orderState) {
    //   setOpenModal(!openModal);
    // } else if (!value) {
    //   Alert.alert("Instrucciones", "Seleccione una opción.", [
    //     {
    //       text: "Aceptar",
    //       onPress: () => console.log("OK Pressed"),
    //     },
    //   ]);
    // } else {
    //   setOpenModal(!openModal);
    // }
    console.log("cerrado");
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setOpenModal(!openModal);
        }}
      >
        <View style={globalStyles.modalMain}>
          <View style={globalStyles.modalBox}>
            <TouchableOpacity
              style={globalStyles.modalBtnExit}
              onPress={() => setOpenModal(!openModal)}
            >
              <Icon2 name="close" color={"grey"} size={30} />
            </TouchableOpacity>

            <View style={globalStyles.modalMainView}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: blueStrong,
                  paddingBottom: 10,
                  textAlign: "center",
                  fontSize: 17,
                }}
              >
                Entregar orden
              </Text>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: blueStrong,
                      paddingBottom: 10,
                      fontSize: 15,
                    }}
                  >
                    Marcar incumplimiento
                  </Text>
                </View>
                <View style={styles.column}>
                  <Switch
                    trackColor={{ false: "grey", true: redLife }}
                    thumbColor={isEnabled ? redLife : grey}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>
              </View>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                maxLength={40}
                onChangeText={(text) => setcomment(text)}
                value={comment}
                style={{ padding: 10 }}
              />
            </View>
            <View style={globalStyles.modalAccionBtn}>
              <Icon.Button
                name=""
                backgroundColor={redLife}
                underlayColor="red"
                selectionColor="black"
                color={"white"}
                size={25}
                borderRadius={15}
                onPress={() => fnFilterOrder()}
                style={{
                  padding: 10,
                  justifyContent: "center",
                }}
              >
                Aceptar
              </Icon.Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalDeliverOrder;
