import React from "react";
import { View, Text } from "react-native";
import styles from "./style";

const SalesOrdersList = ({ orderLines }) => {
  return (
    <View style={styles.column}>
      <Text style={styles.subTitle}>Ordenes de venta:</Text>
      {(orderLines && orderLines.length > 0) ? (
        orderLines.map((orderLine, index) => (
          <Text
            key={orderLine.salesOrderId || index}
            style={styles.text}
          >
            {orderLine.salesOrderId}
          </Text>
        ))
      ) : (
        <Text style={styles.text}>-</Text>
      )}
    </View>
  );
};

export default SalesOrdersList;
