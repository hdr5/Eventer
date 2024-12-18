import express from 'express';

import Event from '../models/event.js'
import Location from '../models/location.js';
import Registration from '../models/registration.js';
import Payment from '../models/payment.js';
import { notifyClients } from '../server.js';
import User from '../models/user.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  const events = await Event.find().populate('location');
  res.json(events);
  res.status(200);
});

router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id).populate('location');
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
});

router.post('/', async (req, res) => {

  let location = null;
  if (req.body.location) {
    location = new Location(req.body.location);
    await location.save();
  }
  
  const newEvent = new Event({
    ...req.body,
    date: new Date(),
    location: location ? location._id : null,
  });
  await newEvent.save();

  for (let registration of req.body.registrations) {
    const userId = registration.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    // Check if the event is already in the user's registeredEvents
    if (!user.registeredEvents.includes(newEvent._id)) {
      user.registeredEvents.push(newEvent._id);
      await user.save(); // Save the user after updating the registeredEvents
    }
  }

  notifyClients({
    type: 'NEW_EVENT',
  });

  res.status(201).json({ message: 'Event created successfully' });

});

router.put('/:id', async (req, res) => {
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedEvent) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(updatedEvent);
});

router.delete('/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);

  notifyClients({
    type: 'EVENT_DELETED'
  });

  res.status(200).json({ message: 'Event delete successfully' });
});


router.get('/:eventId/locations', async (req, res) => {
  // const eventObjectId = mongoose.Types.ObjectId(req.params.eventId);
  // const location = await Location.findOne({ event: eventObjectId });
  // if (!location) {
  //   return res.status(404).json({ message: 'Location not found' });
  // }
  // res.json(location);
  try {
    const event = await Event.findById(req.params.eventId).populate('location');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const location = event.location;
    if (!location) {
      return res.status(404).json({ message: 'Location not found for this event' });
    }

    res.json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// router.post('/:eventId/locations', async (req, res) => {
//   const newLocation = new Location({ ...req.body, event: req.params.eventId });
//   await newLocation.save();
//   res.json(newLocation);
// });

// router.put('/:eventId/locations', async (req, res) => {
//   const updatedLocation = await Location.findOneAndUpdate({ event: req.params.eventId }, req.body, { new: true });
//   if (!updatedLocation) {
//     return res.status(404).json({ message: 'Location not found' });
//   }
//   res.json(updatedLocation);
// });

// הרשמה
router.post('/:eventId/register', async (req, res) => {
    try {
    const { userId } = req.body; // User ID from request body
    const { eventId } = req.params; // Event ID from request params

    // Validate eventId and userId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.log("מזהה האירוע אינו חוקי");
      return res.status(400).json({ message: "מזהה האירוע אינו חוקי" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("מזהה המשתמש אינו חוקי", userId);
      return res.status(400).json({ message: "מזהה המשתמש אינו חוקי" });
    }

    // Fetch event and user
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
      return res.status(404).json({ message: "אירוע או משתמש לא נמצאו" });
    }

    // Check if the user is already registered
    const existingRegistration = await Registration.findOne({
      eventId,
      userId,
    });

    if (existingRegistration) {
      console.log("המשתמש כבר רשום לאירוע");
      return res.status(400).json({ message: "המשתמש כבר רשום לאירוע" });
    }

    // Create a new Registration document
    const registration = new Registration({
      eventId: event._id,
      userId: user._id,
      status: "pending", // Default status
    });

    // Save the registration to the database
    await registration.save();

    // Add the registration to event and user
    event.registrations.push({
      userId: user._id,
      status: registration.status,
    });
    user.registeredEvents.push(event._id);

    // Save the event and user
    await event.save();
    await user.save();

    console.log("Registration created successfully", registration._id);

    return res.status(200).json({
      message: "ההרשמה בוצעה בהצלחה",
      event,
      user,
      registration,
    });
  } catch (error) {
    console.error("Error registering user to event:", error.message);
    return res.status(500).json({ message: "שגיאה בשרת" });
  }
});
// router.get('/:eventId/registrations', async (req, res) => {
//   const registrations = await Registration.find({ eventId: req.params.eventId });
//   res.json(registrations);
// });

// router.post('/:eventId/registrations', async (req, res) => {
//   const newRegistration = new Registration({ ...req.body, eventId: req.params.eventId });
//   await newRegistration.save();
//   res.json(newRegistration);
// });

// תשלומים

// router.get('/:eventId/registrations/:registrationId/payments', async (req, res) => {
//   const payment = await Payment.findOne({ registrationId: req.params.registrationId });
//   if (!payment) {
//     return res.status(404).json({ message: 'Payment not found' });
//   }
//   res.json(payment);
// });

// router.post('/:eventId/registrations/:registrationId/payments', async (req, res) => {
//   const newPayment = new Payment({ ...req.body, registrationId: req.params.registrationId });
//   await newPayment.save();
//   res.json(newPayment);
// });

export default router;