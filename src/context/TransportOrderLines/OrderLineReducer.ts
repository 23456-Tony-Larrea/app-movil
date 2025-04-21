import { ORDERLINE } from "../Types/Types";

// Define the shape of the state
interface OrderLineState {
  orderLines: any[]; // Replace `any` with the specific type of orderLines
  documents: any[]; // Replace `any` with the specific type of documents
  loading: boolean;
  update: boolean;
  orderLineStates?: { label: string; value: string }[]; // Optional if not always present
}

// Define the shape of the action
interface Action {
  type: string;
  payload: any; // Replace `any` with more specific types if possible
}

export const OrderLineReducer = (state: OrderLineState, action: Action): OrderLineState => {
  switch (action.type) {
    case ORDERLINE.ORDERLINE:
      return {
        ...state,
        orderLines: action.payload.data,
        loading: action.payload.loading,
        update: action.payload.update,
      };
    case ORDERLINE.DOCUMENTATION:
      return {
        ...state,
        documents: action.payload.data,
        loading: action.payload.loading,
        update: action.payload.update,
      };
    case ORDERLINE.SETORDERLINE:
      return {
        ...state,
        orderLines: action.payload,
      };
    case ORDERLINE.SETDOCUMENTATION:
      return {
        ...state,
        documents: action.payload,
      };
    case ORDERLINE.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ORDERLINE.UPDATE:
      return {
        ...state,
        update: action.payload,
      };
    default:
      return state;
  }
};