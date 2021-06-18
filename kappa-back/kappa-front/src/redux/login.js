import * as ActionTypes from "./ActionTypes";

let user = localStorage.getItem("currentUserKappa")
  ? JSON.parse(localStorage.getItem("currentUserKappa")).username
  : "";
let token = localStorage.getItem("currentUserKappa")
  ? JSON.parse(localStorage.getItem("currentUserKappa")).token
  : "";
let idUser = localStorage.getItem("currentUserKappa")
  ? JSON.parse(localStorage.getItem("currentUserKappa")).id
  : "";

export const initialState = {
  username: "" || user,
  token: "" || token,
  idUser: "" || idUser,
  loading: false,
  errorMessage: null,
};

export const login = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_LOGIN:
      return {
        ...initialState,
        loading: true,
      };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...initialState,
        username: action.payload.username,
        token: action.payload.token,
        idUser: action.payload._id,
        loading: false,
      };
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        user: "",
        token: "",
      };

    case ActionTypes.LOGIN_ERROR:
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };

    default:
      return state;
  }
};
