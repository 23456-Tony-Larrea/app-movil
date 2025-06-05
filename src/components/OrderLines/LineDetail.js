import React, { memo } from "react";
import styles from "./style";
import { Text, View } from "react-native";

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

const LineDetail = ({ orderLines, orderLineStates }) => {
  if (!orderLines || orderLines.length === 0) {
    return (
      <View>
        <Text style={styles.title}>No hay líneas de pedido disponibles.</Text>
      </View>
    );
  }
  const firstLine = orderLines[0];
  let estado = "-";
  if (orderLineStates && orderLineStates.length > 0) {
    const found = orderLineStates.find((sta) => sta.value == firstLine.status);
    if (found) {
      estado = found.label;
    }
  }
  return (
    <View>
      <Text style={styles.title}>{firstLine.salesOrderId}</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Guía de remisión</Text>
          <Text style={styles.text}>{firstLine.liPackingSlipId}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Estado:</Text>
          <Text style={styles.text}>{estado}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Fecha:</Text>
          <Text style={styles.text}>{formatDate(firstLine.date)}</Text>
        </View>
      </View>
    </View>
  );
};

export default LineDetail;
