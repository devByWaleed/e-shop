import axios from "axios";
import { getShopOrderFail, getShopOrderRequest, getShopOrderSuccess, getUserOrderFail, getUserOrderRequest, getUserOrderSuccess } from "../slices/orderSlice";


export const getUserOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch(getUserOrderRequest())

        const { data } = await axios.get(`/api/order/user-orders/${id}`, {
            withCredentials: true
        })

        if (data.success) {
            dispatch(getUserOrderSuccess(data.orders));
        } else {
            dispatch(getUserOrderFail(data.message));
        }

    } catch (error) {
        dispatch(getUserOrderFail(error.message))
    }
}




export const getShopOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch(getShopOrderRequest())

        const { data } = await axios.get(`/api/order/shop-orders/${id}`, {
            withCredentials: true
        })

        if (data.success) {
            dispatch(getShopOrderSuccess(data.shopOrders));
        } else {
            dispatch(getShopOrderFail(data.message));
        }

    } catch (error) {
        dispatch(getShopOrderFail(error.message))
    }
}