import React, { useContext, useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleProp, ViewStyle, TextStyle } from "react-native";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Ionicons";
import { blueStrong, grey, redLife } from "../../constants/color";
import globalStyles from "../../global/style";
import styles from "./style";

const Company: React.FC = () => {
  const context = useContext(TransportOrderContext);

  if (!context) {
    throw new Error("TransportOrderContext must be used within a TransportOrderProvider");
  }

  const { company, setCompany, setOrderState } = context;
  const [open, setOpen] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [value, setValue] = useState<string>(company);
  const [items, setItems] = useState<ItemType<string>[]>([
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
      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setValue(company);
          setOpenModal(!openModal);
        }}
      >
        <View style={globalStyles.modalMain as StyleProp<ViewStyle>}>
          <View
            style={[
              globalStyles.modalBox as StyleProp<ViewStyle>,
              {
                height: "27%",
              },
            ]}
          >
            <TouchableOpacity
              style={globalStyles.modalBtnExit as StyleProp<ViewStyle>}
              onPress={() => {
                setValue(company);
                setOpenModal(!openModal);
              }}
            >
              <Icon2 name="close" color={"grey"} size={30} />
            </TouchableOpacity>
            <View
              style={[
                globalStyles.modalMainView as StyleProp<ViewStyle>,
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
                } as StyleProp<TextStyle>}
              >
                ¿Está seguro que desea cambiar de empresa?
              </Text>
            </View>
            <View style={globalStyles.modalAccionBtn as StyleProp<ViewStyle>}>
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

      {/* Dropdown */}
      <View style={[styles.row as StyleProp<ViewStyle>]}>
        <View style={styles.column as StyleProp<ViewStyle>}>
          <Text style={styles.subTitle as StyleProp<TextStyle>}>Empresa</Text>
          <Text style={styles.text as StyleProp<TextStyle>}>
            Configura la empresa para filtrar las órdenes de transporte
          </Text>
        </View>
        <View style={styles.column as StyleProp<ViewStyle>}>
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