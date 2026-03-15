import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  // getEventLocations,
  getEventsByIds
} from "../controllers/eventController.js";

import { getRegistrationsForEvent } from "../controllers/registrationController.js";
import { authorizeRoles } from "../middleware/authorization.js";
import { checkOwnership } from "../middleware/ownership.js";

const router = express.Router();


router.get("/:eventId/registration", getRegistrationsForEvent);
// router.get("/:eventId/locations", getEventLocations);
router.get("/:id", getEventById);
router.get("/", getAllEvents);
router.post("/by-ids", getEventsByIds);
router.post("/",authorizeRoles('producer'), createEvent);
router.put("/:id",checkOwnership, updateEvent);
router.delete("/:id",checkOwnership, deleteEvent);


export default router;  
