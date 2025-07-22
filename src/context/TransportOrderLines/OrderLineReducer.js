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
      console.log("=== REDUCER ORDERLINE.DOCUMENTATION ===");
      console.log("Action payload:", action.payload);
      console.log("Action payload data:", action.payload.data);
      console.log("Data length:", action.payload.data ? action.payload.data.length : 0);
      const newState = {
        ...state,
        documents: action.payload.data,
        loading: action.payload.loading,
        update: action.payload.update,
      };
      console.log("New state documents:", newState.documents);
      console.log("New state documents length:", newState.documents ? newState.documents.length : 0);
      return newState;
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
