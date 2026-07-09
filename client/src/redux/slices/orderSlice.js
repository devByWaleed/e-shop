import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orderSuccess: false,
        orderLoading: false,
        orders: [],
        shopOrders: [],
        orderError: null
    },
    reducers: {
        getUserOrderRequest: (state) => {
            state.orderLoading = true
            state.orderSuccess = false
            state.orderError = null
        },
        getUserOrderSuccess: (state, action) => {
            state.orderSuccess = true
            state.orderLoading = false
            state.orders = action.payload
            state.orderError = null
        },
        getUserOrderFail: (state, action) => {
            state.orderSuccess = false
            state.orderLoading = false
            state.orderError = action.payload
        },
        getShopOrderRequest: (state) => {
            state.orderLoading = true
            state.orderSuccess = false
            state.orderError = null
        },
        getShopOrderSuccess: (state, action) => {
            state.orderSuccess = true
            state.orderLoading = false
            state.shopOrders = action.payload
            state.orderError = null
        },
        getShopOrderFail: (state, action) => {
            state.orderSuccess = false
            state.orderLoading = false
            state.orderError = action.payload
        },
        ClearError: (state) => {
            state.orderError = null
        },

    }
})

export const { ClearError, getUserOrderRequest, getUserOrderSuccess, getUserOrderFail, getShopOrderRequest, getShopOrderSuccess, getShopOrderFail } = orderSlice.actions
export default orderSlice.reducer