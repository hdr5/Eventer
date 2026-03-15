// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// axios.defaults.baseURL = 'http://localhost:3003/';
// axios.defaults.withCredentials = true;

// export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
//     const response = await axios.get('api/users/');
//     return response.data;
// });
// export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
//     await axios.delete(`api/users/${userId}`);
//     return userId;
// })
// export const updateUser = createAsyncThunk('users/updateUser', async ({userId, editedUser}) => {
//     const response = await axios.put(`api/users/${userId}`, editedUser);   
//     return response.data;
// });

// export const addUser = createAsyncThunk('users/addUser', async (user) => {
//     const response = await axios.post(`api/users/`, user);
//     return response.data;
// })
// export const fetchUserData = createAsyncThunk(
//   'users/fetchUserData', 
//   async (userId) => {
//     const response = await axios.get(`api/users/${userId}`);
//     return response.data; // Assuming the response includes registered events and other info
//   }
// );
// export const addToFavorites = createAsyncThunk(
//   'events/addToFavorites',
//   async ({ eventId, userId }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`api/users/add-favorite/${eventId}/`, { userId });
//       console.log('hhhhh ', response.data);
      
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );
// export const removeFromFavorites = createAsyncThunk(
//   'events/removeFromFavorites',
//   async ({ eventId, userId }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`api/users/remove-favorite/${eventId}/`, { userId });
//       return response.data; // מחזיר את המשתמש המעודכן
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to remove favorite");
//     }
//   }
// );


import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3003/';
axios.defaults.withCredentials = true;

// ========= Admin actions =========

// Get all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get('api/users/');
    return response.data;
});

// Delete user
export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
    await axios.delete(`api/users/${userId}`);
    return userId;
});

// Update user
export const updateUser = createAsyncThunk('users/updateUser', async ({userId, editedUser}) => {
    const response = await axios.put(`api/users/${userId}`, editedUser);   
    return response.data;
});

// Add user
export const addUser = createAsyncThunk('users/addUser', async (user) => {
    const response = await axios.post(`api/users/`, user);
    return response.data;
});

// Fetch single user data (for admin)
export const fetchUserData = createAsyncThunk(
  'users/fetchUserData', 
  async (userId) => {
    const response = await axios.get(`api/users/${userId}`);
    return response.data;
  }
);
