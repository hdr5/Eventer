import { createSlice } from "@reduxjs/toolkit";
import { searchAddress, reverseGeocode } from "./locationActions";

const initialState = {
  results: [],
  selectedLocation: null,
  status: "idle",
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // SEARCH
      .addCase(searchAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload;
      })
      .addCase(searchAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // REVERSE
      .addCase(reverseGeocode.fulfilled, (state, action) => {
        state.selectedLocation = action.payload;
      });
  },
});

export default locationSlice.reducer;