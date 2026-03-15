import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3003/';
axios.defaults.withCredentials = true;


// 📌 שליפת התראות למשתמש
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId) => {
    const res = await axios.get(`/api/notifications/${userId}`);
    return res.data;
  }
);

// 📌 יצירת התראה חדשה
export const addNotification = createAsyncThunk(
  "notifications/addNotification",
  async (notification) => {
    const res = await axios.post(`/api/notifications/`, notification);
        console.log('addddddddddddd', res.data);
    
    return res.data;
  }
);

// 📌 סימון התראה כנקראה
export const readNotification = createAsyncThunk(
  "notifications/readNotification",
  async (id) => {
    const res = await axios.put(`/api/notifications/${id}/read`);
    return res.data;
  }
);

// 📌 מחיקת התראה
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id) => {
    await axios.delete(`/api/notifications/${id}`);
    return id;
  }
);