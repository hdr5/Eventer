import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { addEventToCalendar } from "../../services/calendarService";


export const fetchEvents = createAsyncThunk('event/fetchEvents', async () => {

  console.log('calling /api/events...');
  const response = await axiosClient.get('api/events');
  console.log('response:', response.data);
  return response.data;
});

export const fetchEvent = createAsyncThunk('event/fetchEvent', async (eventId) => {
  const response = await axiosClient.get(`api/events/${eventId}`);
  return response.data;
});
export const fetchEventsByIds = createAsyncThunk(
  'event/fetchEventsByIds',
  async (eventIds) => {
    const res = await axiosClient.post('api/events/by-ids', { ids: eventIds });
    return res.data;
  }
);


export const fetchEventsByProducer = createAsyncThunk('event/fetchEventsByProducer', async (producerId) => {
  const response = await axiosClient.get(`api/events?pro=${producerId}`);
  console.log('fetch fetchEventsByProducer | ', response.data);

  return response.data;
});

export const deleteEvent = createAsyncThunk('event/deleteEvent', async (eventId) => {
  await axiosClient.delete(`api/events/${eventId}`);
  return eventId;
});
export const editEventAction = createAsyncThunk(
  "event/editEvent",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/api/events/${id}`, updatedData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to edit event");
    }
  }
);
export const createEvent = createAsyncThunk('event/createEvent', async (eventData, { rejectWithValue, dispatch }) => {
  try {
    const response = await axiosClient.post('api/events', eventData);

    const createdEvent = response.data;
    try {

      // await dispatch(addEventToCalendar(createdEvent));
    } catch (err) {
      console.warn('Event created but failed to add to calendar', err);
    }

    return createdEvent;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to create event');
  }
})

// export const uploadEventImages = createAsyncThunk(
//   "event/uploadImages",
//   async (files, thunkAPI) => {
//     try {
//       const uploaded = [];

//       for (const file of files) {
//         // ✅ Check MIME type (only allow images)
//         if (!file.type.startsWith("image/")) {
//           alert("Only image files are allowed");
//           continue; // Skip this file
//         }

//         const formData = new FormData();
//         formData.append("image", file);

//         const res = await axiosClient.post("http://localhost:3003/api/uploads", formData);
//         const imageUrl = `http://localhost:3003${res.data.imageUrl}`;
//         uploaded.push(imageUrl);
//       }

//       return uploaded;
//     } catch (err) {
//       console.error("Upload failed", err);
//       return thunkAPI.rejectWithValue("Image upload failed");
//     }
//   }
// );

