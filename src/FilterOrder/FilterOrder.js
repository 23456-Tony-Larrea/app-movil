import React, { useContext, useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Ionicons";
import { blueStrong, grey, redLife } from "../../constants/color";
import DropDownPicker from "react-native-dropdown-picker";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import { numTransportOrders } from "../../constants/config";
import globalStyles from "../../global/style";

const ModalFilterOrder = ({
  openFilter,
  setOpenFilter,
  setStartPosition,
  setallowUpload,
  setdataList,
}) => {
  const {
    orderStates,
    orderState,
    setOrderState,
    setloading,
    getTransportOrders,
  } = useContext(TransportOrderContext);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const fnFilterOrder = async () => {
    if (value && value !== orderState) {
      setdataList([]);
      await setloading(true);
      setOpenFilter(!openFilter);
      await setOrderState(value);
      await getTransportOrders(value, 1, numTransportOrders);
      setallowUpload(true);
      setStartPosition(numTransportOrders + 1);
    } else if (!value) {
      Alert.alert("Instrucciones", "Seleccione una opción.", [
        {
          text: "Aceptar",
          onPress: () => console.log("OK Pressed"),
        },
      ]);
    } else {
      setOpenFilter(!openFilter);
    }
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={openFilter}
        onRequestClose={() => {
          setOpenFilter(!openFilter);
        }}
      >
        <View style={globalStyles.modalMain}>
          <View style={globalStyles.modalBox}>
            <TouchableOpacity
              style={globalStyles.modalBtnExit}
              onPress={() => setOpenFilter(!openFilter)}
            >
              <Icon2 name="close" color={"grey"} size={30} />
            </TouchableOpacity>

            <View style={globalStyles.modalMainView}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: blueStrong,
                  paddingBottom: 10,
                }}
              >
                Estado:
              </Text>
              <DropDownPicker
                language="ES"
                open={open}
                value={value}
                items={orderStates}
                setOpen={setOpen}
                setValue={setValue}
                theme="LIGHT"
                multiple={false}
                mode="BADGE"
                style={{
                  backgroundColor: grey,
                  borderColor: "grey",
                }}
                labelStyle={{
                  color: blueStrong,
                }}
              />
            </View>
            <View style={globalStyles.modalAccionBtn}>
              <Icon.Button
                name="filter"
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
                Filtrar
              </Icon.Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalFilterOrder;
