import React, { useState, useEffect, useContext } from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";

const Camera = ({ route }) => {
  const { document } = route.params;
  const [image, setImage] = useState(null);
  const [base64, setbase64] = useState("");
  const { loading, orderLines, setloading, postSPDocumentation } =
    useContext(OrderLineContext);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //   allowsEditing: true,
      //   aspect: [8, 8],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const openCamera = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Ha rechazado el acceso a la cámara del dispositivo!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setbase64(result.assets[0].base64);
      }
    } catch (error) {
      console.log("vaa error");
      console.log(error);
    }
  };
  const fnPostDocSP = async () => {
    if (base64) {
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
      console.log("empezó");
      const resp = await postSPDocumentation(sendData);
      console.log("termino");
      console.log(resp);
    }
  };
  /*
VER LO DE SHAREPOIN SUBIR ARCHIVOS Y ELIMINAR 


*/

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
