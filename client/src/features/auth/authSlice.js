import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, logout, fetchUser, updateProfile, addFavorite, removeFavorite } from './authActions';


// ========= Slice =========
const authSlice = createSlice({
    name: "auth",
    initialState: {
        currentUser: null,
        isAuthenticated: false,
        status: "idle",
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.status = "succeeded";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Register
            .addCase(registerUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.status = "succeeded";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.currentUser = null;
            })
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.status = 'succeeded';
            })
            .addCase(fetchUser.rejected, (state) => {
                state.currentUser = null;
                state.isAuthenticated = false;
                state.status = 'failed';
            })

            .addCase(updateProfile.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                if (state.currentUser) {
                    state.currentUser.favoriteEvents = action.payload;
                }
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                if (state.currentUser) {
                    state.currentUser.favoriteEvents = action.payload;
                }
            })


    },
});

export const {
    clearError,

} = authSlice.actions;

export default authSlice.reducer;
