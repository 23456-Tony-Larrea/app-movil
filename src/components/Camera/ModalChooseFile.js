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

const ModalChooseFile = ({ open, setOpen, document }) => {
  const { orderLines, setUpdate, postNewSPDocumentation, postAXDocumentation } =
    useContext(OrderLineContext);
  const { company, vendorRuc } = useContext(TransportOrderContext); // ✅ AGREGADO: vendorRuc
  const [loading, setloading] = useState(false);

  // Debug: Logs para verificar los datos al montar el componente
  React.useEffect(() => {
    console.log("=== ModalChooseFile DEBUG ===");
    console.log("Props document:", document);
    console.log("Context orderLines:", orderLines);
    console.log("Context company:", company);
    console.log("Context vendorRuc:", vendorRuc); // ✅ AGREGADO: Debug vendorRuc
    console.log("Modal open:", open);
  }, [document, orderLines, company, open, vendorRuc]); // ✅ AGREGADO: vendorRuc al array de dependencias

  const fnUploadFile = async (uri, base64Data = null) => {
    try {
      console.log("=== INICIO fnUploadFile ===");
      console.log("URI recibida:", uri);
      console.log("Base64 disponible:", base64Data ? "SÍ" : "NO");
      console.log("Document:", document);
      console.log("OrderLines:", orderLines);
      console.log("Company:", company);
      console.log("VendorRuc:", vendorRuc);

      // Verificar que tenemos los datos necesarios
      if (!document) {
        console.error("ERROR: document es null o undefined");
        alert("Error: No se encontró información del documento");
        return false;
      }

      if (!document.documentName) {
        console.error("ERROR: document.documentName es null o undefined");
        alert("Error: El documento no tiene nombre");
        return false;
      }

      if (!orderLines || orderLines.length === 0) {
        console.error("ERROR: orderLines está vacío o es null");
        alert("Error: No hay órdenes de línea disponibles");
        return false;
      }

      if (!orderLines[0].liPackingSlipId) {
        console.error("ERROR: liPackingSlipId es null o undefined");
        alert("Error: ID de packing slip no encontrado");
        return false;
      }

      const normalizedFileName = document.documentName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      console.log("Nombre archivo normalizado:", normalizedFileName);

      // Si no tenemos base64, necesitamos convertir la imagen
      let finalBase64 = base64Data;
      if (!finalBase64) {
        console.log("Convirtiendo imagen a base64...");
        // Para este caso necesitaremos usar una librería de conversión o cambiar la lógica
        // Por ahora, mostrar error explicativo
        alert("Error: Se necesita la imagen en formato base64");
        return false;
      }

      // Preparar datos JSON según el formato esperado por la API
      // La API espera directamente un ARRAY de objetos Attachment (según curl del Swagger)
      const attachmentObject = {
        base64: finalBase64,
        nombreArchivo: normalizedFileName,
        nombreCarpeta: "Desarrollo2",
        nombreCarpeta2: orderLines[0].liPackingSlipId,
        vendAccount: vendorRuc || "",
        url: "", // String vacío
        recIdRecord: parseInt(document.recId), // Número entero
        tableId: parseInt(tableIdDocuments), // Número entero
        extArchivo: extFile
      };

      // ✅ CORRECTO: Enviar directamente el array como muestra el curl
      const dataJSON = [attachmentObject];

      console.log("Datos JSON preparados:");
      console.log("- Array directo length:", dataJSON.length);
      console.log("- Primer attachment:", dataJSON[0]);
      console.log("- VendorRuc usado:", vendorRuc);
      console.log("Enviando a postNewSPDocumentation...");
      
      const url = await postNewSPDocumentation(dataJSON);
      console.log("Respuesta de postNewSPDocumentation:", url);

      if (url !== null && url !== undefined && url !== "") {
        console.log("URL válida recibida, preparando datos para AX...");
        
        // ✅ CORRECTO: postAX también espera un array según el curl
        const dataAX = [{
          base64: "", // No necesario para AX
          nombreArchivo: normalizedFileName,
          nombreCarpeta: "Desarrollo2",
          nombreCarpeta2: orderLines[0].liPackingSlipId,
          vendAccount: vendorRuc || "",
          url: url,
          recIdRecord: parseInt(document.recId),
          tableId: parseInt(tableIdDocuments),
          extArchivo: extFile
        }];
        
        console.log("Datos para AX:", dataAX);
        console.log("Enviando a postAXDocumentation...");
        
        const resp2 = await postAXDocumentation(dataAX, company);
        console.log("Respuesta de postAXDocumentation:", resp2);
        
        if (resp2 !== 0) {
          console.log("=== SUCCESS: Upload completado exitosamente ===");
          return true;
        } else {
          console.error("ERROR: postAXDocumentation retornó 0");
          alert("Error: No se pudo guardar la documentación en AX");
          return false;
        }
      } else {
        console.error("ERROR: URL no válida recibida de postNewSPDocumentation:", url);
        alert("Error: No se pudo subir el archivo al servidor");
        return false;
      }
    } catch (error) {
      console.error("=== ERROR COMPLETO en fnUploadFile ===");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Error completo:", error);
      alert(`Error al cargar la información: ${error.message || error}`);
      return false;
    }
  };

  const fnOpenCamera = async () => {
    try {
      console.log("=== INICIO fnOpenCamera ===");
      
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      console.log("Permisos de cámara:", permissionResult);

      if (permissionResult.granted === false) {
        console.log("Permisos de cámara rechazados");
        alert("Ha rechazado el acceso a la cámara del dispositivo!");
        return;
      }
      
      console.log("Iniciando cámara...");
      setloading(true);
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        base64: true, // ✅ AGREGADO: Solicitar base64 también para la cámara
      });
      
      console.log("Resultado de la cámara:", result);

      if (!result.canceled) {
        console.log("Imagen capturada, URI:", result.assets[0].uri);
        console.log("Base64 disponible:", result.assets[0].base64 ? "SÍ" : "NO");
        console.log("Llamando a fnUploadFile...");
        
        const resp = await fnUploadFile(result.assets[0].uri, result.assets[0].base64);
        console.log("Resultado de fnUploadFile:", resp);
        
        if (!resp) {
          console.error("fnUploadFile retornó false");
          alert("Error al cargar la información.");
        } else {
          console.log("Upload exitoso, actualizando...");
          setUpdate(true);
        }
      } else {
        console.log("Captura de imagen cancelada");
      }
      
      setloading(false);
      setOpen(!open);
      console.log("=== FIN fnOpenCamera ===");
    } catch (error) {
      console.error("=== ERROR en fnOpenCamera ===");
      console.error("Error message:", error.message);
      console.error("Error completo:", error);
      setOpen(!open);
      setloading(false);
      alert(`Error en la cámara: ${error.message || error}`);
    }
  };
  const fnPickPhoto = async () => {
    try {
      console.log("=== INICIO fnPickPhoto ===");
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Permisos de galería:", permissionResult);
      
      if (permissionResult.granted === false) {
        console.log("Permisos de galería rechazados");
        alert("Ha rechazado el acceso a la galería del dispositivo!");
        return;
      }
      
      console.log("Abriendo galería...");
      setloading(true);
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        base64: true,
      });
      
      console.log("Resultado de la galería:", result);
      
      if (!result.canceled) {  // ✅ CORREGIDO: Cambio de "cancelled" a "canceled"
        console.log("Imagen seleccionada, URI:", result.assets[0].uri);
        console.log("Base64 disponible:", result.assets[0].base64 ? "SÍ" : "NO");
        console.log("Llamando a fnUploadFile...");
        
        const resp = await fnUploadFile(result.assets[0].uri, result.assets[0].base64);
        console.log("Resultado de fnUploadFile:", resp);
        
        if (!resp) {
          console.error("fnUploadFile retornó false");
          alert("Error al cargar la información.");
        } else {
          console.log("Upload exitoso, actualizando...");
          setUpdate(true);
        }
      } else {
        console.log("Selección de imagen cancelada");
      }
      
      setloading(false);
      setOpen(!open);
      console.log("=== FIN fnPickPhoto ===");
    } catch (error) {
      console.error("=== ERROR en fnPickPhoto ===");
      console.error("Error message:", error.message);
      console.error("Error completo:", error);
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
