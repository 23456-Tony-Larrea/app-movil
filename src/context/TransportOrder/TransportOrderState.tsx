import React, { useCallback, useReducer, ReactNode } from "react";
import { MMKV } from "react-native-mmkv";
import { TransportOrderReducer } from "./TransportOrderReducer";
import { TransportOrderContext } from "./TransportOrderContext";
import { baseUrl } from "../../constants/config";
import { TRANSPORTORDER } from "../Types/Types";

// Define types for the state
interface TransportOrderStateType {
  company: string;
  update: boolean;
  error: boolean;
  transportOrders: any[]; // Replace `any` with the specific type of transport orders if available
  transportOrder: Record<string, any>; // Replace `any` with the specific type if available
  loading: boolean;
  orderState: string;
  orderStates: { label: string; value: string }[];
}

// Define types for the context
export interface TransportOrderContextType extends TransportOrderStateType {
  setCompany: (value: string) => void;
  setCurrentCompany: (value: string) => Promise<void>;
  setTransportOrder: (value: any) => void; // Replace `any` with the specific type if available
  setloading: (value: boolean) => void;
  setOrderState: (value: string) => void;
  setUpdate: (value: boolean) => void;
  getTransportOrders: (status?: string, startPosition?: number, numOfRecords?: number) => Promise<void>;
  getCurrentCompany: () => Promise<string | undefined>;
  postTransportOrderChecker: (orderId: string) => Promise<boolean>;
  postCheckDelivered: (dataSend: any, sendEmail:number) => Promise<boolean>;
}

// Define props for the provider
interface TransportOrderProviderProps {
  children: ReactNode;
}

const storage = new MMKV();

const TransportOrderState: React.FC<TransportOrderProviderProps> = ({ children }) => {
  const initialState: TransportOrderStateType = {
    company: "li",
    update: false,
    error: false,
    transportOrders: [],
    transportOrder: {},
    loading: false,
    orderState: "3",
    orderStates: [
      { label: "Pendiente", value: "0" },
      { label: "Verificado", value: "2" },
      { label: "Entregado", value: "3" },
    ],
  };

  const [state, dispatch] = useReducer(TransportOrderReducer, initialState);

  const getTransportOrders = async (status?: string, startPosition?: number, numOfRecords?: number) => {
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
        console.log("holi",data.json());
      }
    } catch (error) {
      dispatch({
        type: TRANSPORTORDER.ERROR,
        payload: true,
      });
      alert("Ups! encontramos un error al cargar los datos: " + error);
    }
  };

  const postTransportOrderChecker = async (orderId: string): Promise<boolean> => {
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

  const postCheckDelivered = async (dataSend: any, sendEmail: number): Promise<boolean> => {
    try {
      let resp = false;
      let localUrl = baseUrl + "api/TransportOrder/checkerDelivery?sendEmail=" + sendEmail;
  
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
  

  const setloading = useCallback((value: boolean) => {
    dispatch({
      type: TRANSPORTORDER.LOADING,
      payload: value,
    });
  }, []);

  const setCompany = useCallback((value: string) => {
    dispatch({
      type: TRANSPORTORDER.COMPANY,
      payload: value,
    });
  }, []);

  const setCurrentCompany = async (value: string) => {
    try {
      storage.set("@storageCompany", value);
      dispatch({
        type: TRANSPORTORDER.COMPANY,
        payload: value,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const setOrderState = useCallback((value: string) => {
    dispatch({
      type: TRANSPORTORDER.ORDERSTATE,
      payload: value,
    });
  }, []);

  const setUpdate = useCallback((value: boolean) => {
    dispatch({
      type: TRANSPORTORDER.UPDATE,
      payload: value,
    });
  }, []);

  const setTransportOrder = useCallback((value: any) => {
    dispatch({
      type: TRANSPORTORDER.SETTRANSPORTORDER,
      payload: value,
    });
  }, []);

  const getCurrentCompany = async (): Promise<string | undefined> => {
    try {
      const value = storage.getString("@storageCompany");
      if (value !== undefined) {
        return value!;
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TransportOrderContext.Provider
      value={{
        company: state.company,
        transportOrders: state.transportOrders,
        transportOrder: state.transportOrder,
        error: state.error,
        loading: state.loading,
        orderState: state.orderState,
        orderStates: state.orderStates,
        update: state.update,
        setCompany,
        setCurrentCompany,
        setTransportOrder,
        setloading,
        setOrderState,
        setUpdate,
        getTransportOrders,
        getCurrentCompany,
        postTransportOrderChecker,
        postCheckDelivered,
      }}
    >
      {children}
    </TransportOrderContext.Provider>
  );
};

export default TransportOrderState;