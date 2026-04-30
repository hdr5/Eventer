import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

// ========= Admin actions =========

// Get all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axiosClient.get('api/users/');
    return response.data;
});

// Delete user
export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
    await axiosClient.delete(`api/users/${userId}`);
    return userId;
});

// Update user
export const updateUser = createAsyncThunk('users/updateUser', async ({ userId, editedUser }) => {
    const response = await axiosClient.put(`api/users/${userId}`, editedUser);
    return response.data;
});

// Add user
export const addUser = createAsyncThunk('users/addUser', async (user) => {
    const response = await axiosClient.post(`api/users/`, user);
    return response.data;
});

// Fetch single user data (for admin)
export const fetchUserData = createAsyncThunk(
    'users/fetchUserData',
    async (userId) => {
        const response = await axiosClient.get(`api/users/${userId}`);
        return response.data;
    }
);
