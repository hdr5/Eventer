import Notification from "../models/notification.js";

// 🔔 שליפת כל ההתראות של משתמש
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification
      .find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("getUserNotifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔔 יצירת התראה חדשה
export const createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const notification = await Notification.create({
      userId,
      message,
      type,
      read: false,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("createNotification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔔 סימון התראה כנקראה
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔔 מחיקת התראה
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndDelete(id);

    res.status(200).json({ id });
  } catch (error) {
    console.error("deleteNotification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
