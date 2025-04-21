import React, { memo } from "react";
import styles from "./style";
import { Text, View } from "react-native";

export interface OrderLine {
  salesOrderId: string;
  liPackingSlipId: string;
  status: string;
  recIdOV: number;
}

interface OrderLineState {
  value: string;
  label: string;
}

interface LineDetailProps {
  orderLines: OrderLine[];
  orderLineStates: OrderLineState[];
}

interface LineDetailProps {
  orderLines: OrderLine[];
  orderLineStates: OrderLineState[];
}

const LineDetail: React.FC<LineDetailProps> = ({ orderLines, orderLineStates }) => {
  return (
    <View>
      <Text style={styles.title}>Orden de venta: {orderLines[0].salesOrderId}</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Guía de remisión</Text>
          <Text style={styles.text}>{orderLines[0].liPackingSlipId}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Estado:</Text>
          <Text style={styles.text}>
            {
              orderLineStates.find(
                (sta) => sta.value === orderLines[0].status
              )?.label
            }
          </Text>
        </View>
      </View>
    </View>
  );
};

export default memo(LineDetail);