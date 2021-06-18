import axios from "axios";
import * as ActionTypes from "./ActionTypes";

export const fetchCategoriesAndSubcategories = () => (dispatch) => {
  dispatch(categoriesAndSubcategoriesLoading(true));

  return axios
    .get("kappa/categories/lookup/subcategory")
    .then((response) =>
      dispatch(loadedCategoriesAndSubcategories(response.data))
    )
    .catch((error) =>
      dispatch(categoriesAndSubcategoriesFailed(error.message))
    );
};

export const categoriesAndSubcategoriesLoading = () => ({
  type: ActionTypes.CATEGORIES_AND_SUBCATEGORIES_LOADING,
});

export const categoriesAndSubcategoriesFailed = (errmess) => ({
  type: ActionTypes.CATEGORIES_AND_SUBCATEGORIES_FAILED,
  payload: errmess,
});

export const loadedCategoriesAndSubcategories = (
  loadedCategoriesAndSubcategories
) => ({
  type: ActionTypes.CATEGORIES_AND_SUBCATEGORIES_LOADED,
  payload: loadedCategoriesAndSubcategories,
});

// Map
export const postSubcategoryMap = (id, value) => (dispatch) => {
  const newSubcategoryMap = {
    id: id,
    value: value,
  };

  dispatch(addSubcategoriesMap(newSubcategoryMap));
};

export const addSubcategoriesMap = (subcategoryMap) => ({
  type: ActionTypes.ADD_SUBCATEGORIES_MAP,
  payload: subcategoryMap,
});

export const postSubcategoryMapCharge = (id) => (dispatch) => {
  dispatch(addSubcategoriesMapCharge(id));
};

export const addSubcategoriesMapCharge = (id) => ({
  type: ActionTypes.SUBCATEGORIES_MAP_CHARGE,
  payload: id,
});

export const fetchDataPoints = (idSubcategory) => (dispatch) => {
  return axios
    .get("kappa/data/lookup/subcategory/" + idSubcategory)
    .then((response) => dispatch(loadedDataPoints(response.data)))
    .catch((error) => dispatch(dataPointsFailed(error.message)));
};

export const dataPointsFailed = (errmess) => ({
  type: ActionTypes.DATA_POINTS_FAILED,
  payload: errmess,
});

export const loadedDataPoints = (loadedDataPoints) => ({
  type: ActionTypes.DATA_POINTS_LOADED,
  payload: loadedDataPoints,
});

// Report a point in the map
export const sendReport = (idData, token) => async (dispatch) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  let respuesta;
  await axios
    .post("kappa/data/complaint/" + idData, {}, config)
    .then((response) => (respuesta = response))
    .catch((error) => (respuesta = error.response));
  return respuesta;
};

// Users
export const loginUser = (data) => async (dispatch) => {
  dispatch(requestLogin(true));

  const infoLoginUser = {
    username: data.username,
    password: data.password,
  };

  let respuesta;

  await axios
    .post("kappa/users/login", infoLoginUser)
    .then((response) => {
      if (response.data.success) {
        dispatch(loginSuccess(response.data));
        localStorage.setItem("currentUserKappa", JSON.stringify(response.data));
      }
      respuesta = response;
    })
    .catch((error) => {
      dispatch(loginError(error.message));
      respuesta = error;
    });

  return respuesta;
};

const requestLogin = () => ({
  type: ActionTypes.REQUEST_LOGIN,
});

const loginSuccess = (loginInfo) => ({
  type: ActionTypes.LOGIN_SUCCESS,
  payload: loginInfo,
});

const loginError = (errmess) => ({
  type: ActionTypes.LOGIN_ERROR,
  error: errmess,
});

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
  localStorage.removeItem("currentUserKappa");
};

const logout = () => ({
  type: ActionTypes.LOGOUT,
});

export const createUser = (data) => async (dispatch) => {
  dispatch(requestSignUp(true));

  const infoCreateUser = {
    username: data.username,
    password: data.password,
    repeat_password: data.repeat_password,
    token: data.token,
  };

  let respuesta;

  await axios
    .post("kappa/users", infoCreateUser)
    .then((response) => {
      if (response.data.success) {
        dispatch(signUpSuccess(response.data));
      }
      respuesta = response;
    })
    .catch((error) => {
      dispatch(signUpError(error.message));
      respuesta = error;
    });

  return respuesta;
};

const requestSignUp = () => ({
  type: ActionTypes.REQUEST_SIGNUP,
});

const signUpSuccess = (signUpInfo) => ({
  type: ActionTypes.SIGNUP_SUCCESS,
  payload: signUpInfo,
});

const signUpError = (errmess) => ({
  type: ActionTypes.SIGNUP_ERROR,
  error: errmess,
});

// Landing stats
export const fetchLandingStats = () => (dispatch) => {
  dispatch(landingStatsLoading(true));

  return axios
    .get("kappa/landing_stats")
    .then((response) => dispatch(landingStatsLoaded(response.data)))
    .catch((error) => dispatch(landingStatsFailed(error.message)));
};

export const landingStatsLoading = () => ({
  type: ActionTypes.LANDING_STATS_LOADING,
});

export const landingStatsFailed = (errmess) => ({
  type: ActionTypes.LANDING_STATS_FAILED,
  payload: errmess,
});

export const landingStatsLoaded = (landingStatsLoaded) => ({
  type: ActionTypes.LANDING_STATS_LOADED,
  payload: landingStatsLoaded,
});
