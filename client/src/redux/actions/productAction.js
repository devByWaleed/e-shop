import axios from "axios"
import { CreateProductRequest, CreateProductSuccess, CreateProductFail } from "../slices/productSlice"

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