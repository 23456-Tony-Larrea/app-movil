import React, { useCallback, useContext, useEffect, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import styles from "./style";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DeliverOrderBtn from "../../components/Buttons/DeliverOrderBtn";
import Documents from "../../components/LineDocument/Documents";
import Loading from "../../components/Loading/Loading";
import LineDetail from "../../components/OrderLines/LineDetail";
import { redStrong, redLife } from "../../constants/color";

const OrderLines = ({ route }) => {
  const { order } = route.params;
  const navigation = useNavigation();
  const [allowAcctions, setallowAcctions] = useState(false);
  const { company } = useContext(TransportOrderContext);
  const {
    loading,
    orderLines,
    orderLineStates,
    getOrderLine,
    setloading,
    setOrderLine,
    setDocuments,
  } = useContext(OrderLineContext);

  const fnDeleteData = () => {
    navigation.navigate("Root");
    setOrderLine([]);
    setDocuments([]);
  };

  const fnDeliverOrder = useCallback(() => {
    navigation.navigate("EntregarOrden", { order: order });
  }, []);
  const fnPanicNotification = useCallback(() => {
    navigation.navigate("PanicNotification", { order: order });
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      setloading(true);
      await getOrderLine(company, order.orderId);
    };
    fetchData2();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icon
          name="arrow-back"
          color={"black"}
          size={25}
          style={{
            paddingLeft: 10,
            paddingRight: 30,
          }}
          onPress={() => fnDeleteData()}
        />
      ),
      title: "Detalles - " + order.orderId,
    });
    if (order.status === "2") {
      setallowAcctions(true);
      navigation.setOptions({
        headerRight: () => (
          <Icon
            name="notifications-active"
            color={redLife}
            size={35}
            style={{
              paddingLeft: 10,
              paddingRight: 30,
            }}
            onPress={() => fnPanicNotification()}
          />
        ),
      });
    }
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      fnDeleteData();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          backgroundColor: redLife,
          borderRadius: 20,
          padding: 20,
          margin: 20,
          shadowColor: redStrong,
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Icon
          name="list-alt"
          size={48}
          color={redStrong}
          style={{
            alignSelf: "center",
            marginBottom: 12,
          }}
        />
        <Text
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Detalles de la Orden: {order.orderId}
        </Text>
        <LineDetail order={order} />
        <Documents order={order} />
        {loading && <Loading loading={loading} />}
        <View style={{ marginTop: 20 }}>
          <DeliverOrderBtn
            onPress={fnDeliverOrder}
            textBtn={"Entregar Orden"}
            color={redStrong}
          />
        </View>
      </View>
    </View>
  );
};

export default OrderLines;
