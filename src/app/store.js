import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../slices/basketSlice";

// GLOBEL STORE SETUP
export const store = configureStore({
  reducer: {
    basket: basketReducer,
  },
});
