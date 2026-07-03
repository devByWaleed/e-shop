import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import loadingReducer from './slices/loadingSlice';
import sellerReducer from './slices/sellerSlice';
import productReducer from './slices/productSlice';
import eventReducer from './slices/eventSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
        seller: sellerReducer,
        product: productReducer,
        event: eventReducer
    },
    // Redux Toolkit automatically adds thunk middleware and devTools
});

export default store;