import { createSlice } from "@reduxjs/toolkit";
import { HomePageState } from "../../../lib/types/screen";

const initialState: HomePageState = {
  popularProducts: [],
  newProducts: [],
  topUsers: [],
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setPopularProducts: (state, action) => {
      state.popularProducts = action.payload;
      state.popularDishes = action.payload;
    },
    setNewProducts: (state, action) => {
      state.newProducts = action.payload;
      state.newDishes = action.payload;
    },
    setTopUsers: (state, action) => {
      state.topUsers = action.payload;
    },
    // Backward compatibility aliases
    setPopularDishes: (state, action) => {
      state.popularProducts = action.payload;
      state.popularDishes = action.payload;
    },
    setNewDishes: (state, action) => {
      state.newProducts = action.payload;
      state.newDishes = action.payload;
    },
  },
});

export const {
  setNewProducts,
  setPopularProducts,
  setTopUsers,
  setPopularDishes,
  setNewDishes,
} = homePageSlice.actions;

const HomePageReducer = homePageSlice.reducer;
export default HomePageReducer;
