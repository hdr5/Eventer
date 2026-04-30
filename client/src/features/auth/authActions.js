import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import { setFavorites, clearFavorites } from '../auth/authSlice';

/* ===================== LOGIN ===================== */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axiosClient.post('/api/auth/login', userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);


/* ===================== REGISTER ===================== */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axiosClient.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

/* ===================== FETCH USER (SESSION) ===================== */
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get('/api/auth/session');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user'
      );
    }
  }
);


/* ===================== UPDATE PROFILE ===================== */

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updates, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put('/api/auth/profile', updates, {
        headers: { "Content-Type": "application/json" },
      });

      return response.data.user; // data.user לפי מה שה־backend מחזיר
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to update profile'
      );
    }
  }
);
/* ===================== LOGOUT ===================== */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await axiosClient.post('/api/auth/logout');
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

export const addFavorite = createAsyncThunk(
  "auth/addFavorite",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(
        `/api/auth/me/favorites/${eventId}`
      );
      return res.data?.favoriteEvents; // ⬅️ חשוב
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add favorite"
      );
    }
  }
);
export const removeFavorite = createAsyncThunk(
  "auth/removeFavorite",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.delete(
        `/api/auth/me/favorites/${eventId}`
      );
      return res.data?.favoriteEvents;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove favorite"
      );
    }
  }
);


