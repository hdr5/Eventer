import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";


// Register a user for an event - change the user send to use user from token
export const registerForEvent = createAsyncThunk(
  "registration/registerForEvent",
  async ({ eventId, userId }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/api/registrations/event/${eventId}`, { userId });
      return response.data; // מחזיר את כל האובייקט {message, eventId, user, registration}
    } catch (error) {
      alert(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const fetchRegistrationsForEvent = createAsyncThunk(
  "registration/fetchRegistrationsForEvent",
  async (eventId, thunkAPI) => {
    try {
      const res = await axiosClient.get(`/api/registrations/event/${eventId}`);
      return { eventId, registrations: res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const cancelRegistration = createAsyncThunk(
  "registration/cancel",
  async (registrationId, thunkAPI) => {
    try {
      const response = await axiosClient.delete(`/api/registrations/${registrationId}`);
      console.log('res:  ', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Cancel failed");
    }
  }
);