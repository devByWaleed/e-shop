import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
    name: "event",
    initialState: {
        eventSuccess: false,
        eventLoading: false,
        event: null,
        shopEvents: [],
        allEvents: [],
        eventError: null
    },
    reducers: {
        CreateEventRequest: (state) => {
            state.eventLoading = true
            state.eventSuccess = false
            state.eventError = null
        },
        CreateEventSuccess: (state, action) => {
            state.eventSuccess = true
            state.eventLoading = false
            state.event = action.payload
            state.eventError = null
        },
        CreateEventFail: (state, action) => {
            state.eventSuccess = false
            state.eventLoading = false
            state.eventError = action.payload
        },
        ClearError: (state) => {
            state.eventError = null
        },
        ResetEventState: (state) => {
            state.eventSuccess = false
            state.eventLoading = false
            state.event = null
            state.eventError = null
        },
        getShopEventsRequest: (state) => {
            state.eventLoading = true
            state.eventSuccess = false
            state.eventError = null
        },
        getShopEventsSuccess: (state, action) => {
            state.eventSuccess = true
            state.eventLoading = false
            state.shopEvents = action.payload
            state.eventError = null
        },
        getShopEventsFail: (state, action) => {
            state.eventSuccess = false
            state.eventLoading = false
            state.eventError = action.payload
        },
        getAllEventsRequest: (state) => {
            state.eventLoading = true
            state.eventSuccess = false
            state.eventError = null
        },
        getAllEventsSuccess: (state, action) => {
            state.eventSuccess = true
            state.eventLoading = false
            state.allEvents = action.payload
            state.eventError = null
        },
        getAllEventsFail: (state, action) => {
            state.eventSuccess = false
            state.eventLoading = false
            state.eventError = action.payload
        },
        deleteEventRequest: (state) => {
            state.eventLoading = true
            state.eventSuccess = false
            state.eventError = null
        },
        deleteEventSuccess: (state, action) => {
            state.eventSuccess = true
            state.eventLoading = false
            state.message = action.payload
            state.eventError = null
        },
        deleteEventFail: (state, action) => {
            state.eventSuccess = false
            state.eventLoading = false
            state.eventError = action.payload
        },
        clearEventSuccess: (state) => {
            state.eventSuccess = false
        },
    }
})

export const { CreateEventRequest, CreateEventSuccess, CreateEventFail, ClearError, ResetEventState, getShopEventsRequest, getShopEventsSuccess, getShopEventsFail, getAllEventsRequest, getAllEventsSuccess, getAllEventsFail, deleteEventRequest, deleteEventSuccess, deleteEventFail, clearEventSuccess } = eventSlice.actions
export default eventSlice.reducer