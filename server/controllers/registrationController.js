import mongoose from "mongoose";

import Registration from "../models/registration.js";
import Event from "../models/event.js";
import User from "../models/user.js";
// import { sendEmail } from '../utils/sendEmail.js';


// Get registration list for an event (not just count)
export const getRegistrationsForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "Invalid event ID" });
        }

        const registrations = await Registration.find({ eventId }).lean();

        // res.status(200).json({ eventId, registrations });
        res.status(200).json(registrations);
    } catch (error) {
        console.error("getRegistrationsForEvent error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Register a user for an event
// export const registerForEvent = async (req, res) => {
//     console.log('register_function started');

//     try {
//         const { userId } = req.body;
//         const { eventId } = req.params;

//         console.log('userId:', userId);
//         console.log('eventId:', eventId);

//         if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ message: "Invalid event or user ID" });
//         }

//         const event = await Event.findById(eventId);
//         const user = await User.findById(userId);
//         if (!event || !user) return res.status(404).json({ message: "Event or user not found" });



//         const existingRegistration = await Registration.findOne({ eventId, userId });
//         if (existingRegistration) return res.status(400).json({ message: "User already registered" });

//         const approvedCount = await Registration.countDocuments({ eventId, status: 'approved' });
//         const availableSpots = event.participants - approvedCount;
//         if (availableSpots <= 0) {
//             return res.status(400).json({ message: "No available spots for this event" });
//         }

//         console.log('available spots: ', availableSpots);

//         const registration = new Registration({ eventId, userId, status: "pending" });
//         await registration.save();

//         user.registeredEvents.push(event._id);

//         await user.save();

//         res.status(200).json({ message: "Registration successful", user, registration });

//     } catch (error) {
//         console.error("Registration error:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };
export const registerForEvent = async (req, res) => {
  try {

    const { userId } = req.body;
    const { eventId } = req.params;

    const existing = await Registration.findOne({ userId, eventId });

    if (existing) {
      return res.status(400).json({
        message: "User already registered"
      });
    }

    const registration = await Registration.create({
      userId,
      eventId,
      status: "pending"
    });

    res.status(201).json(registration);

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};

// Cancel registration
export const cancelRegistration = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const registration = await Registration.findById(registrationId);
        if (!registration) return res.status(404).json({ message: "Registration not found" });
        // registration.status = 'rejected'; 
        // Alternatively, can delete the registration
        await registration.save();
        // Remove registration from event and user 
        const event = await Event.findById(registration.eventId);
        const user = await User.findById(registration.userId);
        user.registeredEvents = user.registeredEvents.filter(eventId =>
            eventId.toString() !== registration.eventId);
        await event.save();
        await user.save();
        res.status(200).json({ message: "Registration cancelled", registration });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update payment status for a registration
export const updatePaymentStatus = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const { paymentStatus } = req.body; // 'paid', 'unpaid'

        if (!['paid', 'unpaid'].includes(paymentStatus)) {
            return res.status(400).json({ message: "Invalid payment status" });
        }

        const registration = await Registration.findById(registrationId);
        if (!registration) return res.status(404).json({ message: "Registration not found" });

        registration.paymentStatus = paymentStatus;
        await registration.save();

        res.status(200).json({ message: "Payment status updated", registration });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
