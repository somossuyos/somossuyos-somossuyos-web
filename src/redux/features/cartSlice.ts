import { ShopItem } from '@/src/entities/ShopItem';
import { createSlice } from '@reduxjs/toolkit';
import {
  isRenaserSinglePurchaseItemId,
  RENASER_SINGLE_PURCHASE_MAX_QUANTITY,
} from '@/src/lib/wompi/renaserSinglePurchase';

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
      const quantity = isRenaserSinglePurchaseItemId(item.id)
        ? RENASER_SINGLE_PURCHASE_MAX_QUANTITY
        : item.quantity;

      if (isRenaserSinglePurchaseItemId(item.id)) {
        state.items = [{ ...item, quantity: RENASER_SINGLE_PURCHASE_MAX_QUANTITY }];
        return;
      }

      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.quantity = isRenaserSinglePurchaseItemId(id)
          ? RENASER_SINGLE_PURCHASE_MAX_QUANTITY
          : quantity;
      }
    }
  }
});

export const { setItems, addItem, removeItem, updateQuantity, clearItems } = cartSlice.actions;
export default cartSlice.reducer;