import { createSlice } from "@reduxjs/toolkit";

const sellerSlice = createSlice({
    name: "seller",
    initialState: {
        sellerAuthenticated: false,
        sellerLoading: false,
        seller: null,
        sellerError: null,

        // Shop events (shown on the shop profile page)
        shopEvents: [],
        eventsLoading: false,
        eventsError: null,

        // Shop reviews (shown on the shop profile page)
        shopReviews: [],
        reviewsSummary: null,
        reviewsLoading: false,
        reviewsError: null
    },
    reducers: {
        signInStart: (state) => {
            state.sellerLoading = true
        },
        signInSuccess: (state, action) => {
            state.seller = action.payload
            state.sellerLoading = false
            state.sellerError = null
        },
        signInFailure: (state, action) => {
            state.sellerError = action.payload
            state.sellerLoading = false
        },
        LoadSellerRequest: (state) => {
            state.sellerLoading = true
        },
        LoadSellerSuccess: (state, action) => {
            state.sellerAuthenticated = true
            state.sellerLoading = false
            state.seller = action.payload
        },
        LoadSellerFail: (state, action) => {
            state.sellerAuthenticated = false
            state.sellerLoading = false
            state.sellerError = action.payload
            state.seller = null
        },


        UpdateSellerRequest: (state) => {
            state.sellerLoading = true
        },
        UpdateSellerSuccess: (state, action) => {
            state.sellerAuthenticated = true
            state.sellerLoading = false
            state.seller = action.payload
        },
        UpdateSellerFail: (state, action) => {
            state.sellerAuthenticated = false
            state.sellerLoading = false
            state.sellerError = action.payload
            state.seller = null
        },
        ClearError: (state) => {
            state.sellerError = null
        },


        // --- SHOP EVENTS ---
        FetchShopEventsRequest: (state) => {
            state.eventsLoading = true
            state.eventsError = null
        },
        FetchShopEventsSuccess: (state, action) => {
            state.shopEvents = action.payload
            state.eventsLoading = false
            state.eventsError = null
        },
        FetchShopEventsFail: (state, action) => {
            state.eventsLoading = false
            state.eventsError = action.payload
        },


        // --- SHOP REVIEWS ---
        FetchShopReviewsRequest: (state) => {
            state.reviewsLoading = true
            state.reviewsError = null
        },
        FetchShopReviewsSuccess: (state, action) => {
            state.shopReviews = action.payload.reviews
            state.reviewsSummary = action.payload.summary
            state.reviewsLoading = false
            state.reviewsError = null
        },
        FetchShopReviewsFail: (state, action) => {
            state.reviewsLoading = false
            state.reviewsError = action.payload
        }
    }
})

export const {
    LoadSellerRequest,
    LoadSellerSuccess,
    LoadSellerFail,
    UpdateSellerRequest,
    UpdateSellerSuccess,
    UpdateSellerFail,
    ClearError,
    FetchShopEventsRequest,
    FetchShopEventsSuccess,
    FetchShopEventsFail,
    FetchShopReviewsRequest,
    FetchShopReviewsSuccess,
    FetchShopReviewsFail
} = sellerSlice.actions
export default sellerSlice.reducer