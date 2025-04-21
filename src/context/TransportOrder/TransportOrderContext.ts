import { createContext } from "react";

interface TransportOrder {
  orderId: string;
  deliveryDate: string;
  status: string;
  orderLines: any[]; // Cambia `any[]` por el tipo adecuado si lo conoces
  orderLineStates: any[]; // Cambia `any[]` por el tipo adecuado si lo conoces
}

interface TransportOrderContextType {
  company: string; // Agregada esta propiedad
  setCurrentCompany: (company: string) => void;
  setCompany: (company: string) => void;
  update: boolean;
  orderStates: { value: string; label: string }[];
  transportOrders: TransportOrder[];
  transportOrder: TransportOrder;
  error: boolean;
  loading: boolean;
  orderState: string;
  setOrderState: (state: string) => void;
  getCurrentCompany: () => Promise<string | undefined>;
  setloading: (loading: boolean) => void;
  getTransportOrders: (
    orderState: string,
    startPosition: number,
    numTransportOrders: number
  ) => Promise<void>;
  setTransportOrder: (order: TransportOrder) => void;
  setUpdate: (update: boolean) => void;
  postTransportOrderChecker: (orderId: string) => Promise<boolean>;
  postCheckDelivered: (data: any, sendEmail: number) => Promise<boolean>

}

export const TransportOrderContext = createContext<TransportOrderContextType | undefined>(undefined);