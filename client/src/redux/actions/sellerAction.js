import axios from "axios"
import {
    LoadSellerRequest,
    LoadSellerSuccess,
    LoadSellerFail,
    UpdateSellerRequest,
    UpdateSellerSuccess,
    UpdateSellerFail,
    FetchShopEventsRequest,
    FetchShopEventsSuccess,
    FetchShopEventsFail,
    FetchShopReviewsRequest,
    FetchShopReviewsSuccess,
    FetchShopReviewsFail
} from "../slices/sellerSlice"

export const loadSeller = () => async (dispatch, getState) => {
    // Get current user state
    const { seller, sellerLoading } = getState().seller;

    // If we already have user data, don't fetch again
    if (seller && seller.email) {

        return;
    }

    // If already loading, don't fetch again
    if (sellerLoading) {

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



// Get all events of one shop
export const getShopEvents = (shopId) => async (dispatch) => {
    try {
        dispatch(FetchShopEventsRequest());

        const { data } = await axios.get(`/api/seller/shop-events/${shopId}`, {
            withCredentials: true
        });

        if (data.success) {
            dispatch(FetchShopEventsSuccess(data.events));
        } else {
            dispatch(FetchShopEventsFail(data.message));
        }
    } catch (error) {
        dispatch(FetchShopEventsFail(error.message));
    }
};



// Get all reviews of one shop (reviews of all its products)
export const getShopReviews = (shopId) => async (dispatch) => {
    try {
        dispatch(FetchShopReviewsRequest());

        const { data } = await axios.get(`/api/seller/shop-reviews/${shopId}`, {
            withCredentials: true
        });

        if (data.success) {
            dispatch(FetchShopReviewsSuccess({ reviews: data.reviews, summary: data.summary }));
        } else {
            dispatch(FetchShopReviewsFail(data.message));
        }
    } catch (error) {
        dispatch(FetchShopReviewsFail(error.message));
    }
};