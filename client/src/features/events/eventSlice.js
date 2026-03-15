import { createSlice } from "@reduxjs/toolkit";
import { createEvent, deleteEvent, editEventAction, fetchEvent, fetchEvents, fetchEventsByIds, fetchEventsByProducer, fetchRegistrations, registerToEvent, uploadEventImages } from "./eventActions";
import { registerForEvent } from "../registration/registartionActions";

const initialState = {
    events: [],
    eventsByOwner: [], //fetchEventsByProducer
    eventsById: {},  // Store events as an object for quick access o(1)
    // registrations: {},
    status: 'idle',
    images: [],
    uploadStatus: "idle",
    error: null
}

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents: (state, action) => {
            state.events = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearUploadedImages(state) {
            state.images = [];
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error?.message;
            })
            .addCase(fetchEventsByIds.fulfilled, (state, action) => {
                action.payload.forEach(event => {
                    state.eventsById[event._id] = event;
                });
            })
            .addCase(fetchEventsByProducer.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEventsByProducer.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.eventsByOwner = action.payload;
            })
            .addCase(fetchEventsByProducer.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchEvent.fulfilled, (state, action) => {
                state.eventsById = {   // ✅ New object reference
                    ...state.eventsById,
                    [action.payload._id]: action.payload
                };
            })
            .addCase(fetchEvent.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(deleteEvent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.events = state.events.filter(event => event.id !== action.payload);
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(editEventAction.fulfilled, (state, action) => {
                state.status = "succeeded";

                const updatedEvent = action.payload;

                // Update events array
                const index = state.events.findIndex((e) => e._id === updatedEvent._id);
                if (index !== -1) state.events[index] = updatedEvent;

                // Update eventsByOwner
                const ownerIndex = state.eventsByOwner.findIndex((e) => e._id === updatedEvent._id);
                if (ownerIndex !== -1) state.eventsByOwner[ownerIndex] = updatedEvent;

                // Update eventsById object
                state.eventsById[updatedEvent._id] = updatedEvent;
            })

            .addCase(createEvent.fulfilled, (state, action) => {
                state.events.push(action.payload)
            })
            .addCase(registerForEvent.fulfilled, (state, action) => {
                const updatedEventId = action.payload.eventId;

                // state.events = state.events.map(event =>
                //     event._id === updatedEventId ? updatedEvent : event
                // );

                // state.eventsByOwner = state.eventsByOwner.map(event =>
                //     event._id === updatedEvent._id ? updatedEvent : event
                // );

                // state.eventsById[updatedEventId] = updatedEvent;
            })
            // .addCase(uploadEventImages.pending, (state) => {
            //     state.uploadStatus = "loading";
            // })
            // .addCase(uploadEventImages.fulfilled, (state, action) => {
            //     state.uploadStatus = "succeeded";
            //     state.images = [...state.images, ...action.payload];
            // })
            // .addCase(uploadEventImages.rejected, (state, action) => {
            //     state.uploadStatus = "failed";
            //     state.error = action.payload;
            // });
    },
});

export const { setEvents, setStatus, setError, clearUploadedImages } = eventSlice.actions;

export default eventSlice.reducer;