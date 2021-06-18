import * as ActionTypes from "./ActionTypes";

export const SubcategoriesMap = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_SUBCATEGORIES_MAP:
      let subcategoryMap = action.payload;
      return {
        ...state,
        [subcategoryMap.id]: subcategoryMap.value,
      };
    default:
      return state;
  }
};
