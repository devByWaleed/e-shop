import axios from "axios"
import { CreateProductRequest, CreateProductSuccess, CreateProductFail, getAllProductsRequest, getAllProductsSuccess, getAllProductsFail, deleteProductRequest, deleteProductSuccess, deleteProductFail } from "../slices/productSlice"

export const createProduct = (newForm) => async (dispatch, getState) => {
    try {
        dispatch(CreateProductRequest())

        const config = { headers: { "Content-Type": "multipart/form-data" } }

        const { data } = await axios.post('/api/product/create-product', newForm, config)

        if (data.success) {
            dispatch(CreateProductSuccess(data.product));
        } else {
            dispatch(CreateProductFail(data.message));
        }

    } catch (error) {
        dispatch(CreateProductFail(error.message))
    }
}


export const getAllProducts = (id) => async (dispatch, getState) => {
    try {
        dispatch(getAllProductsRequest())

        const { data } = await axios.get(`/api/product/get-all-products/${id}`)

        if (data.success) {
            dispatch(getAllProductsSuccess(data.products));
        } else {
            dispatch(getAllProductsFail(data.message));
        }

    } catch (error) {
        dispatch(getAllProductsFail(error.message))
    }
}


export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch(deleteProductRequest())

        const { data } = await axios.delete(`/api/product/delete-shop-product/${id}`)

        if (data.success) {
            dispatch(deleteProductSuccess(data.message));
        } else {
            dispatch(deleteProductFail(data.message));
        }

    } catch (error) {
        dispatch(deleteProductFail(error.message))
    }
}