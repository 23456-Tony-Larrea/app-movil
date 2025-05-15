import React, { memo } from "react";
import { Text, View, FlatList } from "react-native";
import styles from "./style";

// Define las interfaces para los tipos de las propiedades
interface OrderLine {
  salesOrderId: string;
}

interface LineDetailProps {
  orderLines: OrderLine[]; // Array de líneas de pedido
}

const LineDetail: React.FC<LineDetailProps> = ({ orderLines }) => {
  return (
    <View>
      <FlatList
        data={orderLines}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
            <Text style={styles.title}>{item.salesOrderId}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No hay líneas de pedido disponibles.
          </Text>
        }
      />
    </View>
  );
};

export default memo(LineDetail);