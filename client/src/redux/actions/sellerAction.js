import axios from "axios"
import { LoadSellerRequest, LoadSellerSuccess, LoadSellerFail, UpdateSellerRequest, UpdateSellerSuccess, UpdateSellerFail } from "../slices/sellerSlice"
import { setHint, clearHint } from "../../utils/authHint"

// Stops two loadSeller calls from running at the same time
let loadingSeller = false

export const loadSeller = () => async (dispatch, getState) => {
    const { seller } = getState().seller;

    // If we already have seller data, don't fetch again
    if (seller && seller.email) return;

    if (loadingSeller) return;
    loadingSeller = true;

    try {
        dispatch(LoadSellerRequest())

        const { data } = await axios.get('/api/seller/seller-profile', {
            withCredentials: true
        })

        if (data.success) {
            setHint('seller')
            dispatch(LoadSellerSuccess(data.sellerData));
        } else {
            clearHint('seller')
            dispatch(LoadSellerFail(data.message));
        }

    } catch (error) {
        if (error.response?.status === 401) {
            clearHint('seller')
            dispatch(LoadSellerFail(null))
            return
        }
        dispatch(LoadSellerFail(error.response?.data?.message || error.message))
    } finally {
        loadingSeller = false
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