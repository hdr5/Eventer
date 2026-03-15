import { createSlice } from "@reduxjs/toolkit";
import { uploadImage } from "../upload/uploadActions.js";

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    avatarUrl: "",
    eventImageUrl: "",
    loading: false,
    error: null,
  },
  reducers: {
    clearAvatar(state) {
      state.avatarUrl = "";
    },
    clearEventImage(state) {
      state.eventImageUrl = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        const { imageUrl, target } = action.payload;

        if (target === "avatar") state.avatarUrl = imageUrl;
        else if (target === "event") state.eventImageUrl = imageUrl;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Upload failed";
      });
  },
});

export const { clearAvatar, clearEventImage } = uploadSlice.actions;
export default uploadSlice.reducer;
