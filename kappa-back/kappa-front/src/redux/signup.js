import * as ActionTypes from "./ActionTypes";

export const initialState = {
  loading: false,
  errorMessage: null,
};

export const signup = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_SIGNUP:
      return {
        ...initialState,
        loading: true,
      };
    case ActionTypes.SIGNUP_SUCCESS:
      return {
        ...initialState,
        loading: false,
      };
    case ActionTypes.SIGNUP_ERROR:
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };

    default:
      return state;
  }
};
