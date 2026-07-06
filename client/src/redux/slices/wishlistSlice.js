import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        wishlist: localStorage.getItem("wishlistItems") ? JSON.parse(localStorage.getItem("wishlistItems")) : [],
    },
    reducers: {
        AddToWishlist: (state, action) => {
            const item = action.payload;
            const isItemExist = state.wishlist.find((i) => i._id === item._id);

            if (isItemExist) {
                // Fixed: Map properly checks individual item IDs
                state.wishlist = state.wishlist.map((i) => i._id === item._id ? item : i);
            } else {
                state.wishlist.push(item); // RTK allows direct mutation safely
            }
        },
        RemoveFromWishlist: (state, action) => {
            state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);
        }

    }
});

export const { AddToWishlist, RemoveFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;