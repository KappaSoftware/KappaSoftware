import * as ActionTypes from "./ActionTypes";

export const CategoriesAndSubcategories = (
  state = { isLoading: true, errMess: null, categoriesAndSubcategories: [] },
  action
) => {
  switch (action.type) {
    case ActionTypes.CATEGORIES_AND_SUBCATEGORIES_LOADED:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        categoriesAndSubcategories: action.payload,
      };

    case ActionTypes.CATEGORIES_AND_SUBCATEGORIES_LOADING:
      return {
        ...state,
        isLoading: true,
        errMess: null,
        categoriesAndSubcategories: [],
      };

    case ActionTypes.CATEGORIES_AND_SUBCATEGORIES_FAILED:
      return { ...state, isLoading: false, errMess: action.payload };

    default:
      return state;
  }
};
