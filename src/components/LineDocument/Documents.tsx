import React, { useContext, useEffect } from "react";
import styles from "../OrderLines/style";
import { FlatList, Text, View } from "react-native";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import globalStyles from "../../global/style";
import DocumentDetail from "./DocumentDetail";

interface Document {
  recId: string;
  documentName: string;
  mandatory: number;
  attachRecId: number;
  url: string;
}

interface DocumentsProps {
  company: string;
  recId: string;
  recIdOV: string;
}

const Documents: React.FC<DocumentsProps> = ({ company, recId, recIdOV }) => {
  const { documents, getDocumentation, update, setloading } = useContext(OrderLineContext)!;

  useEffect(() => {
    const fetchData2 = async () => {
      await getDocumentation(company, recId, recIdOV);
    };
    fetchData2();
  }, [company, recId, recIdOV, getDocumentation]);

  useEffect(() => {
    const fetchData2 = async () => {
      if (update) {
        setloading(true);
        await getDocumentation(company, recId, recIdOV);
      }
    };
    fetchData2();
  }, [update, company, recId, recIdOV, getDocumentation, setloading]);

  return (
    <>
      <Text style={styles.title}>Documentación</Text>
      <FlatList
  data={documents}
  renderItem={({ item }: { item: Document }) => <DocumentDetail item={item} />}
  keyExtractor={(item) => item.recId}
  ListEmptyComponent={
    <View style={globalStyles.title}>
      <Text style={[globalStyles.title, { fontSize: 20 }]}>
        No existen documentos asociados
      </Text>
    </View>
  }
  ItemSeparatorComponent={() => (
    <View
      style={{
        height: 5,
        width: "100%",
        backgroundColor: "white",
      }}
    />
  )}
  maxToRenderPerBatch={2}
/>
    </>
  );
};

export default Documents;