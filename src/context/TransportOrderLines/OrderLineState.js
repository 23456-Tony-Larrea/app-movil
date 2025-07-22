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
      console.log("=== getMSALToken ===");
      const token = await AsyncStorage.getItem("@msalToken");
      console.log("Token desde AsyncStorage:", token ? "ENCONTRADO" : "NO ENCONTRADO");
      if (token) {
        console.log("Token preview:", `${token.substring(0, 50)}...`);
      }
      return token;
    } catch (error) {
      console.error("Error obteniendo token MSAL:", error);
      return null;
    }
  };

  // Función auxiliar para crear headers con Bearer token
  const createAuthHeaders = async (additionalHeaders = {}) => {
    const token = await getMSALToken();
    console.log("=== createAuthHeaders ===");
    console.log("Token obtenido:", token ? `${token.substring(0, 50)}...` : "NULL");
    console.log("Additional headers:", additionalHeaders);
    
    const headers = {
      ...additionalHeaders,
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("WARNING: No se encontró token MSAL");
    }
    
    console.log("Headers finales:", Object.keys(headers));
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
      console.log("=== INICIO getDocumentation ===");
      console.log("Parámetros recibidos:");
      console.log("- company:", company);
      console.log("- recId:", recId);
      console.log("- recIdOV:", recIdOV);
      
      let localUrl =
        baseUrl +
        "api/Document/get?company=" +
        company +
        "&recId=" +
        recId +
        "&recIdOV=" +
        recIdOV;
      
      console.log("URL completa:", localUrl);
      console.log("baseUrl:", baseUrl);
      
      const headers = await createAuthHeaders();
      console.log("Headers preparados para GET:", Object.keys(headers));
      
      console.log("Enviando request GET a Document/get...");
      const response1 = await fetch(localUrl, {
        method: "GET",
        headers: headers,
      });
      
      console.log("Response status:", response1.status);
      console.log("Response headers:", response1.headers);
      
      if (response1.status === 200) {
        const data = await response1.json();
        console.log("Datos recibidos de Document/get:");
        console.log("- Tipo de datos:", typeof data);
        console.log("- Es array:", Array.isArray(data));
        console.log("- Longitud:", data?.length || 0);
        console.log("- Datos completos:", data);
        
        if (data && Array.isArray(data)) {
          console.log("Ordenando datos por mandatory...");
          data.sort((a, b) => {
            return b.mandatory - a.mandatory;
          });
          console.log("Datos después del sort:", data);
        }

        console.log("Enviando datos al dispatch...");
        dispatch({
          type: ORDERLINE.DOCUMENTATION,
          payload: { data: data, loading: false, update: false },
        });
        
        console.log("Dispatch completado para ORDERLINE.DOCUMENTATION");
        console.log("=== FIN getDocumentation - ÉXITO ===");
      } else {
        console.error("Error en Document/get, status:", response1.status);
        const errorText = await response1.text();
        console.error("Error response text:", errorText);
        console.log("=== FIN getDocumentation - ERROR ===");
      }
    } catch (error) {
      console.error("=== ERROR en getDocumentation ===");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Error completo:", error);
      alert("Ups! encontramos un error al cargar los datos: " + error);
      console.log("=== FIN getDocumentation - EXCEPCIÓN ===");
    }
  };
  const getBase64Doc = async (document) => {
    try {
      console.log("=== INICIO getBase64Doc ===");
      console.log("Document recibido:", document);
      console.log("Document type:", typeof document);
      console.log("Document keys:", document ? Object.keys(document) : "NULL");
      
      let localUrl = baseUrl + "api/Document/base64";
      console.log("URL para getBase64Doc:", localUrl);
      
      const headers = await createAuthHeaders({
        "Content-Type": "application/json",
      });
      console.log("Headers preparados:", Object.keys(headers));
      
      console.log("Enviando request POST a Document/base64...");
      const response1 = await fetch(localUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(document),
      });
      
      console.log("Response status:", response1.status);
      
      if (response1.status === 200) {
        const data = await response1.json();
        console.log("Response data type:", typeof data);
        console.log("Response data keys:", data ? Object.keys(data) : "NULL");
        console.log("Response data.base64 exists:", data && data.base64 ? "YES" : "NO");
        if (data && data.base64) {
          console.log("Base64 length:", data.base64.length);
          console.log("Base64 preview:", data.base64.substring(0, 100) + "...");
        }
        console.log("=== FIN getBase64Doc - ÉXITO, retornando base64 ===");
        return data.base64;
      } else {
        console.error("Error en Document/base64, status:", response1.status);
        const errorText = await response1.text();
        console.error("Error response text:", errorText);
        console.log("=== FIN getBase64Doc - ERROR, retornando string vacío ===");
        return "";
      }
    } catch (error) {
      console.error("=== ERROR en getBase64Doc ===");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Error completo:", error);
      alert("Ups! encontramos un error al cargar los datos: " + error);
      console.log("=== FIN getBase64Doc - EXCEPCIÓN, retornando string vacío ===");
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
      console.log("=== INICIO postNewSPDocumentation ===");
      console.log("Datos JSON recibidos:", dataJSON);
      
      let resp = "";
      let localUrl = baseUrl + "api/Document/postSP";
      console.log("URL para postNewSPDocumentation:", localUrl);
      
      const headers = await createAuthHeaders({
        "Content-Type": "application/json",
      });
      console.log("Headers preparados:", headers);
      
      console.log("Enviando request a SP Documentation...");
      let response = await fetch(localUrl, {
        method: "POST",
        body: JSON.stringify(dataJSON),
        headers: headers,
      });
      
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("Respuesta exitosa de SP Documentation:", jsonResponse);
        // Como enviamos un array directamente, la respuesta también debería ser un array
        if (jsonResponse && Array.isArray(jsonResponse) && 
            jsonResponse.length > 0 && jsonResponse[0].url) {
          resp = jsonResponse[0].url;
        } else if (jsonResponse && jsonResponse.listAttachments && 
                   Array.isArray(jsonResponse.listAttachments) &&
                   jsonResponse.listAttachments.length > 0 && 
                   jsonResponse.listAttachments[0].url) {
          // Fallback: por si acaso viene envuelto
          resp = jsonResponse.listAttachments[0].url;
        }
      } else {
        console.error("Error en SP Documentation, status:", response.status);
        const errorText = await response.text();
        console.error("Error response text:", errorText);
      }
      
      console.log("=== FIN postNewSPDocumentation, retornando:", resp);
      return resp;
    } catch (error) {
      console.error("=== ERROR en postNewSPDocumentation ===");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Error completo:", error);
      alert("Ups! encontramos un error al cargar los datos: " + error);
      return "";
    }
  };
  const postAXDocumentation = async (dataSendArray, company) => {
    try {
      console.log("=== INICIO postAXDocumentation ===");
      console.log("Datos array para AX:", dataSendArray);
      console.log("Company:", company);
      
      let ret = 0;
      let localUrl = baseUrl + "api/Document/postAX?company=" + company;
      console.log("URL para postAXDocumentation:", localUrl);
      
      const headers = await createAuthHeaders({
        "Content-Type": "application/json",
      });
      console.log("Headers preparados:", headers);
      
      console.log("Enviando primera request a AX Documentation...");
      const response = await fetch(localUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(dataSendArray), // ✅ CORRECTO: Enviar el array directamente
      });
      
      console.log("Primera response status:", response.status);
      
      if (response.status === 200) {
        const data = await response.json();
        console.log("Primera response data:", data);
        
        if (data && data > 0) {
          console.log("Data válida, enviando segunda request para update...");
          // Usar el primer elemento del array para el update
          const firstAttachment = dataSendArray[0];
          localUrl =
            baseUrl +
            "api/Document/update?company=" +
            company +
            "&recIdDocument=" +
            firstAttachment.recIdRecord +
            "&status=1&attachRecId=" +
            data;
          
          console.log("URL para update:", localUrl);
          
          const headers2 = await createAuthHeaders({
            "Content-Type": "application/json",
          });
          
          const response2 = await fetch(localUrl, {
            method: "POST",
            headers: headers2,
          });
          
          console.log("Segunda response status:", response2.status);
          
          if (response2.status === 200) {
            ret = await response2.json();
            console.log("Segunda response data:", ret);
          } else {
            console.error("Error en segunda request, status:", response2.status);
            const errorText = await response2.text();
            console.error("Error text:", errorText);
          }
        } else {
          console.error("Primera response data no válida:", data);
        }
      } else {
        console.error("Error en primera request, status:", response.status);
        const errorText = await response.text();
        console.error("Error text:", errorText);
      }
      
      console.log("=== FIN postAXDocumentation, retornando:", ret);
      return ret;
    } catch (error) {
      console.error("=== ERROR en postAXDocumentation ===");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Error completo:", error);
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
      let localUrl = baseUrl + "api/Document/delete";
      
      const headers = await createAuthHeaders({
        "Content-Type": "application/json",
      });
      
      let response = await fetch(localUrl, {
        method: "POST",
        headers: headers,
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
