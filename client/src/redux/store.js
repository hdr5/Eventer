import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice.js'
import eventReducer from '../features/events/eventSlice.js'
import authReducer from '../features/auth/authSlice.js'
import registrationReducer from '../features/registration/registrationSlice.js'
import notificationReducer from '../features/notifications/notificationSlice.js'

const store = configureStore({
    reducer: {
        user: userReducer,
        event: eventReducer,
        auth: authReducer,
        registration: registrationReducer,
        notification: notificationReducer
    },
});


export default store;