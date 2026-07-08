import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartLoading: false,
        cart: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    },
    reducers: {
        AddToCart: (state, action) => {
            const item = action.payload;
            const isItemExist = state.cart.find((i) => i._id === item._id);

            if (isItemExist) {
                // Fixed: Map properly checks individual item IDs
                state.cart = state.cart.map((i) => i._id === item._id ? item : i);
            } else {
                state.cart.push(item); // RTK allows direct mutation safely
            }
        },
        RemoveFromCart: (state, action) => {
            state.cart = state.cart.filter((i) => i._id !== action.payload);
        },
        ClearCart: (state) => {
            state.cart = [];
        }

    }
});

export const { AddToCart, RemoveFromCart, ClearCart } = cartSlice.actions;
export default cartSlice.reducer;