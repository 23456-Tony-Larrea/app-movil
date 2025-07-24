import React, { useContext, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Icon2 from "react-native-vector-icons/Ionicons";
import { redLife } from "../../constants/color";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import globalStyles from "../../global/style";
import * as ImagePicker from "expo-image-picker";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import Loading from "../Loading/Loading";
import { extFile, tableIdDocuments } from "../../constants/config";
import * as ImageManipulator from 'expo-image-manipulator';

const ModalChooseFile = ({ open, setOpen, document }) => {
  const { orderLines, setUpdate, postNewSPDocumentation, postAXDocumentation } =
    useContext(OrderLineContext);
  const { company, vendorRuc } = useContext(TransportOrderContext);
  const [loading, setloading] = useState(false);

  const fnUploadFile = async (uri, base64Data = null) => {
    try {
      if (!document) {
        alert("Error: No se encontró información del documento");
        return false;
      }

      if (!document.documentName) {
        alert("Error: El documento no tiene nombre");
        return false;
      }

      if (!orderLines || orderLines.length === 0) {
        alert("Error: No hay órdenes de línea disponibles");
        return false;
      }

      if (!orderLines[0].liPackingSlipId) {
        alert("Error: ID de packing slip no encontrado");
        return false;
      }

      const normalizedFileName = document.documentName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      let finalBase64 = base64Data;
      if (!finalBase64) {
        alert("Error: Se necesita la imagen en formato base64");
        return false;
      }

      const attachmentObject = {
        base64: finalBase64,
        nombreArchivo: normalizedFileName,
        nombreCarpeta: "Desarrollo2",
        nombreCarpeta2: orderLines[0].liPackingSlipId,
        vendAccount: vendorRuc || "",
        url: "", 
        recIdRecord: parseInt(document.recId), 
        tableId: parseInt(tableIdDocuments), 
        extArchivo: extFile
      };

      const dataJSON = [attachmentObject];
      
      const url = await postNewSPDocumentation(dataJSON);

      if (url !== null && url !== undefined && url !== "") {
        const dataAX = [{
          base64: "", 
          nombreArchivo: normalizedFileName,
          nombreCarpeta: "Desarrollo2",
          nombreCarpeta2: orderLines[0].liPackingSlipId,
          vendAccount: vendorRuc || "",
          url: url,
          recIdRecord: parseInt(document.recId),
          tableId: parseInt(tableIdDocuments),
          extArchivo: extFile
        }];
        
        const resp2 = await postAXDocumentation(dataAX, company);
        
        if (resp2 !== 0) {
          return true;
        } else {
          alert("Error: No se pudo guardar la documentación en AX");
          return false;
        }
      } else {
        alert("Error: No se pudo subir el archivo al servidor");
        return false;
      }
    } catch (error) {
      alert(`Error al cargar la información: ${error.message || error}`);
      return false;
    }
  };

  const fnOpenCamera = async () => {
  let base64Length = 0;
  try {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Ha rechazado el acceso a la cámara del dispositivo!");
      return;
    }
    setloading(true);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      base64: false, // No pidas base64 aquí, lo generas después
    });

    if (!result.canceled) {
      // Manipula la imagen (redimensiona y comprime)
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }], // Cambia el ancho a 800px, ajusta según tu necesidad
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      const resp = await fnUploadFile(manipResult.uri, manipResult.base64);

      if (!resp) {
        alert("Error al cargar la información desde la cámara modalllll.");
      } else {
        setUpdate(true);
      }
    }
    setloading(false);
    setOpen(!open);
  } catch (error) {
    setOpen(!open);
    setloading(false);
    alert(`Error en la cámara: ${error.message || error}`);
    console.error(`Error en fnOpenCamera: ${error.message || error}`);
  }
};

const fnPickPhoto = async () => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Ha rechazado el acceso a la galería del dispositivo!");
      return;
    }
    setloading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: false, // No pidas base64 aquí, lo generas después
    });

    if (!result.canceled) {
      // Manipula la imagen (redimensiona y comprime)
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
     
      const resp = await fnUploadFile(manipResult.uri, manipResult.base64);

      if (!resp) {
        alert("Error al cargar la información desde fnPickPhoto.");
      } else {
        setUpdate(true);
      }
    }
    setloading(false);
    setOpen(!open);
  } catch (error) {
    setOpen(!open);
    setloading(false);
    alert(`Error en la galería: ${error.message || error}`);
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
              <View marginTop={10} marginBottom={10}>
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
              <View marginTop={10} marginBottom={10}>
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
