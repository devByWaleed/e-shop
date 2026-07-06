import axios from "axios"
import { LoadUserRequest, LoadUserSuccess, LoadUserFail, UpdateUserRequest, UpdateUserSuccess, UpdateUserFail } from "../slices/userSlice"

export const loadUser = () => async (dispatch, getState) => {
    // Get current user state
    const { user, loading } = getState().user;

    // If we already have user data, don't fetch again
    if (user && user.email) {
        console.log("User data already exists, skipping API call");
        return;
    }

    // If already loading, don't fetch again
    if (loading) {
        console.log("Already loading user data");
        return;
    }

    try {
        dispatch(LoadUserRequest())

        const { data } = await axios.get('/api/user/profile', {
            withCredentials: true
        })

        if (data.success) {
            dispatch(LoadUserSuccess(data.userData));
        } else {
            dispatch(LoadUserFail(data.message));
        }

    } catch (error) {
        dispatch(LoadUserFail(error.message))
    }
}


export const updateUser = (formData) => async (dispatch) => {
    try {
        dispatch(UpdateUserRequest());

        const { data } = await axios.put('/api/user/update-profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        });

        if (data.success) {
            dispatch(UpdateUserSuccess(data.userData));
            return { success: true, message: data.message };
        } else {
            dispatch(UpdateUserFail(data.message));
            return { success: false, message: data.message };
        }

    } catch (error) {
        const errorMsg = error.message;
        dispatch(UpdateUserFail(errorMsg));
        return { success: false, message: errorMsg };
    }
};