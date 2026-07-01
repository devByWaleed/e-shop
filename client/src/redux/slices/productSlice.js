import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        success: false,
        productLoading: false,
        product: null,
        allProducts: null,
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
        },
        getAllProductsRequest: (state) => {
            state.productLoading = true
            state.success = false
            state.productError = null
        },
        getAllProductsSuccess: (state, action) => {
            state.success = true
            state.productLoading = false
            state.allProducts = action.payload
            state.productError = null
        },
        getAllProductsFail: (state, action) => {
            state.success = false
            state.productLoading = false
            state.productError = action.payload
        },
        deleteProductRequest: (state) => {
            state.productLoading = true
            state.success = false
            state.productError = null
        },
        deleteProductSuccess: (state, action) => {
            state.success = true
            state.productLoading = false
            state.message = action.payload
            state.productError = null
        },
        deleteProductFail: (state, action) => {
            state.success = false
            state.productLoading = false
            state.productError = action.payload
        },
    }
})

export const { CreateProductRequest, CreateProductSuccess, CreateProductFail, ClearError, ResetProductState, getAllProductsRequest, getAllProductsSuccess, getAllProductsFail, deleteProductRequest, deleteProductSuccess, deleteProductFail } = productSlice.actions
export default productSlice.reducer