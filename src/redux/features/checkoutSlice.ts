import { createSlice } from '@reduxjs/toolkit';

type CheckoutState = {
  names: string;
  lastNames: string;
  email: string;
  phone: string;
  direction: {
    city: {
      label: string;
      code: string;
    };
    country: string;
    state: string;
    direction: string;
  };
}

const initialState: CheckoutState = {
  names: '',
  lastNames: '',
  email: '',
  phone: '',
  direction: {
    city: {
      label: '',
      code: '',
    },
    country: '',
    state: '',
    direction: '',
  },
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setData: (state, action) => {
      return action.payload;
    },
    clearData: (state) => {
      state = initialState;
      return state;
    }
  },
});

export const { setData, clearData } = checkoutSlice.actions;
export default checkoutSlice.reducer;