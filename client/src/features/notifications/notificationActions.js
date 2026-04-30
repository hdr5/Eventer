import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";


// 📌 שליפת התראות למשתמש
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId) => {
    const res = await axiosClient.get(`/api/notifications/${userId}`);
    return res.data;
  }
);

// 📌 יצירת התראה חדשה
export const addNotification = createAsyncThunk(
  "notifications/addNotification",
  async (notification) => {
    const res = await axiosClient.post(`/api/notifications/`, notification);

    return res.data;
  }
);

// 📌 סימון התראה כנקראה
export const readNotification = createAsyncThunk(
  "notifications/readNotification",
  async (id) => {
    const res = await axiosClient.put(`/api/notifications/${id}/read`);
    return res.data;
  }
);

// 📌 מחיקת התראה
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id) => {
    await axiosClient.delete(`/api/notifications/${id}`);
    return id;
  }
);