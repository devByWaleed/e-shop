import axios from "axios";
import {
    adminSignInStart,
    adminSignInSuccess,
    adminSignInFailure,
    adminLogout,
    setAllSellers,
    fetchDataStart,
    fetchDataFailure,
    setAllUsers,
    patchUser,
    patchSeller,
    setAllProducts,
    setAllEvents,
    setAllOrders
} from "../slices/adminSlice";
import toast from "react-hot-toast";
import { clearHint, setHint } from "../../utils/authHint";



// Admin login with credentials
export const adminLogin = (email, password) => async (dispatch) => {
    try {
        dispatch(adminSignInStart());

        const { data } = await axios.post('/api/admin/admin-login', { email, password }, {
            withCredentials: true
        });

        if (data.success) {
            dispatch(adminSignInSuccess(data.admin));
            setHint('admin')
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


// Load admin from token (called on app mount)
export const loadAdmin = () => async (dispatch) => {
    try {
        dispatch(adminSignInStart());

        const { data } = await axios.get('/api/admin/verify-admin', {
            withCredentials: true
        });

        if (data.success) {
            setHint('admin')
            dispatch(adminSignInSuccess(data.admin));
        } else {
            clearHint('admin')
            dispatch(adminLogout());
        }
    } catch (error) {
        // Only log genuinely unexpected errors, not the routine "not logged in" 401
        if (error.response?.status !== 401) {
            console.error("Admin load error:", error);
        }
        clearHint('admin')
        dispatch(adminLogout());
    }
};


// Admin logout
export const adminLogoutAction = () => async (dispatch) => {
    try {
        await axios.post('/api/admin/admin-logout', {}, {
            withCredentials: true
        });
        clearHint('admin')
        dispatch(adminLogout());
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        // Still clear local state even if API fails
        clearHint('admin')
        dispatch(adminLogout());
        return { success: false, message: error.message };
    }
};


// Shared by the five account actions below: runs one request, shows the toast,
// updates the list when the server says yes, and tells the page what happened
const runAccountAction = async (request, onSuccess) => {
    try {
        const { data } = await request();

        if (data.success) {
            onSuccess(data);
            toast.success(data.message);
            return { success: true, message: data.message };
        }

        toast.error(data.message);
        return { success: false, message: data.message };
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        toast.error(message);
        return { success: false, message };
    }
};


// Get All Users
export const getUsersAction = () => async (dispatch) => {
    try {
        dispatch(fetchDataStart());
        const { data } = await axios.get('/api/admin/admin-users', {
            withCredentials: true
        });
        if (data.success) {
            dispatch(setAllUsers(data.allUsers));
        } else {
            dispatch(fetchDataFailure(data.message));
        }
    } catch (error) {
        dispatch(fetchDataFailure(error.message));
    }
};


// Suspend or reactivate a user
export const setUserStatusAction = (id, status, reason = "") => (dispatch) =>
    runAccountAction(
        () => axios.patch(`/api/admin/user-status/${id}`, { status, reason }, { withCredentials: true }),
        (data) => dispatch(patchUser({
            id,
            changes: {
                status: data.status,
                statusReason: status === "suspended" ? reason : "",
                statusChangedAt: new Date().toISOString()
            }
        }))
    );


// Delete a user (the server erases personal data and keeps orders as history)
export const deleteUserAction = (id, { removeReviews = false, reason = "" } = {}) => (dispatch) =>
    runAccountAction(
        () => axios.delete(`/api/admin/delete-user-by-id/${id}`, {
            params: { removeReviews, reason },
            withCredentials: true
        }),
        () => dispatch(patchUser({
            id,
            changes: {
                status: "deleted",
                statusReason: reason,
                name: "Deleted user",
                email: "",
                phoneNumber: "",
                avatar: "",
                deletedAt: new Date().toISOString()
            }
        }))
    );


// Get All Sellers
export const getSellersAction = () => async (dispatch) => {
    try {
        dispatch(fetchDataStart());
        const { data } = await axios.get('/api/admin/admin-sellers', {
            withCredentials: true
        });
        if (data.success) {
            dispatch(setAllSellers(data.allSellers));
        } else {
            dispatch(fetchDataFailure(data.message));
        }
    } catch (error) {
        dispatch(fetchDataFailure(error.message));
    }
};


// Suspend, reactivate or reopen a shop
export const setSellerStatusAction = (id, status, reason = "") => (dispatch) =>
    runAccountAction(
        () => axios.patch(`/api/admin/seller-status/${id}`, { status, reason }, { withCredentials: true }),
        (data) => dispatch(patchSeller({
            id,
            changes: {
                status: data.status,
                statusReason: status === "suspended" ? reason : "",
                statusChangedAt: new Date().toISOString(),
                purgeAfter: null
            }
        }))
    );


// Close a shop (hidden for the grace period, can be reopened)
export const deleteSellerAction = (id, reason = "") => (dispatch) =>
    runAccountAction(
        () => axios.delete(`/api/admin/delete-seller-by-id/${id}`, {
            params: { reason },
            withCredentials: true
        }),
        (data) => dispatch(patchSeller({
            id,
            changes: {
                status: "closed",
                statusReason: reason,
                purgeAfter: data.purgeAfter,
                statusChangedAt: new Date().toISOString()
            }
        }))
    );


// Remove a closed shop permanently
export const purgeSellerAction = (id, force = false) => (dispatch) =>
    runAccountAction(
        () => axios.delete(`/api/admin/purge-seller-by-id/${id}`, {
            params: { force },
            withCredentials: true
        }),
        () => dispatch(patchSeller({
            id,
            changes: {
                status: "deleted",
                name: "Deleted shop",
                email: "",
                avatar: "",
                purgeAfter: null,
                deletedAt: new Date().toISOString()
            }
        }))
    );


// Get All Products
export const getProductsAction = () => async (dispatch) => {
    try {
        dispatch(fetchDataStart());
        const { data } = await axios.get('/api/admin/admin-products', {
            withCredentials: true
        });
        if (data.success) {
            dispatch(setAllProducts(data.allProducts));
        } else {
            dispatch(fetchDataFailure(data.message));
        }
    } catch (error) {
        dispatch(fetchDataFailure(error.message));
    }
};


// Get All Events
export const getEventsAction = () => async (dispatch) => {
    try {
        dispatch(fetchDataStart());
        const { data } = await axios.get('/api/admin/admin-events', {
            withCredentials: true
        });
        if (data.success) {
            dispatch(setAllEvents(data.allEvents));
        } else {
            dispatch(fetchDataFailure(data.message));
        }
    } catch (error) {
        dispatch(fetchDataFailure(error.message));
    }
};


// Get All Orders
export const getOrdersAction = () => async (dispatch) => {
    try {
        dispatch(fetchDataStart());
        const { data } = await axios.get('/api/admin/admin-orders', {
            withCredentials: true
        });
        if (data.success) {
            dispatch(setAllOrders(data.allOrders));
        } else {
            dispatch(fetchDataFailure(data.message));
        }
    } catch (error) {
        dispatch(fetchDataFailure(error.message));
    }
};