import React, { useCallback, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderLineReducer } from "./OrderLineReducer";
import { OrderLineContext } from "./OrderLineContext";
import { baseUrl, emailPanicNotification } from "../../constants/config";
import { ORDERLINE } from "../Types/types";
// MSAL imports

const OrderLineState = (props) => {
  const initialState = {
    orderLines: [],
    documents: [],
    loading: false,
    update: false,
    orderLineStates: [
      { label: "Pendiente entrega", value: "0" },
      { label: "Entregado", value: "1" },
    ],
  };

  const [state, dispatch] = useReducer(OrderLineReducer, initialState);

  const getOrderLine = async (company, orderId) => {
    try {
      const token = await AsyncStorage.getItem("@msalToken");
      let localUrl =
        baseUrl +
        "api/OrderLine/get?company=" +
        company +
        "&orderId=" +
        orderId;
      const response1 = await fetch(localUrl, {
        headers: token ? { "Authorization": `Bearer ${token}` } : undefined,
      });
      if (response1.status === 200) {
        const data = await response1.json();
        dispatch({
          type: ORDERLINE.ORDERLINE,
          payload: { data: data, loading: false, update: false },
        });
      }
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
    }
  };
  const getDocumentation = async (company, recId, recIdOV) => {
    try {
      const token = await AsyncStorage.getItem("@msalToken");
      let localUrl =
        baseUrl +
        "api/Document/get?company=" +
        company +
        "&recId=" +
        recId +
        "&recIdOV=" +
        recIdOV;
      const response1 = await fetch(localUrl, {
        headers: token ? { "Authorization": `Bearer ${token}` } : undefined,
      });
      if (response1.status === 200) {
        const data = await response1.json();
        data.sort((a, b) => {
          return b.mandatory - a.mandatory;
        });
        dispatch({
          type: ORDERLINE.DOCUMENTATION,
          payload: { data: data, loading: false, update: false },
        });
      }
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
    }
  };
  const getBase64Doc = async (document) => {
    try {
      const token = await AsyncStorage.getItem("@msalToken");
      let localUrl = baseUrl + "api/Document/base64";
      const response1 = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(document),
      });
      if (response1.status === 200) {
        const data = await response1.json();
        return data.base64;
      }
      return "";
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
      return "";
    }
  };
  const postSPDocumentation = async (dataSP) => {
    try {
      const token = await AsyncStorage.getItem("@msalToken");
      let localUrl = baseUrl + "api/Document/postSP";
      const response = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(dataSP),
      });
      if (response.status === 200) {
        const data = await response.json();
        if (data && data[0] && data[0].url) {
          return data[0].url;
        }
        return "";
      }
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
      return "";
    }
  };
  const postNewSPDocumentation = async (dataSP) => {
    try {
      const token = await AsyncStorage.getItem("@msalToken");
      let resp = "";
      let localUrl = baseUrl + "api/Document";
      let response = await fetch(localUrl, {
        method: "POST",
        body: dataSP,
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      });
      if (response.status === 200) {
        resp = await response.text();
      }
      return resp;
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
      return "";
    }
  };
  const postAXDocumentation = async (dataSend, company) => {
    try {
      const token = await AsyncStorage.getItem("@msalToken");
      let ret = 0;
      let localUrl = baseUrl + "api/Document/postAX?company=" + company;
      const response = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(dataSend),
      });
      if (response.status === 200) {
        const data = await response.json();
        if (data && data > 0) {
          localUrl =
            baseUrl +
            "api/Document/update?company=" +
            company +
            "&recIdDocument=" +
            dataSend.recIdRecord +
            "&status=1&attachRecId=" +
            data;
          const response2 = await fetch(localUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            },
          });
          if (response2.status === 200) {
            ret = await response2.json();
          }
        }
      }
      return ret;
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
      return 0;
    }
  };
  const postAXUpdateDocumentation = async (
    company,
    recIdDocument,
    status,
    attachRecId
  ) => {
    try {
      const token = await AsyncStorage.getItem("@msalToken");
      let ret = 0;
      let localUrl =
        baseUrl +
        "api/Document/update?company=" +
        company +
        "&recIdDocument=" +
        recIdDocument +
        "&status=" +
        status +
        "&attachRecId=" +
        attachRecId;
      const response2 = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      });
      if (response2.status === 200) {
        ret = await response2.json();
      }
      return ret;
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
      return 0;
    }
  };
  const postPanicNotification = async (company, comment) => {
    try {
      const token = await AsyncStorage.getItem("@msalToken");
      if (comment === "") {
        comment = "n/a";
      }
      const firstOrderLine =
        state.orderLines && state.orderLines.length > 0
          ? state.orderLines[0]
          : null;
      if (!firstOrderLine) {
        alert("No hay líneas de orden disponibles.");
        return;
      }
      const data = {
        salesOrderId: firstOrderLine.salesOrderId,
        recIdOV: firstOrderLine.recIdOV,
        comment: comment,
      };
      let localUrl =
        baseUrl +
        "api/Notification/postSendPanicEmail?emailId=" +
        emailPanicNotification +
        "&company=" +
        company;
      const response = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      dispatch({
        type: ORDERLINE.LOADING,
        payload: false,
      });
      return await response.json();
    } catch (error) {
      alert("Error al enviar la notificación de pánico. " + error);
    }
  };
  const deleteSPDocumentation = async (url) => {
    try {
      const token = await AsyncStorage.getItem("@msalToken");
      let resp = false;
      let localUrl = baseUrl + "api/Document/delete";
      let response = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(url),
      });
      if (response.status === 200) {
        resp = await response.json();
      }
      return resp;
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
      return "";
    }
  };
  const setOrderLine = useCallback((value) => {
    dispatch({
      type: ORDERLINE.SETORDERLINE,
      payload: value,
    });
  }, []);
  const setDocuments = useCallback((value) => {
    dispatch({
      type: ORDERLINE.SETDOCUMENTATION,
      payload: value,
    });
  }, []);
  const setloading = useCallback((value) => {
    dispatch({
      type: ORDERLINE.LOADING,
      payload: value,
    });
  }, []);
  const setUpdate = useCallback((value) => {
    dispatch({
      type: ORDERLINE.UPDATE,
      payload: value,
    });
  }, []);

  return (
    <OrderLineContext.Provider
      value={{
        //fields
        orderLines: state.orderLines,
        loading: state.loading,
        update: state.update,
        orderLineStates: state.orderLineStates,
        documents: state.documents,
        //functions set
        setOrderLine,
        setDocuments,
        setloading,
        setUpdate,
        //functions get
        getOrderLine,
        getDocumentation,
        getBase64Doc,
        //functions post
        postPanicNotification,
        postSPDocumentation,
        postNewSPDocumentation,
        postAXDocumentation,
        postAXUpdateDocumentation,
        //functions delete
        deleteSPDocumentation,
      }}
    >
      {props.children}
    </OrderLineContext.Provider>
  );
};

export default OrderLineState;
