import React, { useState, useContext } from "react";
import { Button, Image, View, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";

interface CameraProps {
  route: {
    params: {
      document: {
        documentName: string;
      };
    };
  };
}

const Camera: React.FC<CameraProps> = ({ route }) => {
  const { document } = route.params;
  const [image, setImage] = useState<string | null>(null);
  const [base64, setBase64] = useState<string>("");

  // Obtén el contexto y verifica que no sea undefined
  const context = useContext(OrderLineContext);
  if (!context) {
    throw new Error("OrderLineContext must be used within a provider");
  }

  const { orderLines, postSPDocumentation } = context;

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permiso denegado",
          "Has rechazado el acceso a tus fotos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", String(error));
    }
  };

  const openCamera = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permiso denegado",
          "Has rechazado el acceso a la cámara del dispositivo."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setBase64(result.assets[0].base64 || "");
      }
    } catch (error) {
      Alert.alert("Error", String(error));
    }
  };

  const fnPostDocSP = async () => {
    if (base64) {
      try {
        const sendData = [
          {
            nombreCarpeta: "Desarrollo",
            nombreCarpeta2: orderLines[0].liPackingSlipId,
            nombreArchivo: document.documentName
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, ""),
            url: "",
            extArchivo: ".png",
            base64: base64,
            vendAccount: "",
            recIdRecord: 0,
            tableId: 0,
          },
        ];
        console.log("Empezó");
        const resp = await postSPDocumentation(sendData);
        console.log("Terminó");
        console.log(resp);
      } catch (error) {
        Alert.alert("Error", String(error));
      }
    }
  };

  console.log(
    document.documentName.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  );

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Take photo" onPress={openCamera} />
      {base64 && (
        <Image
          source={{ uri: "data:image/png;base64," + base64 }}
          style={{ width: 200, height: 200 }}
        />
      )}
      <Button title="Send file" onPress={fnPostDocSP} />
    </View>
  );
};

export default Camera;