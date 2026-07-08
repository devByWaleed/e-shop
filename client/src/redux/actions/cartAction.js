import { AddToCart, RemoveFromCart, ClearCart } from "../slices/cartSlice"


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

export const clearCart = () => async (dispatch) => {
    dispatch(ClearCart())
    localStorage.removeItem("cartItems")
    localStorage.removeItem("latestOrder");
    return null
}