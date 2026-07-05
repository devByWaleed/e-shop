import axios from "axios"
import { CreateEventRequest, CreateEventSuccess, CreateEventFail, ClearError, ResetEventState, getShopEventsRequest, getShopEventsSuccess, getShopEventsFail, getAllEventsRequest, getAllEventsSuccess, getAllEventsFail, deleteEventRequest, deleteEventSuccess, deleteEventFail } from "../slices/eventSlice"

export const createEventProduct = (newForm) => async (dispatch, getState) => {
    try {
        dispatch(CreateEventRequest())

        const config = { headers: { "Content-Type": "multipart/form-data" } }

        const { data } = await axios.post('/api/event/event-product', newForm, config)

        if (data.success) {
            dispatch(CreateEventSuccess(data.eventProduct));
        } else {
            dispatch(CreateEventFail(data.message));
        }

    } catch (error) {
        dispatch(CreateEventFail(error.message))
    }
}


export const getShopEvents = (id) => async (dispatch, getState) => {
    try {
        dispatch(getShopEventsRequest())

        const { data } = await axios.get(`/api/event/get-shop-events/${id}`)

        if (data.success) {
            dispatch(getShopEventsSuccess(data.shopEvents));
        } else {
            dispatch(getShopEventsFail(data.message));
        }

    } catch (error) {
        dispatch(getShopEventsFail(error.message))
    }
}

export const getAllEvents = () => async (dispatch, getState) => {
    try {
        dispatch(getAllEventsRequest())

        const { data } = await axios.get(`/api/event/get-all-events`)

        if (data.success) {
            dispatch(getAllEventsSuccess(data.allEvents));
        } else {
            dispatch(getAllEventsFail(data.message));
        }

    } catch (error) {
        dispatch(getAllEventsFail(error.message))
    }
}


export const deleteEvent = (id) => async (dispatch, getState) => {
    try {
        dispatch(deleteEventRequest())

        const { data } = await axios.delete(`/api/event/delete-event/${id}`)

        if (data.success) {
            dispatch(deleteEventSuccess(data.message));
        } else {
            dispatch(deleteEventFail(data.message));
        }

    } catch (error) {
        dispatch(deleteEventFail(error.message))
    }
}