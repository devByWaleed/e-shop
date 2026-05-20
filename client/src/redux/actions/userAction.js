import axios from "axios"
import { LoadUserRequest, LoadUserSuccess, LoadUserFail } from "../slices/userSlice"

export const loadUser = () => async (dispatch) => {
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