import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        adminAuthenticated: false,
        adminLoading: false,
        admin: null,
        adminError: null,

        // Stores Data
        allUsers: [],
        allSellers: [],
        allProducts: [],
        allEvents: [],
        allOrders: [],
        dataLoading: false // Dedicated loading state for fetching users/sellers
    },
    reducers: {
        adminSignInStart: (state) => {
            state.adminLoading = true
        },
        adminSignInSuccess: (state, action) => {
            state.admin = action.payload
            state.adminLoading = false
            state.adminAuthenticated = true
            state.adminError = null
        },
        adminSignInFailure: (state, action) => {
            state.adminError = action.payload
            state.adminLoading = false
        },
        adminLogout: (state) => {
            state.admin = null;
            state.adminLoading = false;
            state.adminAuthenticated = false;
            state.adminError = null;
        },
        ClearAdminError: (state) => {
            state.adminError = null
        },
        resetAdminState: (state) => {
            state.admin = null;
            state.adminLoading = false;
            state.adminAuthenticated = false;
            state.adminError = null;
        },

        // --- REDUCERS FOR GET ALL ---
        fetchDataStart: (state) => {
            state.dataLoading = true;
            state.adminError = null;
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
            state.dataLoading = false;
            state.adminError = null;
        },
        setAllSellers: (state, action) => {
            state.allSellers = action.payload;
            state.dataLoading = false;
            state.adminError = null;
        },
        setAllProducts: (state, action) => {
            state.allProducts = action.payload;
            state.dataLoading = false;
            state.adminError = null;
        },
        setAllEvents: (state, action) => {
            state.allEvents = action.payload;
            state.dataLoading = false;
            state.adminError = null;
        },
        setAllOrders: (state, action) => {
            state.allOrders = action.payload;
            state.dataLoading = false;
            state.adminError = null;
        },
        fetchDataFailure: (state, action) => {
            state.dataLoading = false;
            state.adminError = action.payload;
        },

        // --- DELETE REDUCERS ---
        deleteUser: (state, action) => {
            state.allUsers = state.allUsers.filter(user => user._id !== action.payload);
        },
        deleteSeller: (state, action) => {
            state.allSellers = state.allSellers.filter(seller => seller._id !== action.payload);
        }
    }
})

export const { adminSignInStart, adminSignInSuccess, adminSignInFailure, adminLogout, ClearAdminError, fetchDataStart, setAllUsers, setAllSellers, fetchDataFailure, deleteUser, deleteSeller, setAllProducts, setAllEvents, setAllOrders } = adminSlice.actions
export default adminSlice.reducer