import React, { memo, useContext, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { grey, redLife, redPressed } from "../../constants/color";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./style";
import { useNavigation } from "@react-navigation/native";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import SalesOrdersList from "./SalesOrdersList";

const orderStatus = [
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

const Order = ({ order }) => {
  const navigation = useNavigation();
  const {
    setUpdate,
    setloading,
    setTransportOrder,
    postTransportOrderChecker,
  } = useContext(TransportOrderContext);

  const { getOrderLine, orderLines } = useContext(OrderLineContext); // Consume el contexto de OrderLine

  useEffect(() => {
    // Llama a getOrderLine cuando el componente se monta o cuando cambia el order.orderId
    getOrderLine("li", order.orderId);
  }, [order]);

  const fnOrderDetail = async (order) => {
    setTransportOrder(order);
    navigation.navigate("Detalles", { order: order });
  };

  const fnOTChecker = async (order) => {
    try {
      setloading(true);
      const resp = await postTransportOrderChecker(order.orderId);
      if (resp) {
        setUpdate(true);
      }
    } catch (error) {
      alert(error);
    }
  };

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
            {orderStatus.find((sta) => sta.id == order.status)?.text || "-"}
          </Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.subTitle}>Fecha de entrega:</Text>
          <Text style={styles.text}>
            {order.deliveryDate
              ? order.deliveryDate.substring(0, 10)
              : "-"}
          </Text>
        </View>
      </View>

      {/* Renderiza los Sales Order ID de la orden específica */}
      <View style={styles.row}>
        <SalesOrdersList orderLines={order.orderLines} />
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