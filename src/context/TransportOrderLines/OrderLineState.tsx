import React, { useCallback, useReducer, ReactNode } from "react";
import { OrderLineContext } from "./OrderLineContext";
import { baseUrl, emailPanicNotification } from "../../constants/config";
import { ORDERLINE } from "../Types/Types";
import { OrderLineReducer } from "./OrderLineReducer";

// Define el tipo para los estados de las líneas de pedido
interface OrderLineState {
  label: string;
  value: string;
}

// Define el tipo para el estado del contexto
interface OrderLineStateType {
  orderLines: any[];
  documents: any[];
  loading: boolean;
  update: boolean;
  orderLineStates: OrderLineState[]; // Ya no es opcional
}

// Define las props para el componente
interface OrderLineStateProps {
  children: ReactNode;
}

const OrderLineState: React.FC<OrderLineStateProps> = (props) => {
  const initialState: OrderLineStateType = {
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

  const getOrderLine = async (company: string, orderId: string) => {
    try {
      const localUrl = `${baseUrl}api/OrderLine/get?company=${company}&orderId=${orderId}`;
      const response1 = await fetch(localUrl);
      if (response1.status === 200) {
        const data = await response1.json();
        dispatch({
          type: ORDERLINE.ORDERLINE,
          payload: { data, loading: false, update: false },
        });
      }
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
    }
  };

  const getDocumentation = async (company: string, recId: string, recIdOV: string) => {
    try {
      const localUrl = `${baseUrl}api/Document/get?company=${company}&recId=${recId}&recIdOV=${recIdOV}`;
      const response1 = await fetch(localUrl);
      if (response1.status === 200) {
        const data = await response1.json();
        data.sort((a: any, b: any) => b.mandatory - a.mandatory);
        dispatch({
          type: ORDERLINE.DOCUMENTATION,
          payload: { data, loading: false, update: false },
        });
      }
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
    }
  };

  const getBase64Doc = async (document: any): Promise<string> => {
    try {
      const localUrl = `${baseUrl}api/Document/base64`;
      const response1 = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  const postSPDocumentation = async (dataSP: any): Promise<string> => {
    try {
      const localUrl = `${baseUrl}api/Document/postSP`;
      const response = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      return "";
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
      return "";
    }
  };

  const postNewSPDocumentation = async (dataSP: FormData): Promise<string> => {
    try {
      let resp = "";
      const localUrl = `${baseUrl}api/Document`;
      const response = await fetch(localUrl, {
        method: "POST",
        body: dataSP,
        headers: {
          "Content-Type": "multipart/form-data",
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

  const postAXDocumentation = async (dataSend: any, company: string): Promise<number> => {
    try {
      let ret = 0;
      const localUrl = `${baseUrl}api/Document/postAX?company=${company}`;
      const response = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSend),
      });
      if (response.status === 200) {
        const data = await response.json();
        if (data && data > 0) {
          const updateUrl = `${baseUrl}api/Document/update?company=${company}&recIdDocument=${dataSend.recIdRecord}&status=1&attachRecId=${data}`;
          const response2 = await fetch(updateUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
    company: string,
    recIdDocument: string,
    status: number,
    attachRecId: number
  ): Promise<number> => {
    try {
      let ret = 0;
      const localUrl = `${baseUrl}api/Document/update?company=${company}&recIdDocument=${recIdDocument}&status=${status}&attachRecId=${attachRecId}`;
      const response2 = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  const postPanicNotification = async (company: string, comment: string): Promise<any> => {
    try {
      if (comment === "") {
        comment = "n/a";
      }
      const data = {
        salesOrderId: state.orderLines[0]?.salesOrderId,
        recIdOV: state.orderLines[0]?.recIdOV,
        comment,
      };
      const localUrl = `${baseUrl}api/Notification/postSendPanicEmail?emailId=${emailPanicNotification}&company=${company}`;
      const response = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  const deleteSPDocumentation = async (url: string): Promise<boolean> => {
    try {
      let resp = false;
      const localUrl = `${baseUrl}api/Document/delete`;
      const response = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(url),
      });
      if (response.status === 200) {
        resp = await response.json();
      }
      return resp;
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
      return false;
    }
  };

  const setOrderLine = useCallback((value: any[]) => {
    dispatch({
      type: ORDERLINE.SETORDERLINE,
      payload: value,
    });
  }, []);

  const setDocuments = useCallback((value: any[]) => {
    dispatch({
      type: ORDERLINE.SETDOCUMENTATION,
      payload: value,
    });
  }, []);

  const setloading = useCallback((value: boolean) => {
    dispatch({
      type: ORDERLINE.LOADING,
      payload: value,
    });
  }, []);

  const setUpdate = useCallback((value: boolean) => {
    dispatch({
      type: ORDERLINE.UPDATE,
      payload: value,
    });
  }, []);

  return (
    <OrderLineContext.Provider
      value={{
        orderLines: state.orderLines,
        loading: state.loading,
        update: state.update,
        orderLineStates: state.orderLineStates,
        documents: state.documents,
        setOrderLine,
        setDocuments,
        setloading,
        setUpdate,
        getOrderLine,
        getDocumentation,
        getBase64Doc,
        postPanicNotification,
        postSPDocumentation,
        postNewSPDocumentation,
        postAXDocumentation,
        postAXUpdateDocumentation,
        deleteSPDocumentation,
      }}
    >
      {props.children}
    </OrderLineContext.Provider>
  );
};

export default OrderLineState;