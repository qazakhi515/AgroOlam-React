import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectHomePage = (state: AppRootState) => state.homePage;

export const retrievePopularProducts = createSelector(
  selectHomePage,
  (homePage) => homePage.popularProducts || homePage.popularDishes || []
);

export const retrieveNewProducts = createSelector(
  selectHomePage,
  (homePage) => homePage.newProducts || homePage.newDishes || []
);

export const retrieveTopUsers = createSelector(
  selectHomePage,
  (homePage) => homePage.topUsers
);

// Backward compatibility aliases
export const retrievePopularDishes = retrievePopularProducts;
export const retrieveNewDishes = retrieveNewProducts;
