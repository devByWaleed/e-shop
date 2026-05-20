import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isAuthenticated: false,
        loading: false,
        user: null,
        error: null
    },
    reducers: {
        LoadUserRequest: (state) => {
            state.loading = true
        },
        LoadUserSuccess: (state, action) => {
            state.isAuthenticated = true
            state.loading = false
            state.user = action.payload
        },
        LoadUserFail: (state, action) => {
            state.isAuthenticated = false
            state.loading = false
            state.error = action.payload
            state.user = null
        },
        ClearError: (state) => {
            state.error = null
        }
    }
})

export const { LoadUserRequest, LoadUserSuccess, LoadUserFail, ClearError } = userSlice.actions
export default userSlice.reducer