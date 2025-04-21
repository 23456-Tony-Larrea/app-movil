import React, { useCallback, useContext, useEffect, useState } from "react";
import { BackHandler, View } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import DeliverOrderBtn from "../../components/Buttons/DeliveryOrderBtn";
import styles from "./style";
import Panic from "../../components/Panic/Panic";
import { redLife } from "../../constants/color";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import Loading from "../../components/Loading/Loading";
import Success from "../../components/Success/Success";

interface NotificationScreenProps {
  route: {
    params: {
      order: any; // Reemplaza `any` con el tipo adecuado si lo conoces
    };
  };
}
export type RootStackParamList = {
    Detalles: { order: any }; // Reemplaza `any` con el tipo adecuado para `order`
    Notification: undefined; // Agrega otras rutas según sea necesario
  };

const NotificationScreen: React.FC<NotificationScreenProps> = ({ route }) => {
  const { order } = route.params;
  const [wait, setWait] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { company } = useContext(TransportOrderContext)!;
  const { postPanicNotification } = useContext(OrderLineContext)!;

  const fnSendPanicNotification = async () => {
    setWait(true);
    await postPanicNotification(company, comment);
    setTimeout(() => {
      setWait(false);
      setSuccess(true);
    }, 2500);
    setTimeout(() => {
      setSuccess(false);
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
  }, [navigation, order]);

  return (
    <View style={styles.main}>
      {wait && <Loading loading={wait} opacity={0.15} sizeIcon={50} />}
      {success && <Success success={success} opacity={0.7} />}
      <Panic order={order} comment={comment} setcomment={setComment} />
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