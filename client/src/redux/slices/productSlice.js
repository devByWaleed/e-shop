import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        createSuccess: false,
        deleteSuccess: false,
        productLoading: false,
        product: null,
        shopProducts: [],
        allProducts: [],
        productError: null
    },
    reducers: {
        CreateProductRequest: (state) => {
            state.productLoading = true
            state.createSuccess = false
            state.productError = null
        },
        CreateProductSuccess: (state, action) => {
            state.createSuccess = true
            state.productLoading = false
            state.product = action.payload
            state.productError = null
        },
        CreateProductFail: (state, action) => {
            state.createSuccess = false
            state.productLoading = false
            state.productError = action.payload
        },
        ClearError: (state) => {
            state.productError = null
        },
        ResetProductState: (state) => {
            state.createSuccess = false
            state.deleteSuccess = false
            state.productLoading = false
            state.product = null
            state.productError = null
        },
        getShopProductsRequest: (state) => {
            state.productLoading = true
            state.productError = null
        },
        getShopProductsSuccess: (state, action) => {
            state.productLoading = false
            state.shopProducts = action.payload
            state.productError = null
        },
        getShopProductsFail: (state, action) => {
            state.productLoading = false
            state.productError = action.payload
        },
        getAllProductsRequest: (state) => {
            state.productLoading = true
            state.productError = null
        },
        getAllProductsSuccess: (state, action) => {
            state.productLoading = false
            state.allProducts = action.payload
            state.productError = null
        },
        getAllProductsFail: (state, action) => {
            state.productLoading = false
            state.productError = action.payload
        },
        deleteProductRequest: (state) => {
            state.productLoading = true
            state.deleteSuccess = false
            state.productError = null
        },
        deleteProductSuccess: (state, action) => {
            state.deleteSuccess = true
            state.productLoading = false
            state.message = action.payload
            state.productError = null
        },
        deleteProductFail: (state, action) => {
            state.deleteSuccess = false
            state.productLoading = false
            state.productError = action.payload
        },
        clearSuccess: (state) => {
            state.createSuccess = false
        },
        clearDeleteSuccess: (state) => {
            state.deleteSuccess = false
        },
    }
})

export const { CreateProductRequest, CreateProductSuccess, CreateProductFail, ClearError, ResetProductState, getAllProductsRequest, getAllProductsSuccess, getAllProductsFail, getShopProductsRequest, getShopProductsSuccess, getShopProductsFail, deleteProductRequest, deleteProductSuccess, deleteProductFail, clearSuccess, clearDeleteSuccess } = productSlice.actions
export default productSlice.reducer