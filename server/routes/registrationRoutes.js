import express from "express";
import {
  getRegistrationsForEvent,
  registerForEvent,
  cancelRegistration,
  updatePaymentStatus,
} from "../controllers/registrationController.js";

const router = express.Router();

// 🔹 כל ההרשמות לאירוע
router.get("/event/:eventId", getRegistrationsForEvent);

// 🔹 רישום משתמש לאירוע
router.post("/event/:eventId", registerForEvent);

// 🔹 ביטול רישום
router.delete("/:registrationId", cancelRegistration);

// 🔹 עדכון סטטוס תשלום
router.patch("/:registrationId/payment", updatePaymentStatus);

export default router;
