import axios from "axios";
import {
    adminSignInStart,
    adminSignInSuccess,
    adminSignInFailure,
    adminLogout,
    setAllSellers,
    fetchDataStart,
    fetchDataFailure,
    setAllUsers
} from "../slices/adminSlice";


// Load admin from token (called on app mount)
export const loadAdmin = () => async (dispatch) => {
    try {
        dispatch(adminSignInStart());

        const { data } = await axios.get('/api/admin/verify-admin', {
            withCredentials: true
        });

        if (data.success) {
            dispatch(adminSignInSuccess(data.admin));
        } else {
            // Token invalid or expired
            dispatch(adminLogout());
        }
    } catch (error) {
        console.error("Admin load error:", error);
        // Don't show error toast here to avoid confusion on initial load
        dispatch(adminLogout());
    }
};


// Admin login with credentials
export const adminLogin = (email, password) => async (dispatch) => {
    try {
        dispatch(adminSignInStart());

        const { data } = await axios.post('/api/admin/admin-login', { email, password }, {
            withCredentials: true
        });

        if (data.success) {
            dispatch(adminSignInSuccess(data.admin));
            return { success: true };
        } else {
            dispatch(adminSignInFailure(data.message));
            return { success: false, message: data.message };
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Login failed";
        dispatch(adminSignInFailure(errorMessage));
        return { success: false, message: errorMessage };
    }
};


// Admin logout
export const adminLogoutAction = () => async (dispatch) => {
    try {
        await axios.post('/api/admin/admin-logout', {
            withCredentials: true
        });
        dispatch(adminLogout());
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        // Still clear local state even if API fails
        dispatch(adminLogout());
        return { success: false, message: error.message };
    }
};


// Get All Users
export const getUsers = () => async (dispatch) => {
    try {
        dispatch(fetchDataStart());
        const { data } = await axios.get('/api/admin/admin-users');
        if (data.success) {
            dispatch(setAllUsers(data.allUsers));
        } else {
            dispatch(fetchDataFailure(data.message));
        }
    } catch (error) {
        dispatch(fetchDataFailure(error.message));
    }
};


// Delete Specific User
export const deleteUser = () => async () => { }


// Get All Sellers
export const getSellers = () => async (dispatch) => {
    try {
        dispatch(fetchDataStart());
        const { data } = await axios.get('/api/admin/admin-sellers');
        if (data.success) {
            dispatch(setAllSellers(data.allSellers));
        } else {
            dispatch(fetchDataFailure(data.message));
        }
    } catch (error) {
        dispatch(fetchDataFailure(error.message));
    }
};