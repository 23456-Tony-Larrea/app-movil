import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, BackHandler, View } from "react-native";
import DeliverOrder from "../../components/DeliverOrder/DeliverOrder";
import { useNavigation } from "@react-navigation/native";
import DeliverOrderBtn from "../../components/Buttons/DeliverOrderBtn";
import { grey, redLife } from "../../constants/color";
import styles from "./style";
import Loading from "../../components/Loading/Loading";
import Success from "../../components/Success/Success";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";

const DeliverOrderScreen = ({ route }) => {
  const { order } = route.params;
  const navigation = useNavigation();
  const [comment, setcomment] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [wait, setwait] = useState(false);
  const [success, setsuccess] = useState(false);
  const { documents } = useContext(OrderLineContext);
  const {
    company,
    transportOrder,
    setOrderState,
    postCheckDelivered,
    setUpdate,
  } = useContext(TransportOrderContext);

  const fnDeliverOrder = async () => {
    try {
      let val = true;
      setwait(true);
      const tmp = documents.filter((x) => x.mandatory === 1);
      if (tmp.length > 0) {
        const tmp2 = tmp.filter((y) => y.attachRecId !== 0 && y.url !== "");
        if (tmp.length !== tmp2.length) {
          setwait(false);
          val = false;
          Alert.alert(
            "Advertencia",
            "No se ha adjuntado toda la documentación obligatoria.",
            [{ text: "Aceptar", onPress: () => console.log("OK Pressed") }]
          );
        }
      }
      if (isEnabled) {
        if (comment.trim() === "") {
          setwait(false);
          val = false;
          Alert.alert(
            "Advertencia",
            "Se debe ingresar un comentario para la notificación de incumplimiento.",
            [{ text: "Aceptar", onPress: () => console.log("OK Pressed") }]
          );
        }
      }
      if (val) {
        const data = {
          company: company,
          orderId: transportOrder.orderId,
          checkerName: "",
          status: 1,
        };
        const sendEmail = isEnabled ? 1 : 0;
        const resp = await postCheckDelivered(data, sendEmail);
        setTimeout(() => {
          setOrderState("2");
          setwait(false);
          setsuccess(true);
        }, 2500);
        setTimeout(() => {
          setsuccess(false);
          if (resp) {
            setUpdate(true);
            navigation.navigate("Root");
          } else
            alert("Hubo un problema al notificar la " + transportOrder.orderId);
        }, 2500);
      }
    } catch (error) {
      alert(error);
    }
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
      <DeliverOrder
        order={order}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        comment={comment}
        setcomment={setcomment}
      />
      <View
        pointerEvents={
          (isEnabled && comment.length > 0) || isEnabled === false
            ? "auto"
            : "none"
        }
        style={styles.btnDeliverOrder}
      >
        <DeliverOrderBtn
          onPress={fnDeliverOrder}
          textBtn={"Entregar"}
          color={
            (isEnabled && comment.length > 0) || isEnabled === false
              ? redLife
              : "grey"
          }
        />
      </View>
    </View>
  );
};

export default DeliverOrderScreen;
