import React, { memo, useContext, useEffect } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { grey, redLife, redPressed } from "../../constants/color";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./style";
import { useNavigation } from "@react-navigation/native";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";

type OrderStatus = {
  id: string;
  text: string;
};

export interface TransportOrder { 
  orderId: string;
  status: string;
  deliveryDate: string;
  orderLines: OrderLine[]; // Cambia `any[]` por el tipo adecuado si lo conoces
  orderLineStates: any[]; // Cambia `any[]` por el tipo adecuado si lo conoces
}

interface OrderLine {
  salesOrderId: string;
}

const orderStatus: OrderStatus[] = [
  {
    id: "0",
    text: "Pendiente",
  },
  {
    id: "2",
    text: "Verificado",
  },
  {
    id: "3",
    text: "Entregado",
  },
];

type OrderProps = {
  order: TransportOrder;
};

const Order: React.FC<OrderProps> = ({ order }) => {
  const navigation = useNavigation<any>();
  const {
    setUpdate,
    setloading,
    setTransportOrder,
    postTransportOrderChecker,
  } = useContext(TransportOrderContext)!;

  const { getOrderLine, orderLines } = useContext(OrderLineContext)!;

  const fnOrderDetail = async (order: TransportOrder) => {
    setTransportOrder(order);
    navigation.navigate("Detalles", { order });
  };

  const fnOTChecker = async (order: TransportOrder) => {
    try {
      setloading(true);
      const resp = await postTransportOrderChecker(order.orderId);
      if (resp) {
        setUpdate(true);
      }
    } catch (error) {
      Alert.alert(error as string);
    }
  };

  useEffect(() => {
    getOrderLine("li",order.orderId);
  }, [order]);

  return (
    <Pressable
      onPress={() => fnOrderDetail(order)}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? redPressed : "white",
        },
        styles.item,
      ]}
    >
      <Text style={styles.title}>{order.orderId}</Text>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Estado:</Text>
          <Text style={styles.text}>
            {orderStatus.find((sta) => sta.id === order.status)?.text || "Desconocido"}
          </Text>

        </View>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Fecha de entrega:</Text>
          <Text style={styles.text}>{order.deliveryDate.substring(0, 10)}</Text>
        </View>
        <View style={styles.column}>
 <Text style={styles.subTitle}>Sales Order ID:</Text>
 {orderLines.map((orderLine, index) => (
 <Text
 key={index} // Using index as a key, consider using a unique ID from your data if available
 style={styles.text}>
 {orderLine.salesOrderId}
 </Text>
 ))}
 </View>
      </View>


      
      {order.status === "0" && (
        <View style={styles.row}>
          <View
            style={[
              styles.column,
              {
                width: "100%",
                padding: 0,
              },
            ]}
          >
            <Icon.Button
              name="check-square-o"
              backgroundColor={grey}
              underlayColor="red"
              selectionColor="black"
              color={redLife}
              size={30}
              borderRadius={15}
              onPress={() => fnOTChecker(order)}
              style={{
                padding: 15,
                justifyContent: "center",
              }}
            >
              Verificar
            </Icon.Button>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default memo(Order);