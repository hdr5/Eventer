import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// uploadImage: target = "avatar" | "event", id = userId או eventId
export const uploadImage = createAsyncThunk(
  "upload/uploadImage",
  async ({ file, target, id }, { rejectWithValue }) => {
    try {
      if (!file) throw new Error("No file provided");
      if (!id) throw new Error("id is required for upload");

      const formData = new FormData();
      formData.append("image", file);

      const url = `http://localhost:3003/api/uploads?type=${target}&id=${id}`;

      const response = await axios.post(url, formData, { withCredentials: true });

      // החזרת secure_url שמגיע מ-Cloudinary
      return {
        imageUrl: response.data.imageUrl,
        target,
        id,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || "Upload failed");
    }
  }
);
