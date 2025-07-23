import React, { useContext, useEffect, useState } from "react";
import { BackHandler, Image, Text, View, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./style";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import Loading from "../../components/Loading/Loading";

const DocumentsScreen = ({ route }) => {
  const { document } = route.params;
  
  const [documentData, setDocumentData] = useState("");
  const [isUrl, setIsUrl] = useState(false);
  const [wait, setwait] = useState(false);
  const navigation = useNavigation();

  const { getBase64Doc } = useContext(OrderLineContext);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  
  useEffect(() => {
    const fetchData2 = async () => {
      setwait(true);
      const result = await getBase64Doc(document);
      
      // Verificar si el resultado es una URL de SharePoint o base64
      if (result && result.includes('sharepoint.com')) {
        setDocumentData(result);
        setIsUrl(true);
      } else if (result) {
        setDocumentData(result);
        setIsUrl(false);
      }
      
      setwait(false);
    };
    fetchData2();
  }, [document]);

  const openInBrowser = () => {
    if (isUrl && documentData) {
      Linking.openURL(documentData);
    }
  };

  return (
    <View style={styles.root}>
      {wait && <Loading loading={wait} opacity={0.15} sizeIcon={50} />}
      <View style={styles.container}>
        <Text style={styles.title}>{document.documentName}</Text>
        {wait && <Text style={styles.subTitle}>Cargando archivo...</Text>}

        {documentData ? (
          <View style={styles.row}>
            {isUrl ? (
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={styles.subTitle}>
                  Documento disponible en SharePoint
                </Text>
                <Text 
                  style={[styles.subTitle, { color: "blue", textDecorationLine: "underline", marginTop: 10 }]}
                  onPress={openInBrowser}
                >
                  Abrir documento
                </Text>
                <Image
                  source={{ uri: documentData }}
                  style={{ width: "100%", height: 500, marginTop: 20 }}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <Image
                source={{ uri: "data:image/png;base64," + documentData }}
                style={{ width: "100%", height: 500 }}
                resizeMode="contain"
              />
            )}
          </View>
        ) : (
          !wait && <Text style={styles.subTitle}>No hay archivos cargados</Text>
        )}
      </View>
      <View style={styles.btnDeliverOrder}></View>
    </View>
  );
};

export default DocumentsScreen;
