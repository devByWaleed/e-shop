// redux/slices/loadingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        isLoading: false,
        loadingMessage: null,
        redirectUrl: null
    },
    reducers: {
        showLoading: (state, action) => {
            state.isLoading = true;
            state.loadingMessage = action.payload?.message || "Loading...";
            state.redirectUrl = action.payload?.redirectUrl || null;
        },
        hideLoading: (state) => {
            state.isLoading = false;
            state.loadingMessage = null;
            state.redirectUrl = null;
        }
    }
});

export const { showLoading, hideLoading } = loadingSlice.actions;
export default loadingSlice.reducer;