import React, { useContext, useState } from "react";
import { Modal, TouchableOpacity, View, Alert } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Icon2 from "react-native-vector-icons/Ionicons";
import { redLife } from "../../constants/color";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import globalStyles from "../../global/style";
import * as ImagePicker from "expo-image-picker";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import Loading from "../Loading/Loading";
import { extFile, tableIdDocuments } from "../../constants/config";

interface ModalChooseFileProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  document: {
    documentName: string;
    recId: string;
  };
}

const ModalChooseFile: React.FC<ModalChooseFileProps> = ({
  open,
  setOpen,
  document,
}) => {
  // Obtén el contexto y verifica que no sea undefined
  const context = useContext(OrderLineContext);
  if (!context) {
    throw new Error("OrderLineContext must be used within a provider");
  }
  const companyContext = useContext(TransportOrderContext);
  if (!companyContext) {
    throw new Error("TransportOrderContext must be used within a provider");
  }

  const { orderLines, setUpdate, postNewSPDocumentation, postAXDocumentation } =
    context;
    
    const { company } = companyContext;
    
    const [loading, setloading] = useState<boolean>(false);

  const fnUploadFile = async (uri: string): Promise<boolean> => {
    try {
      const dataForm = new FormData();
      dataForm.append("file", {
        uri: uri,
        type: "image/jpeg",
        name: "pruebas2.jpg",
      } as any); // `as any` es necesario debido a las limitaciones de TypeScript con FormData en React Native
      dataForm.append(
        "nombreArchivo",
        document.documentName.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      );
      dataForm.append("nombreCarpeta", "Desarrollo2");
      dataForm.append("nombreCarpeta2", orderLines[0].liPackingSlipId);
      dataForm.append("extArchivo", extFile);

      const url = await postNewSPDocumentation(dataForm);
      if (url) {
        const dataAX = {
          recIdRecord: document.recId,
          tableId: tableIdDocuments,
          url: url,
          extArchivo: extFile,
          nombreArchivo: document.documentName
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
        };
        const resp2 = await postAXDocumentation(dataAX, company);
        return resp2 !== 0;
      }
      return false;
    } catch (error) {
      Alert.alert("Error", String(error));
      return false;
    }
  };

  const fnOpenCamera = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permiso denegado", "Ha rechazado el acceso a la cámara.");
        return;
      }
      setloading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
      });

      if (!result.canceled) {
        const resp = await fnUploadFile(result.assets[0].uri);
        if (!resp) {
          Alert.alert("Error", "Error al cargar la información.");
        } else {
          setUpdate(true);
        }
      }
      setloading(false);
      setOpen(!open);
    } catch (error) {
      setOpen(!open);
      Alert.alert("Error", String(error));
    }
  };

  const fnPickPhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permiso denegado", "Ha rechazado el acceso a la galería.");
        return;
      }
      setloading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        base64: true,
      });
      if (!result.canceled) {
        const resp = await fnUploadFile(result.assets[0].uri);
        if (!resp) {
          Alert.alert("Error", "Error al cargar la información.");
        } else {
          setUpdate(true);
        }
      }
      setloading(false);
      setOpen(!open);
    } catch (error) {
      setOpen(!open);
      Alert.alert("Error", String(error));
    }
  };

  return (
    <View>
      <Loading loading={loading} />
      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={() => {
          setOpen(!open);
        }}
      >
        <View style={globalStyles.modalMain}>
          <View style={[globalStyles.modalBox]}>
            <TouchableOpacity
              style={globalStyles.modalBtnExit}
              onPress={() => setOpen(!open)}
            >
              <Icon2 name="close" color={"grey"} size={30} />
            </TouchableOpacity>
            <View
              style={[
                globalStyles.modalMainView,
                {
                  backgroundColor: "#D8D8D8",
                  marginTop: 40,
                },
              ]}
            >
              <View style={{ marginTop: 10, marginBottom: 10 }}>
                <Icon.Button
                  name="camera"
                  backgroundColor={"white"}
                  underlayColor="red"
                  selectionColor="black"
                  color={redLife}
                  size={30}
                  borderRadius={15}
                  onPress={() => fnOpenCamera()}
                  style={{
                    padding: 10,
                    justifyContent: "center",
                  }}
                >
                  Tomar foto
                </Icon.Button>
              </View>
              <View style={{ marginTop: 10, marginBottom: 10 }}>
                <Icon.Button
                  name="folder-images"
                  backgroundColor={"white"}
                  underlayColor="red"
                  selectionColor="black"
                  color={redLife}
                  size={30}
                  borderRadius={15}
                  onPress={() => fnPickPhoto()}
                  style={{
                    padding: 10,
                    justifyContent: "center",
                  }}
                >
                  Cargar foto
                </Icon.Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalChooseFile;