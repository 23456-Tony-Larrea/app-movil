import React, { useCallback, useContext, useEffect, useState } from "react";
import { BackHandler, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DeliverOrderBtn from "../../components/Buttons/DeliverOrderBtn";
import styles from "./style";
import Panic from "../../components/Panic/Panic";
import { redLife } from "../../constants/color";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import Loading from "../../components/Loading/Loading";
import Success from "../../components/Success/Success";

const NotificationScreen = ({ route }) => {
  const { order } = route.params;
  const [wait, setwait] = useState(false);
  const [success, setsuccess] = useState(false);
  const [comment, setcomment] = useState("");
  const navigation = useNavigation();

  const { company } = useContext(TransportOrderContext);
  const { postPanicNotification } = useContext(OrderLineContext);

  const fnSendPanicNotification = async () => {
    setwait(true);
    await postPanicNotification(company, comment);
    setTimeout(() => {
      setwait(false);
      setsuccess(true);
    }, 2500);
    setTimeout(() => {
      setsuccess(false);
      navigation.navigate("Detalles", { order: order });
    }, 4500);
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Detalles", { order: order });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.main}>
      {wait && <Loading loading={wait} opacity={0.15} sizeIcon={50} />}
      {success && <Success success={success} opacity={0.7} />}
      <Panic order={order} comment={comment} setcomment={setcomment} />
      <View style={styles.btnDeliverOrder}>
        <DeliverOrderBtn
          onPress={fnSendPanicNotification}
          textBtn={"Enviar notificación"}
          color={redLife}
        />
      </View>
    </View>
  );
};

export default NotificationScreen;
