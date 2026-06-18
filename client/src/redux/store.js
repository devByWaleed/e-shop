import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import loadingReducer from './slices/loadingSlice';
// import themeReducer from './slices/themeSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
        // theme: themeReducer
    },
    // Redux Toolkit automatically adds thunk middleware and devTools
});

export default store;