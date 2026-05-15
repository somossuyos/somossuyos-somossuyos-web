import { ShopItem } from '@/src/entities/ShopItem';
import { createSlice } from '@reduxjs/toolkit';

type CartState = {
  items: ShopItem[];
}

const initialState: CartState = {
  items: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setItems(state, action) {
      return action.payload;
    },
    clearItems(state) {
      state.items = [];
    },
    addItem(state, action) {
      const item = action.payload;
      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity = item.quantity;
      } else {
        state.items.push(item);
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
    }
  }
});

export const { setItems, addItem, removeItem, updateQuantity, clearItems } = cartSlice.actions;
export default cartSlice.reducer;