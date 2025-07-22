import React, { useContext, useEffect } from "react";
import styles from "../OrderLines/style";
import { FlatList, Text, View } from "react-native";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import globalStyles from "../../global/style";
import DocumentDetail from "./DocumentDetail";

const Documents = ({ company, recId, recIdOV }) => {
  const { update, documents, setloading, getDocumentation } =
    useContext(OrderLineContext);

  // ✅ AGREGAR LOGS PARA DEBUG
  console.log("=== RENDER Documents Component ===");
  console.log("Props recibidas:");
  console.log("- company:", company);
  console.log("- recId:", recId);
  console.log("- recIdOV:", recIdOV);
  console.log("Context state:");
  console.log("- documents:", documents);
  console.log("- documents type:", typeof documents);
  console.log("- documents length:", documents ? documents.length : 0);
  console.log("- update:", update);
  console.log("================================");

  useEffect(() => {
    console.log("=== useEffect 1 - Initial fetch ===");
    console.log("Parámetros:", { company, recId, recIdOV });
    const fetchData2 = async () => {
      await getDocumentation(company, recId, recIdOV);
    };
    fetchData2();
  }, [company, recId, recIdOV]);

  useEffect(() => {
    console.log("=== useEffect 2 - Update fetch ===");
    console.log("Update:", update);
    const fetchData2 = async () => {
      if (update) {
        console.log("Update is true, calling getDocumentation...");
        setloading(true);
        await getDocumentation(company, recId, recIdOV);
      }
    };
    fetchData2();
  }, [update]);

  return (
    <>
      <Text style={styles.title}>Documentación</Text>
      <FlatList
        data={documents}
        renderItem={({ item }) => <DocumentDetail item={item} />}
        keyExtractor={(item) => item.recId}
        ListEmptyComponent={
          <View style={globalStyles.title}>
            <Text style={[globalStyles.title, { fontSize: 20 }]}>
              No existen documentos asociados
            </Text>
          </View>
        }
        ItemSeparatorComponent={
          <View
            style={{
              height: 5,
              width: "100%",
              // backgroundColor: "rgba(0,0,0,0.1)",
              backgroundColor: "white",
            }}
          />
        }
        maxToRenderPerBatch={2}
      />
    </>
  );
};

export default Documents;
