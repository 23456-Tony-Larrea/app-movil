import React, { memo } from "react";
import styles from "./style";
import { Text, View } from "react-native";

const LineDetail = ({ orderLines, orderLineStates }) => {
  return (
    <View>
      <Text style={styles.title}>{orderLines[0].salesOrderId}</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Guía de remisión</Text>
          <Text style={styles.text}>{orderLines[0].liPackingSlipId}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Estado:</Text>
          <Text style={styles.text}>
            {
              orderLineStates.filter(
                (sta) => sta.value == orderLines[0].status
              )[0].label
            }
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LineDetail;
