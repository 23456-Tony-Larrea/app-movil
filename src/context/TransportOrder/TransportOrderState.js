import React, { useCallback, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransportOrderReducer } from "./TransportOrderReducer";
import { TransportOrderContext } from "./TransportOrderContext";
import { baseUrl } from "../../constants/config";
import { TRANSPORTORDER } from "../Types/types";
import { getUserOid } from "../../utils/oidUtils";

const TransportOrderState = (props) => {
  const initialState = {
    company: "li",
    update: false,
    error: false,
    transportOrders: [],
    transportOrder: {},
    orderLines: {}, // Estado para las OV vinculadas por recId
    vendorRuc: null,
    loading: false,
    orderState: "2",
    orderStates: [
      { label: "Pendiente", value: "0" },
      { label: "Verificado", value: "2" },
      { label: "Entregado", value: "3" },
    ],
  };

  const [state, dispatch] = useReducer(TransportOrderReducer, initialState);

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

  const getVendorInformation = async () => {
    try {
      const userOid = await getUserOid();
      
      if (!userOid) {
        return null;
      }

      const localUrl = `https://appentregas.life.com.ec/api/VendorInformation/get?localAccountGuId=${userOid}`;
      
      const headers = await createAuthHeaders();
      
      const response = await fetch(localUrl, {
        method: "GET",
        headers: headers,
      });
      
      if (response.status === 200) {
        const vendorData = await response.json();
        
        // Extraer solo el RUC y guardarlo en el estado
        if (vendorData && vendorData.ruc) {
          dispatch({
            type: TRANSPORTORDER.VENDORRUC,
            payload: vendorData.ruc,
          });
          return vendorData.ruc;
        }
        
        return null;
      } else {
        return null;
      }
    } catch (error) {
      dispatch({
        type: TRANSPORTORDER.ERROR,
        payload: true,
      });
      return null;
    }
  };

  const getOrderLinesByOrderId = async (company, orderId, recId) => {
    try {
      const localUrl = `https://appentregas.life.com.ec/api/OrderLine/get?company=${company}&orderId=${orderId}`;
      
      const headers = await createAuthHeaders();
      
      const response = await fetch(localUrl, {
        method: "GET",
        headers: headers,
      });
      
      if (response.status === 200) {
        const orderLinesData = await response.json();
        
        // Guardar las OV usando el recId como clave para el mapeo
        dispatch({
          type: TRANSPORTORDER.ORDERLINES,
          payload: { recId, orderLines: orderLinesData },
        });
        
        return orderLinesData;
      } else {
        return null;
      }
    } catch (error) {
      dispatch({
        type: TRANSPORTORDER.ERROR,
        payload: true,
      });
      return null;
    }
  };

  const getTransportOrders = async (status, startPosition, numOfRecords) => {
    try {
      // Usar el RUC del vendedor o un valor por defecto
      const vendAccountNum = state.vendorRuc || "1792464463001";
      
      let localUrl =
        baseUrl +
        "api/TransportOrder/get?company=" +
        state.company +
        "&vendAccountNum=" + vendAccountNum;
      
      if (status) {
        localUrl = localUrl + "&status=" + status;
      }
      if (startPosition) {
        localUrl = localUrl + "&startPosition=" + startPosition;
      }
      if (numOfRecords) {
        localUrl = localUrl + "&numOfRecords=" + numOfRecords;
      }
      
      const headers = await createAuthHeaders();
      
      const response1 = await fetch(localUrl, {
        method: "GET",
        headers: headers,
      });
      
      if (response1.status === 200) {
        const data = await response1.json();
        dispatch({
          type: TRANSPORTORDER.TRANSPORTORDER,
          payload: { data: data, loading: false, update: false },
        });
      }
    } catch (error) {
      dispatch({
        type: TRANSPORTORDER.ERROR,
        payload: true,
      });
      alert("Ups! encontramos un error al cargar los datos: " + error);
    }
  };
  const postTransportOrderChecker = async (orderId) => {
    try {
      let resp = false;
      const postData = {
        company: state.company,
        orderId: orderId,
        checkerName: "Pruebas desarrollo",
      };
      
      let localUrl =
        baseUrl + "api/TransportOrder/checker?company=" + state.company;
      
      const headers = await createAuthHeaders({
        "Content-Type": "application/json",
      });
      
      const response = await fetch(localUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(postData),
      });
      
      if (response.status === 200) {
        const data = await response.json();
        resp = data;
      }
      
      dispatch({
        type: TRANSPORTORDER.LOADING,
        payload: false,
      });
      return resp;
    } catch (error) {
      dispatch({
        type: TRANSPORTORDER.LOADING,
        payload: false,
      });
      alert("Ups! encontramos un error al cargar los datos: " + error);
      return false;
    }
  };
  const postCheckDelivered = async (dataSend, sendEmail) => {
    try {
      let resp = false;
      let localUrl =
        baseUrl + "api/TransportOrder/checkerDelivery?sendEmail=" + sendEmail;
      
      const headers = await createAuthHeaders({
        "Content-Type": "application/json",
      });

      const response = await fetch(localUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(dataSend),
      });
      
      if (response.status === 200) {
        resp = await response.json();
      }
      
      return resp;
    } catch (error) {
      alert("Hubo un error al cargar los datos: " + error);
      return false;
    }
  };
  const setloading = useCallback((value) => {
    dispatch({
      type: TRANSPORTORDER.LOADING,
      payload: value,
    });
  }, []);
  const setCompany = useCallback((value) => {
    dispatch({
      type: TRANSPORTORDER.COMPANY,
      payload: value,
    });
  }, []);
  const setCurrentCompany = async (value) => {
    // let localUrl =
    //   // "https://appentregas.life.com.ec/api/TransportOrder/get?company=li&vendAccountNum=1792464463001&status=3";
    //   "https://lisvdsewe.life.com.ec:4401/api/TransportOrder/get?company=li&vendAccountNum=1792464463001&status=3";
    // // baseUrl +
    // // "api/TransportOrder/get?company=li&vendAccountNum=1792464463001&status=2";
    // const response1 = await fetch(localUrl);
    // if (response1.status === 200) {
    //   const data = await response1.json();
    //   dispatch({
    //     type: TRANSPORTORDER.TRANSPORTORDER,
    //     payload: value,
    //   });
    // }
    try {
      await AsyncStorage.setItem("@storageCompany", value);
      dispatch({
        type: TRANSPORTORDER.COMPANY,
        payload: value,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const setOrderState = useCallback((value) => {
    dispatch({
      type: TRANSPORTORDER.ORDERSTATE,
      payload: value,
    });
  }, []);
  const setUpdate = useCallback((value) => {
    dispatch({
      type: TRANSPORTORDER.UPDATE,
      payload: value,
    });
  }, []);
  const setTransportOrder = useCallback((value) => {
    dispatch({
      type: TRANSPORTORDER.SETTRANSPORTORDER,
      payload: value,
    });
  }, []);
  const getOrderLinesForRecId = useCallback((recId) => {
    const result = state.orderLines[recId] || [];
    return result;
  }, [state.orderLines]);

  const clearOrderLines = useCallback(() => {
    dispatch({
      type: TRANSPORTORDER.ORDERLINES,
      payload: { recId: 'CLEAR_ALL', orderLines: {} },
    });
  }, []);

  const getCurrentCompany = async () => {
    try {
      const value = await AsyncStorage.getItem("@storageCompany");
      if (value !== undefined) {
        return value;
      }
    } catch (e) {
      console.log(e);
    }

    // dispatch({
    //   type: TRANSPORTORDER.COMPANY,
    //   payload: value2,
    // });
    // return state.company;
  };

  return (
    <TransportOrderContext.Provider
      value={{
        //fields
        company: state.company,
        transportOrders: state.transportOrders,
        transportOrder: state.transportOrder,
        orderLines: state.orderLines,
        vendorRuc: state.vendorRuc,
        error: state.error,
        loading: state.loading,
        orderState: state.orderState,
        orderStates: state.orderStates,
        update: state.update,
        //functions set
        setCompany,
        setCurrentCompany,
        setTransportOrder,
        setloading,
        setOrderState,
        setUpdate,
        clearOrderLines,
        //functions get
        getTransportOrders,
        getVendorInformation,
        getOrderLinesByOrderId,
        getOrderLinesForRecId,
        getCurrentCompany,
        //functions post
        postTransportOrderChecker,
        postCheckDelivered,
      }}
    >
      {props.children}
    </TransportOrderContext.Provider>
  );
};

export default TransportOrderState;
