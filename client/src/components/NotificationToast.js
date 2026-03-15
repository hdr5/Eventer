import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { readNotification } from "../features/notifications/notificationActions";
import "../assets/styles/notificationToast.scss";

const NotificationToast = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);
  const [latestNotif, setLatestNotif] = useState(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  // Show toast when a new unread notification appears
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length) {
      const newest = unread[0]; // pick latest
      setLatestNotif(newest);
      setVisible(true);

      // Clear previous timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Auto-hide after 5 seconds
      timeoutRef.current = setTimeout(() => setVisible(false), 5000);
    }
  }, [notifications]);

  const handleGotIt = () => {
    if (latestNotif) dispatch(readNotification(latestNotif._id));
    setVisible(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  if (!latestNotif || !visible) return null;

  return (
    <div
      className={`notification-toast ${latestNotif.type}`}
      onMouseEnter={() => timeoutRef.current && clearTimeout(timeoutRef.current)}
      onMouseLeave={() => timeoutRef.current = setTimeout(() => setVisible(false), 5000)}
    >
      <span className="toast-message">{latestNotif.message}</span>
      <button className="toast-btn" onClick={handleGotIt}>
        ✓ Got it
      </button>
    </div>
  );
};

export default NotificationToast;
