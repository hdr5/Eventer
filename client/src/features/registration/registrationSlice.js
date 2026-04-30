import { createSlice } from "@reduxjs/toolkit";
import { cancelRegistration, fetchRegistrationsForEvent, registerForEvent } from "./registartionActions";

const initialState = {
  registrationsByEvent: {
    // eventId: [{ userId, status, paymentStatus }]
  },
  statusByEvent: {},
  error: null,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerForEvent.pending, (state, action) => {
        const { eventId } = action.meta.arg;
        state.statusByEvent[eventId] = "loading";
      })

      .addCase(registerForEvent.fulfilled, (state, action) => {
        const { registration } = action.payload;

        const eventId = registration.eventId;

        if (!state.registrationsByEvent[eventId]) {
          state.registrationsByEvent[eventId] = [];
        }

        state.registrationsByEvent[eventId].push(registration);

        state.statusByEvent[eventId] = "succeeded";
      })

      .addCase(registerForEvent.rejected, (state, action) => {
        const { eventId } = action.meta.arg;
        state.statusByEvent[eventId] = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRegistrationsForEvent.fulfilled, (state, action) => {
        const { eventId, registrations } = action.payload;
        state.registrationsByEvent[eventId] = registrations;
      })
      .addCase(cancelRegistration.fulfilled, (state, action) => {
        const { registration } = action.payload;
        const eventId = registration.eventId;

        if (state.registrationsByEvent[eventId]) {
          state.registrationsByEvent[eventId] = state.registrationsByEvent[eventId].filter(
            (r) => r._id !== registration._id
          );
        }

        state.statusByEvent[eventId] = "succeeded";
      })
  }

})


export default registrationSlice.reducer;
