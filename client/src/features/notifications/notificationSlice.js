import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  addNotification,
  readNotification,
  deleteNotification,
} from "./notificationActions";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 📌 fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 📌 addNotification
      .addCase(addNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
      })

      // 📌 readNotification
      .addCase(readNotification.fulfilled, (state, action) => {
        const notif = state.notifications.find((n) => n._id === action.payload._id);
        if (notif) notif.read = true;
      })

      // 📌 deleteNotification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload
        );
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;