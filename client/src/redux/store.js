import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
    },
    // Redux Toolkit automatically adds thunk middleware and devTools
});

export default store;