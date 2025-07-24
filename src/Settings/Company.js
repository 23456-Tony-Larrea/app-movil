import React, { useContext, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Ionicons";
import { blueStrong, grey, redLife } from "../../constants/color";
import globalStyles from "../../global/style";
import styles from "./style";

const Company = () => {
  const { company, setCompany, setOrderState } = useContext(
    TransportOrderContext
  );
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState(company);
  const [items, setItems] = useState([
    { label: "LIFE", value: "li" },
    { label: "GENAMERICA", value: "ga" },
  ]);

  const fnSaveSetting = async () => {
    setOpenModal(!openModal);
    setOrderState("0");
    setCompany(value);
  };
  const fnOnChangeCompany = () => {
    if (value && value !== company) {
      setOpenModal(!openModal);
    }
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setValue(company);
          setOpenModal(!openModal);
        }}
      >
        <View style={globalStyles.modalMain}>
          <View
            style={[
              globalStyles.modalBox,
              {
                height: "27%",
              },
            ]}
          >
            <TouchableOpacity
              style={globalStyles.modalBtnExit}
              onPress={() => {
                setValue(company);
                setOpenModal(!openModal);
              }}
            >
              <Icon2 name="close" color={"grey"} size={30} />
            </TouchableOpacity>
            <View
              style={[
                globalStyles.modalMainView,
                {
                  marginTop: 40,
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: blueStrong,
                  paddingBottom: 0,
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                ¿Está seguro que desea cambiar de empresa?
              </Text>
            </View>
            <View style={[globalStyles.modalAccionBtn]}>
              <Icon.Button
                name=""
                backgroundColor={redLife}
                underlayColor="red"
                selectionColor="black"
                color={"white"}
                size={30}
                borderRadius={15}
                onPress={fnSaveSetting}
                style={{
                  justifyContent: "center",
                }}
              >
                Aceptar
              </Icon.Button>
            </View>
          </View>
        </View>
      </Modal>

      <View style={[styles.row]}>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Empresa</Text>
          <Text style={styles.text}>
            Configura la empresa para filtrar las órdenes de transporte
          </Text>
        </View>
        <View style={styles.column}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={fnOnChangeCompany}
            theme="LIGHT"
            multiple={false}
            mode="BADGE"
            style={{
              width: 130,
              backgroundColor: grey,
            }}
            labelStyle={{
              fontWeight: "bold",
              color: blueStrong,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Company;
