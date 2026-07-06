import { AddToWishlist, RemoveFromWishlist } from "../slices/wishlistSlice"


export const addToWishlist = (data) => async (dispatch, getState) => {
    dispatch(AddToWishlist(data))
    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist))
    return data
}


export const removeFromWishlist = (id) => async (dispatch, getState) => {
    dispatch(RemoveFromWishlist(id))
    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist))
    return id
}