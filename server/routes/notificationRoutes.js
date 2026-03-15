import express from "express";
import {
  getUserNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { authentication } from "../middleware/authentication.js";

const router = express.Router();

// 🔔 כל ההתראות של משתמש
router.get("/:userId", authentication, getUserNotifications);

// 🔔 יצירת התראה
router.post("/", authentication, createNotification);

// 🔔 סימון כנקראה
router.put("/:id/read", authentication, markAsRead);

// 🔔 מחיקה
router.delete("/:id", authentication, deleteNotification);

export default router;
