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

  // Función auxiliar para obtener el token MSAL
  const getMSALToken = async () => {
    try {
      const token = await AsyncStorage.getItem("@msalToken");
      return token;
    } catch (error) {
      return null;
    }
  };

  // Función auxiliar para crear headers con Bearer token
  const createAuthHeaders = async (additionalHeaders = {}) => {
    const token = await getMSALToken();
    
    const headers = {
      ...additionalHeaders,
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    return headers;
  };

  const getOrderLine = async (company, orderId) => {
    try {
      let localUrl =
        baseUrl +
        "api/OrderLine/get?company=" +
        company +
        "&orderId=" +
        orderId;
      
      const headers = await createAuthHeaders();
      
      const response1 = await fetch(localUrl, {
        method: "GET",
        headers: headers,
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
      let localUrl =
        baseUrl +
        "api/Document/get?company=" +
        company +
        "&recId=" +
        recId +
        "&recIdOV=" +
        recIdOV;
      
      const headers = await createAuthHeaders();
      
      const response1 = await fetch(localUrl, {
        method: "GET",
        headers: headers,
      });
      
      if (response1.status === 200) {
        const data = await response1.json();
        
        if (data && Array.isArray(data)) {
          data.sort((a, b) => {
            return b.mandatory - a.mandatory;
          });
        }

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
    let localUrl = baseUrl + "api/Document/base64";
    
    const headers = await createAuthHeaders({
      "Content-Type": "application/json",
    });
    
    const response1 = await fetch(localUrl, {
      method: "POST",
      headers: headers,
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
      let localUrl = baseUrl + "api/Document/postSP";
      
      const headers = await createAuthHeaders({
        "Content-Type": "application/json",
      });

      const response = await fetch(localUrl, {
        method: "POST",
        headers: headers,
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
  const postNewSPDocumentation = async (dataJSON) => {
    try {
      let resp = "";
      let localUrl = baseUrl + "api/Document/postSP";
      
      const headers = await createAuthHeaders({
        "Content-Type": "application/json",
      });
      
      let response = await fetch(localUrl, {
        method: "POST",
        body: JSON.stringify(dataJSON),
        headers: headers,
      });
      
      if (response.status === 200) {
        const jsonResponse = await response.json();
        if (jsonResponse && Array.isArray(jsonResponse) && 
            jsonResponse.length > 0 && jsonResponse[0].url) {
          resp = jsonResponse[0].url;
        } else if (jsonResponse && jsonResponse.listAttachments && 
                   Array.isArray(jsonResponse.listAttachments) &&
                   jsonResponse.listAttachments.length > 0 && 
                   jsonResponse.listAttachments[0].url) {
          resp = jsonResponse.listAttachments[0].url;
        }
      }
      
      return resp;
    } catch (error) {
      alert("Ups! encontramos un error al cargar los datos: " + error);
      return "";
    }
  };
  const postAXDocumentation = async (dataSendArray, company) => {
    try {
      let ret = 0;
      let localUrl = baseUrl + "api/Document/postAX?company=" + company;
      
      const headers = await createAuthHeaders({
        "Content-Type": "application/json",
      });
      
      const response = await fetch(localUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(dataSendArray),
      });
      
      if (response.status === 200) {
        const data = await response.json();
        
        if (data && data > 0) {
          const firstAttachment = dataSendArray[0];
          localUrl =
            baseUrl +
            "api/Document/update?company=" +
            company +
            "&recIdDocument=" +
            firstAttachment.recIdRecord +
            "&status=1&attachRecId=" +
            data;
          
          const headers2 = await createAuthHeaders({
            "Content-Type": "application/json",
          });
          
          const response2 = await fetch(localUrl, {
            method: "POST",
            headers: headers2,
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
      
      const headers = await createAuthHeaders({
        "Content-Type": "application/json",
      });
      
      const response2 = await fetch(localUrl, {
        method: "POST",
        headers: headers,
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
      if (comment === "") {
        comment = "n/a";
      }
      const data = {
        salesOrderId: state.orderLines[0].salesOrderId,
        recIdOV: state.orderLines[0].recIdOV,
        comment: comment,
      };
      let localUrl =
        baseUrl +
        "api/Notification/postSendPanicEmail?emailId=" +
        emailPanicNotification +
        "&company=" +
        company;
      
      const headers = await createAuthHeaders({
        "Content-Type": "application/json",
      });
      
      const response = await fetch(localUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });
      
      dispatch({
        type: ORDERLINE.LOADING,
        payload: false,
      });
      
      if (response.status === 200) {
        const result = await response.json();
        return result;
      } else {
        return null;
      }
    } catch (error) {
      alert("Error al enviar la notificación de pánico. " + error);
    }
  };
 const deleteSPDocumentation = async (url) => {
  try {
    let resp = false;
    
    const headers = await createAuthHeaders({
      "Content-Type": "application/json",
    });
    
    let response = await fetch(url, {
      method: "GET",
      headers: headers,
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
