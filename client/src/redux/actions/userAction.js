import axios from "axios"
import { LoadUserRequest, LoadUserSuccess, LoadUserFail } from "../slices/userSlice"

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