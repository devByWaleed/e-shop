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
    deleteUser,
    deleteSeller,
    setAllProducts,
    setAllEvents,
    setAllOrders
} from "../slices/adminSlice";
import toast from "react-hot-toast";


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


// Delete Specific User
export const deleteUserAction = (id) => async (dispatch) => {
    try {
        dispatch(fetchDataStart());

        const { data } = await axios.delete(`/api/admin/delete-user-by-id/${id}`, {
            withCredentials: true
        });

        if (data.success) {
            dispatch(deleteUser(id));
            toast.success(data.message)
        } else {
            toast.error(data.message)
            dispatch(fetchDataFailure(data.message));
        }
    } catch (error) {
        toast.error(error.message)
        dispatch(fetchDataFailure(error.message));
    }
}


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

// Delete Specific User
export const deleteSellerAction = (id) => async (dispatch) => {
    try {
        dispatch(fetchDataStart());

        const { data } = await axios.delete(`/api/admin/delete-seller-by-id/${id}`, {
            withCredentials: true
        });

        if (data.success) {
            dispatch(deleteSeller(id));
            toast.success(data.message)
        } else {
            toast.error(data.message)
            dispatch(fetchDataFailure(data.message));
        }
    } catch (error) {
        toast.error(error.message)
        dispatch(fetchDataFailure(error.message));
    }
}


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