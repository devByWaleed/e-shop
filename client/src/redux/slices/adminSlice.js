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

        // --- REDUCERS FOR USERS AND SELLERS ---
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
        fetchDataFailure: (state, action) => {
            state.dataLoading = false;
            state.adminError = action.payload;
        }
    }
})

export const { adminSignInStart, adminSignInSuccess, adminSignInFailure, adminLogout, ClearAdminError, fetchDataStart, setAllUsers, setAllSellers, fetchDataFailure } = adminSlice.actions
export default adminSlice.reducer