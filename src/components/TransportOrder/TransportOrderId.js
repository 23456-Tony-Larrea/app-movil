import React from "react";
import { Text, View } from "react-native";
import styles from "./style";

const SalesOrderId = ({ salesOrderId }) => {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
      <Text style={styles.title}>{salesOrderId}</Text>
    </View>
  );
};

export default SalesOrderId;