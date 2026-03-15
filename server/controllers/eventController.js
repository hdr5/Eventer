
// import mongoose from "mongoose";
// import Event from '../models/event.js';

// // Get all events (filtered by producer if needed)
// export const getAllEvents = async (req, res) => {
//   try {
//     const { pro } = req.query;

// const query = pro ? { owner: mongoose.Types.ObjectId(pro) } : {};
//     console.log('query getAllEvents ** ', query);

//     const events = await Event.find(query);
//     //.populate("location");
//     res.status(200).json(events);
//   } catch (error) {
//      console.error("Fetch events error:", error);
//     res.status(500).json({ message: "Error fetching events", error:error.message });
//   }

// };

// export const getEventsByIds = async (req, res) => {
//   try {
//     const { ids } = req.body; // array of eventIds

//     const events = await Event.find({ _id: { $in: ids } });

//     res.status(200).json(events);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch events' });
//   }
// };

// // Get a single event by ID
// export const getEventById = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id).populate("location");
//     if (!event) return res.status(404).json({ message: "Event not found" });
//     res.status(200).json(event);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching event", error });
//   }
// };

// // Create a new event
// export const createEvent = async (req, res) => {
//   try {
//     const keywords = req.body.keywords
//       ? req.body.keywords.split(",").map(k => k.trim())
//       : [];

//     const newEvent = new Event({
//       ...req.body,
//       keywords,
//       date: req.body.date ? new Date(req.body.date) : null,
//       owner: req.user.id,
//     });

//     await newEvent.save();
//     res.status(201).json(newEvent);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating event", error });
//   }
// };


// // Update an event
// export const updateEvent = async (req, res) => {  
//   try {
//     const updatedEvent = await Event.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
//     res.status(200).json(updatedEvent);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating event", error });
//   }
// };

// // Delete an event
// export const deleteEvent = async (req, res) => {
//   try {
//     await Event.findByIdAndDelete(req.params.id);
//     notifyClients({ type: "EVENT_DELETED" });
//     res.status(200).json({ message: "Event deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting event", error });
//   }
// };

// // Get locations for an event
// export const getEventLocations = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.eventId).populate("location");
//     if (!event) return res.status(404).json({ message: "Event not found" });

//     const location = event.location;
//     if (!location) return res.status(404).json({ message: "Location not found for this event" });

//     res.status(200).json(location);
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error", error });
//   }
// };

// export const checkOwnership = async (req, res, next) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     console.log('req.user.rol: -------------------- ', req.user);
//     // console.log('event.owner: --------------------------- ', event.owner.toString(), user._id);
//     // const user = await User.findById(req.user.id);

//     // if (user.role !== "admin" && event.owner.toString() !== user._id) {
//     //   return res.status(403).json({ message: "Not authorized" });
//     // }

//     next();
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

import mongoose from "mongoose";
import Event from "../models/event.js";
import User from "../models/user.js";
import Registration from "../models/registration.js";

/* =========================
   GET ALL EVENTS
========================= */

export const getAllEvents = async (req, res) => {
  try {
    const { pro } = req.query;

    const query =
      pro && mongoose.Types.ObjectId.isValid(pro)
        ? { owner: new mongoose.Types.ObjectId(pro) }
        : {};

    const events = await Event.find(query);

    res.status(200).json(events);
  } catch (error) {
    console.error("Fetch events error:", error);

    res.status(500).json({
      message: "Error fetching events",
      error: error.message
    });
  }
};

/* =========================
   GET EVENTS BY IDS
========================= */

export const getEventsByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    const events = await Event.find({
      _id: { $in: ids }
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch events"
    });
  }
};

/* =========================
   GET SINGLE EVENT
========================= */

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({
        message: "Event not found"
      });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching event",
      error: error.message
    });
  }
};

/* =========================
   CREATE EVENT
========================= */

export const createEvent = async (req, res) => {
  try {

    const keywords = req.body.keywords
      ? req.body.keywords.split(",").map(k => k.trim())
      : [];

    const newEvent = new Event({
      ...req.body,
      keywords,
      date: req.body.date ? new Date(req.body.date) : null,
      owner: req.user.id
    });

    await newEvent.save();

    res.status(201).json(newEvent);

  } catch (error) {

    res.status(500).json({
      message: "Error creating event",
      error: error.message
    });

  }
};

/* =========================
   UPDATE EVENT
========================= */

export const updateEvent = async (req, res) => {
  try {

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEvent)
      return res.status(404).json({
        message: "Event not found"
      });

    res.status(200).json(updatedEvent);

  } catch (error) {

    res.status(500).json({
      message: "Error updating event",
      error: error.message
    });

  }
};

/* =========================
   DELETE EVENT
========================= */

export const deleteEvent = async (req, res) => {

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const eventId = req.params.id;

    const event = await Event.findById(eventId).session(session);

    if (!event) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        message: "Event not found"
      });
    }

    /* 1️⃣ מחיקת האירוע */
    await Event.findByIdAndDelete(eventId).session(session);

    /* 2️⃣ הסרת האירוע מכל המשתמשים */
    await User.updateMany(
      { registeredEvents: eventId },
      { $pull: { registeredEvents: eventId } },
      { session }
    );

    /* 3️⃣ מחיקת כל ההרשמות */
    await Registration.deleteMany(
      { eventId },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Event deleted successfully"
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: "Error deleting event",
      error: error.message
    });

  }
};
// export const deleteEvent = async (req, res) => {

//   try {

//     const deleted = await Event.findByIdAndDelete(req.params.id);

//     if (!deleted)
//       return res.status(404).json({
//         message: "Event not found"
//       });

//     res.status(200).json({
//       message: "Event deleted successfully"
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: "Error deleting event",
//       error: error.message
//     });

//   }
// };