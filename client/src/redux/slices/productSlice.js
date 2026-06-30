import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        success: false,
        productLoading: false,
        product: null,
        productError: null
    },
    reducers: {
        CreateProductRequest: (state) => {
            state.productLoading = true
            state.success = false
            state.productError = null
        },
        CreateProductSuccess: (state, action) => {
            state.success = true
            state.productLoading = false
            state.product = action.payload
            state.productError = null
        },
        CreateProductFail: (state, action) => {
            state.success = false
            state.productLoading = false
            state.productError = action.payload
        },
        ClearError: (state) => {
            state.productError = null
        },
        ResetProductState: (state) => {
            state.success = false
            state.productLoading = false
            state.product = null
            state.productError = null
        }
    }
})

export const { CreateProductRequest, CreateProductSuccess, CreateProductFail, ClearError, ResetProductState } = productSlice.actions
export default productSlice.reducer