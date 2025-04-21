import React, { useContext, useEffect, useState } from "react";
import { BackHandler, Image, Text, View } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import styles from "./style";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import Loading from "../../components/Loading/Loading";
import { RootStackParamList } from "../Notification/NotificationScreen";

interface DocumentsScreenProps {
  route: {
    params: {
      document: {
        documentName: string;
        [key: string]: any; // Reemplaza `any` con el tipo adecuado si conoces las propiedades adicionales
      };
    };
  };
}

interface Document {
    recId: string;
    documentName: string;
    mandatory: number;
    attachRecId: number;
    url: string;
  }
const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ route }) => {
  const { document } = route.params;
  const [base64, setBase64] = useState<string>("");
  const [wait, setWait] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { getBase64Doc } = useContext(OrderLineContext)!;

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
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      setWait(true);
  
      // Asegúrate de que el objeto `document` tenga las propiedades necesarias
      const validDocument: Document = {
        recId: document.recId || "", // Proporciona un valor predeterminado si falta
        documentName: document.documentName,
        mandatory: document.mandatory || 0,
        attachRecId: document.attachRecId || 0,
        url: document.url || "",
      };
  
      const base64Data = await getBase64Doc(validDocument);
      setBase64(base64Data);
      setWait(false);
    };
    fetchData();
  }, [document, getBase64Doc]);

  return (
    <View style={styles.root}>
      {wait && <Loading loading={wait} opacity={0.15} sizeIcon={50} />}
      <View style={styles.container}>
        <Text style={styles.title}>{document.documentName}</Text>
        {wait && <Text style={styles.subTitle}>Cargando archivo...</Text>}

        {base64 ? (
          <View style={styles.row}>
            <Image
              source={{ uri: "data:image/png;base64," + base64 }}
              style={{ width: "100%", height: 500 }}
            />
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