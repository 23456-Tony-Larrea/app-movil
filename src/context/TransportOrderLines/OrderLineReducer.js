import { ORDERLINE } from "../Types/types";

export const OrderLineReducer = (state, action) => {
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
