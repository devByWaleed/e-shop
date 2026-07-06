import { AddToCart, RemoveFromCart } from "../slices/cartSlice"


export const addToCart = (data) => async (dispatch, getState) => {
    dispatch(AddToCart(data))
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart))
    return data
}


export const removeFromCart = (id) => async (dispatch, getState) => {
    dispatch(RemoveFromCart(id))
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart))
    return id
}