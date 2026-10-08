import axios from "axios"
import { LoadUserRequest, LoadUserSuccess, LoadUserFail, UpdateUserRequest, UpdateUserSuccess, UpdateUserFail } from "../slices/userSlice"
import { setHint, clearHint } from "../../utils/authHint"

// Stops two loadUser calls from running at the same time
let loadingUser = false

export const loadUser = () => async (dispatch, getState) => {
    const { user } = getState().user;

    // If we already have user data, don't fetch again
    if (user && user.email) return;

    if (loadingUser) return;
    loadingUser = true;

    try {
        dispatch(LoadUserRequest())

        const { data } = await axios.get('/api/user/profile', {
            withCredentials: true
        })

        if (data.success) {
            setHint('user')
            dispatch(LoadUserSuccess(data.userData));
        } else {
            clearHint('user')
            dispatch(LoadUserFail(data.message));
        }

    } catch (error) {
        // 401 just means "not logged in": clear the hint so we stop asking
        if (error.response?.status === 401) {
            clearHint('user')
            dispatch(LoadUserFail(null))
            return
        }
        dispatch(LoadUserFail(error.response?.data?.message || error.message))
    } finally {
        loadingUser = false
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