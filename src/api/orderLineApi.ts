import axios from 'axios';
import { baseUrl, emailPanicNotification } from '../constants/config';
import { OrderLine } from '../components/OrderLines/LineDetail';
import { Document } from '../components/LineDocument/DocumentDetail';
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchOrderLines = async (company: string, orderId: string): Promise<OrderLine[]> => {
  const response = await api.get(`/api/OrderLine/get`, {
    params: { company, orderId },
  });
  return response.data;
};

export const fetchDocuments = async (company: string, recId: number, recIdOV: number): Promise<Document[]> => {
  const response = await api.get(`/api/Document/get`, {
    params: { company, recId, recIdOV },
  });
  return response.data.sort((a: Document, b: Document) => b.mandatory - a.mandatory);
};

export const getBase64Document = async (document: Document): Promise<string> => {
  const response = await api.post(`/api/Document/base64`, document);
  return response.data.base64 || '';
};

export const postSPDocumentation = async (dataSP: any): Promise<string> => {
  const response = await api.post(`/api/Document/postSP`, dataSP);
  return response.data?.[0]?.url || '';
};

export const postNewSPDocumentation = async (dataSP: FormData): Promise<string> => {
  const response = await api.post(`/api/Document`, dataSP, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const postAXDocumentation = async (dataSend: any, company: string): Promise<number> => {
  const response = await api.post(`/api/Document/postAX`, dataSend, {
    params: { company },
  });
  const attachRecId = response.data;
  if (attachRecId > 0) {
    const updateResponse = await api.post(`/api/Document/update`, null, {
      params: {
        company,
        recIdDocument: dataSend.recIdRecord,
        status: 3,
        attachRecId,
      },
    });
    return updateResponse.data;
  }
  return 0;
};

export const postAXUpdateDocumentation = async (
  company: string,
  recIdDocument: number,
  status: number,
  attachRecId: number
): Promise<number> => {
  const response = await api.post(`/api/Document/update`, null, {
    params: {
      company,
      recIdDocument,
      status,
      attachRecId,
    },
  });
  return response.data;
};

export const postPanicNotification = async (company: string, comment: string, orderLine: OrderLine): Promise<any> => {
  const data = {
    salesOrderId: orderLine.salesOrderId,
    recIdOV: orderLine.recIdOV,
    comment: comment || 'n/a',
  };
  const response = await api.post(`/api/Notification/postSendPanicEmail`, data, {
    params: {
      emailId: emailPanicNotification,
      company,
    },
  });
  return response.data;
};

export const deleteSPDocumentation = async (url: string): Promise<boolean> => {
  const response = await api.post(`/api/Document/delete`, url);
  return response.data;
};
