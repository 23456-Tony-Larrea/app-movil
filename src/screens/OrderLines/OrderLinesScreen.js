import React, { useCallback, useContext, useEffect, useState } from "react";
import { BackHandler, View } from "react-native";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import styles from "./style";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import DeliverOrderBtn from "../../components/Buttons/DeliverOrderBtn";
import Documents from "../../components/LineDocument/Documents";
import Loading from "../../components/Loading/Loading";
import LineDetail from "../../components/OrderLines/LineDetail";
import { redLife } from "../../constants/color";

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
          name="left"
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
          <Icon2
            name="bell-alert"
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

  // useEffect(() => {
  //   const fetchData2 = async () => {
  //     if (update) {
  //       setloading(true);
  //       await getOrderLine(company, transportOrder.orderId);
  //     }
  //   };
  //   fetchData2();
  // }, [update]);

  return (
    <View style={styles.root}>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <>
          {orderLines.length > 0 && (
            <>
              <View height="35%" style={[styles.container]}>
                <LineDetail
                  orderLines={orderLines}
                  orderLineStates={orderLineStates}
                />
              </View>
              <View
                height={allowAcctions ? "74%" : "82%"}
                style={[styles.container]}
              >
                <Documents
                  company={company}
                  recId={orderLines[0].recId}
                  recIdOV={orderLines[0].recIdOV}
                />
              </View>
              <View height="10%" paddingVertical={10} marginHorizontal={16}>
                {allowAcctions && (
                  <DeliverOrderBtn
                    onPress={fnDeliverOrder}
                    textBtn={"Entregar orden"}
                    color={redLife}
                  />
                )}
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
};

export default OrderLines;
