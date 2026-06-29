import axios from "axios"
import { LoadSellerRequest, LoadSellerSuccess, LoadSellerFail } from "../slices/sellerSlice"

export const loadSeller = () => async (dispatch, getState) => {
    // Get current user state
    const { seller, sellerLoading } = getState().seller;

    // If we already have user data, don't fetch again
    if (seller && seller.email) {
        console.log("User data already exists, skipping API call");
        return;
    }

    // If already loading, don't fetch again
    if (sellerLoading) {
        console.log("Already loading user data");
        return;
    }

    try {
        dispatch(LoadSellerRequest())

        const { data } = await axios.get('/api/seller/seller-profile', {
            withCredentials: true
        })

        if (data.success) {
            dispatch(LoadSellerSuccess(data.sellerData));
        } else {
            dispatch(LoadSellerFail(data.message));
        }

    } catch (error) {
        dispatch(LoadSellerFail(error.message))
    }
}