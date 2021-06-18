import * as ActionTypes from "./ActionTypes";

export const LandingStats = (
  state = { isLoading: true, errMess: null, landingStats: [] },
  action
) => {
  switch (action.type) {
    case ActionTypes.LANDING_STATS_LOADED:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        landingStats: action.payload,
      };

    case ActionTypes.LANDING_STATS_LOADING:
      return {
        ...state,
        isLoading: true,
        errMess: null,
        landingStats: [],
      };

    case ActionTypes.LANDING_STATS_FAILED:
      return { ...state, isLoading: false, errMess: action.payload };

    default:
      return state;
  }
};
