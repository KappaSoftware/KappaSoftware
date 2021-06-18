import * as ActionTypes from "./ActionTypes";

export const DataPoints = (state = { dataPoints: [] }, action) => {
  switch (action.type) {
    case ActionTypes.DATA_POINTS_LOADED:
      let newDataPoints = action.payload;
      return {
        ...state,
        dataPoints: state.dataPoints.concat(newDataPoints),
      };
    case ActionTypes.DATA_POINTS_FAILED:
      return { ...state, errMess: action.payload };
    default:
      return state;
  }
};
