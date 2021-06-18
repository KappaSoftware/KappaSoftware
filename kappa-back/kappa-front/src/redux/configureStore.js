import { createStore, combineReducers, applyMiddleware } from "redux";
import { CategoriesAndSubcategories } from "./categoriesAndSubcategories";
import { SubcategoriesMap } from "./subcategories";
import { SubcategoriesMapCharge } from "./subcategoriesMapCharge";
import { DataPoints } from "./dataPoints";
import { login } from "./login";
import { signup } from "./signup";
import { LandingStats } from "./landingStats";
import thunkMiddleware from "redux-thunk";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      categoriesAndSubcategories: CategoriesAndSubcategories,
      subcategoriesMap: SubcategoriesMap,
      subcategoriesMapCharge: SubcategoriesMapCharge,
      dataPoints: DataPoints,
      login: login,
      signup: signup,
      landingStats: LandingStats,
    }),
    applyMiddleware(thunkMiddleware)
  );

  return store;
};
