import React, { useContext, useEffect, useState } from "react";
import { BackHandler, Image, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./style";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import Loading from "../../components/Loading/Loading";

const DocumentsScreen = ({ route }) => {
  console.log("=== RENDER DocumentsScreen ===");
  console.log("Route params:", route.params);
  
  const { document } = route.params;
  console.log("Document from params:", document);
  console.log("Document type:", typeof document);
  console.log("Document keys:", document ? Object.keys(document) : "NULL");
  
  const [base64, setbase64] = useState("");
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
    console.log("=== useEffect DocumentsScreen - Fetching base64 ===");
    console.log("Document to fetch:", document);
    const fetchData2 = async () => {
      console.log("Setting wait to true...");
      setwait(true);
      console.log("Calling getBase64Doc...");
      const base64Result = await getBase64Doc(document);
      console.log("getBase64Doc result:", base64Result ? `${base64Result.length} characters` : "EMPTY");
      setbase64(base64Result);
      console.log("Setting wait to false...");
      setwait(false);
    };
    fetchData2();
  }, [document]);

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
