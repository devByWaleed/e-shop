import axios from "axios"
import { LoadSellerRequest, LoadSellerSuccess, LoadSellerFail, UpdateSellerRequest, UpdateSellerSuccess, UpdateSellerFail } from "../slices/sellerSlice"

export const loadSeller = () => async (dispatch, getState) => {
    // Get current user state
    const { seller, sellerLoading } = getState().seller;

    // If we already have user data, don't fetch again
    if (seller && seller.email) {
        console.log("Seller data already exists, skipping API call");
        return;
    }

    // If already loading, don't fetch again
    if (sellerLoading) {
        console.log("Already loading seller data");
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



export const updateSeller = (formData) => async (dispatch) => {
    try {
        dispatch(UpdateSellerRequest());

        const { data } = await axios.put('/api/seller/update-seller-profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        });

        if (data.success) {
            dispatch(UpdateSellerSuccess(data.sellerData));
            return { success: true, message: data.message };
        } else {
            dispatch(UpdateSellerFail(data.message));
            return { success: false, message: data.message };
        }

    } catch (error) {
        const errorMsg = error.message;
        dispatch(UpdateSellerFail(errorMsg));
        return { success: false, message: errorMsg };
    }
};