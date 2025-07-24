import { TRANSPORTORDER } from "../Types/types";

export const TransportOrderReducer = (state, action) => {
  switch (action.type) {
    case TRANSPORTORDER.TRANSPORTORDER:
      return {
        ...state,
        transportOrders: action.payload.data,
        loading: action.payload.loading,
        update: action.payload.update,
      };
    case TRANSPORTORDER.SETTRANSPORTORDER:
      return {
        ...state,
        transportOrder: action.payload,
      };
    case TRANSPORTORDER.COMPANY:
      return {
        ...state,
        company: action.payload,
      };
    case TRANSPORTORDER.UPDATE:
      return {
        ...state,
        update: action.payload,
      };
    case TRANSPORTORDER.ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case TRANSPORTORDER.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case TRANSPORTORDER.ORDERSTATE:
      return {
        ...state,
        orderState: action.payload,
      };

    default:
      return state;
  }
};
