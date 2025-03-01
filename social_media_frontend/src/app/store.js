import { configureStore } from '@reduxjs/toolkit';
import apiSlice from '../../Store/Slice/apiSlice'; // Correct path to apiSlice

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
