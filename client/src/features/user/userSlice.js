import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3003";
axios.defaults.withCredentials = true;

// ========= Thunks =========

// Get all users (admin)
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get("/api/users/");
  return response.data;
});

// Delete user (admin)
export const deleteUser = createAsyncThunk("users/deleteUser", async (userId) => {
  await axios.delete(`/api/users/${userId}`);
  return userId;
});

// Update user (admin)
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, editedUser }) => {
    const response = await axios.put(`/api/users/${userId}`, editedUser);
    return response.data;
  }
);

// Add user (admin)
export const addUser = createAsyncThunk("users/addUser", async (user) => {
  const response = await axios.post(`/api/users/`, user);
  return response.data;
});

// ========= Slice =========
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      })

      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload._id;
        const index = state.users.findIndex((u) => u._id === updatedUser._id);
        if (index !== -1) state.users[index] = updatedUser;
      })

      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      });
  },
});

export const { setUsers, setStatus, setError } = userSlice.actions;
export default userSlice.reducer;
