import * as ActionTypes from "./ActionTypes";

export const SubcategoriesMapCharge = (
  state = { subcategoriesMapCharge: [] },
  action
) => {
  switch (action.type) {
    case ActionTypes.SUBCATEGORIES_MAP_CHARGE:
      let subcategoryMapChargeNew = action.payload;
      return {
        ...state,
        subcategoriesMapCharge: state.subcategoriesMapCharge.concat(
          subcategoryMapChargeNew
        ),
      };
    default:
      return state;
  }
};
