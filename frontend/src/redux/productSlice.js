import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",

  initialState: {
    products: []
  },

  reducers: {

    setProducts: (state, action) => {
      state.products = action.payload;
    },

    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (p) => p.id === action.payload.id
      );

      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },

    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (p) => p.id !== action.payload
      );
    }

  }

});

export const { setProducts, updateProduct, deleteProduct } = productSlice.actions;

export default productSlice.reducer;