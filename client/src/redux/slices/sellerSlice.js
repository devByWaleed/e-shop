import { createSlice } from "@reduxjs/toolkit";

const sellerSlice = createSlice({
    name: "seller",
    initialState: {
        sellerAuthenticated: false,
        sellerLoading: false,
        seller: null,
        sellerError: null
    },
    reducers: {
        signInStart: (state) => {
            state.sellerLoading = true
        },
        signInSuccess: (state, action) => {
            state.seller = action.payload
            state.sellerLoading = false
            state.sellerError = null
        },
        signInFailure: (state, action) => {
            state.sellerError = action.payload
            state.sellerLoading = false
        },
        LoadSellerRequest: (state) => {
            state.sellerLoading = true
        },
        LoadSellerSuccess: (state, action) => {
            state.sellerAuthenticated = true
            state.sellerLoading = false
            state.seller = action.payload
        },
        LoadSellerFail: (state, action) => {
            state.sellerAuthenticated = false
            state.sellerLoading = false
            state.sellerError = action.payload
            state.seller = null
        },
        ClearError: (state) => {
            state.sellerError = null
        }
    }
})

export const { LoadSellerRequest, LoadSellerSuccess, LoadSellerFail, ClearError } = sellerSlice.actions
export default sellerSlice.reducer