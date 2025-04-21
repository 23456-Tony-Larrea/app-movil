import { createContext } from "react";

interface OrderLine {
  liPackingSlipId: string;
  recId: string;
  recIdOV: number; 
  status: string;
  salesOrderId: string;
}

interface OrderLineState {
  value: string;
  label: string;
}

interface Document {
  recId: string;
  documentName: string;
  mandatory: number;
  attachRecId: number;
  url: string;
}

interface OrderLineContextType {
  orderLines: OrderLine[];
  orderLineStates: OrderLineState[] | undefined;
  documents: Document[];
  update: boolean;
  postSPDocumentation: (data: any) => Promise<any>;
  postNewSPDocumentation: (data: FormData) => Promise<string>;
  postAXDocumentation: (data: any, company: string) => Promise<number>;
  deleteSPDocumentation: (url: string) => Promise<boolean>;
  postAXUpdateDocumentation: (
    company: string,
    recIdDocument: string,
    param1: number,
    param2: number
  ) => Promise<number>;
  postPanicNotification: (company: string, comment: string) => Promise<void>; // Agregada esta propiedad
  setUpdate: (update: boolean) => void;
  setloading: (loading: boolean) => void;
  setOrderLine: (orderLines: OrderLine[]) => void;
  setDocuments: (documents: Document[]) => void;
  getOrderLine: (company: string, orderId: string) => Promise<void>;
  getDocumentation: (company: string, recId: string, recIdOV: string) => Promise<void>;
  getBase64Doc: (document: Document) => Promise<string>; // Agregada esta propiedad
  loading: boolean;
}

export const OrderLineContext = createContext<OrderLineContextType | undefined>(undefined);