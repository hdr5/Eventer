import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";


export const searchAddress = createAsyncThunk(
  "location/search",
  async (query, { rejectWithValue }) => {
    try {
      console.log('searchLocation - CLIENT');

      const res = await axiosClient.get(`/api/location/search?q=${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Search failed");
    }
  }
);

export const reverseGeocode = createAsyncThunk(
  "location/reverse",
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(
        `/api/location/reverse?lat=${lat}&lon=${lon}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Reverse failed");
    }
  }
);