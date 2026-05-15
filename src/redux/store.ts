import { configureStore } from '@reduxjs/toolkit';
import cartSliceReducer from './features/cartSlice';
import checkoutSliceReducer from './features/checkoutSlice';

export const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    checkout: checkoutSliceReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;