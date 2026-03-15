import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  readNotification,
} from "../features/notifications/notificationActions";
import "../assets/styles/notificationList.scss";

const NotificationList = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notification);
  const user = useSelector((state) => state.auth.currentUser);
  const userId = user?._id;

  // 🔹 Local state for filtering unread notifications
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (userId) dispatch(fetchNotifications(userId));
  }, [userId, dispatch]);

  if (loading) return <p>Loading...</p>;

  // 🔹 Filter notifications based on the toggle
  const displayedNotifications = showUnreadOnly
    ? notifications.filter((notif) => !notif.read)
    : notifications;

  return (
    <div className="page-wrapper">
    <div className="notification-container">
      <div className="notification-header">
        <h2>Notifications</h2>
        <label className="toggle-unread">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => setShowUnreadOnly(e.target.checked)}
          />
          Show unread only
        </label>
      </div>

      {displayedNotifications.length === 0 ? (
        <p className="no-notifications">No notifications</p>
      ) : (
        displayedNotifications.map((notif) => (
          <div
            key={notif._id}
            className={`notification-card ${notif.read ? "read" : "unread"}`}
          >
            <div className="notification-message">{notif.message}</div>
            <div className="notification-footer">
              <span className="notification-time">
                {new Date(notif.createdAt).toLocaleString()}
              </span>
              {!notif.read && (
                <button
                  className="mark-read-btn"
                  onClick={() => dispatch(readNotification(notif._id))}
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default NotificationList;
