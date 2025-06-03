import React, { useCallback, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransportOrderReducer } from "./TransportOrderReducer";
import { TransportOrderContext } from "./TransportOrderContext";
import { baseUrl } from "../../constants/config";
import { TRANSPORTORDER } from "../Types/types";
// MSAL imports

const TransportOrderState = (props) => {
  const initialState = {
    company: "li",
    update: false,
    error: false,
    transportOrders: [],
    transportOrder: {},
    loading: false,
    orderState: "2",
    orderStates: [
      { label: "Pendiente", value: "0" },
      { label: "Verificado", value: "2" },
      { label: "Entregado", value: "3" },
    ],
  };

  const [state, dispatch] = useReducer(TransportOrderReducer, initialState);

  const getTransportOrders = async (status, startPosition, numOfRecords) => {
    // --- MOCK DATA INJECTION FOR DEVELOPMENT ---
    const mockOrders = [
      {
        orderId: "ORD001",
        date: "2024-06-01T10:00:00Z",
        status: "0",
        deliveryDate: "2024-06-05T15:00:00Z",
        customer: "Cliente A",
        description: "Entrega de productos A",
      },
      {
        orderId: "ORD002",
        date: "2024-06-02T11:00:00Z",
        status: "2",
        deliveryDate: "2024-06-06T16:00:00Z",
        customer: "Cliente B",
        description: "Entrega de productos B",
      },
      {
        orderId: "ORD003",
        date: "2024-06-03T12:00:00Z",
        status: "3",
        deliveryDate: "2024-06-07T17:00:00Z",
        customer: "Cliente C",
        description: "Entrega de productos C",
      },
      {
        orderId: "ORD004",
        date: "2024-06-04T13:00:00Z",
        status: "0",
        deliveryDate: "2024-06-08T18:00:00Z",
        customer: "Cliente D",
        description: "Entrega de productos D",
      },
      {
        orderId: "ORD005",
        date: "2024-06-05T14:00:00Z",
        status: "2",
        deliveryDate: "2024-06-09T19:00:00Z",
        customer: "Cliente E",
        description: "Entrega de productos E",
      },
    ];
    dispatch({
      type: TRANSPORTORDER.TRANSPORTORDER,
      payload: { data: mockOrders, loading: false, update: false },
    });
    // --- END MOCK DATA ---
    // If you want to restore real API fetching, comment out the above and uncomment the code below.
    /*
    try {
      console.log(state.company);
      let localUrl =
        baseUrl +
        "api/TransportOrder/get?company=" +
        state.company +
        "&vendAccountNum=1792464463001";
      if (status) {
        localUrl = localUrl + "&status=" + status;
      }
      if (startPosition) {
        localUrl = localUrl + "&startPosition=" + startPosition;
      }
      if (numOfRecords) {
        localUrl = localUrl + "&numOfRecords=" + numOfRecords;
      }
      const response1 = await fetch(localUrl);
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
    */
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
      const response = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      const response = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSend),
      });
      if (response.status === 200) {
        resp = await response.json();
        console.log(resp);
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
        //functions get
        getTransportOrders,
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
