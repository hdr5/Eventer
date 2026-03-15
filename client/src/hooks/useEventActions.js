// import { useDispatch, useSelector } from "react-redux";
// import { cancelRegistration, registerForEvent } from "../features/registration/registartionActions";
// import { addFavoriteLocal, removeFavoriteLocal  } from "../features/auth/authSlice";
// import { useMemo } from "react";
// import { addFavorite, removeFavorite } from "../features/auth/authActions";
// import { addNotification } from "../features/notifications/notificationActions";
// import { read } from "xlsx";

// const useEventActions = (event, user) => {
//   const dispatch = useDispatch();

//   // registrations של האירוע
//   const registrations = useSelector(
//     (state) => state.registration.registrationsByEvent?.[event._id] || []
//   );

//   // בדיקה אם המשתמש רשום
//   const registration = useMemo(
//     () => registrations.find((r) => r.userId === user?._id),
//     [registrations, user]
//   );
//   const isRegistered = !!registration;

//   // בדיקה אם האירוע נמצא במועדפים
//   const favoriteEvents = user?.favoriteEvents || [];
//   const isFavorite = favoriteEvents.includes(event._id);

//   const approvedCount = registrations.length;
//   const maxParticipants = event.participants || 0;
//   const percentage =
//     maxParticipants > 0 ? Math.min((approvedCount / maxParticipants) * 100, 100) : 0;
//   const isFull = approvedCount >= maxParticipants && maxParticipants > 0;

//   // פונקציית רישום / ביטול רישום
// const handleRegister = async () => {
//   if (!user) return;

//   try {
//     if (isRegistered) {
//       await dispatch(cancelRegistration(registration._id)).unwrap();

//       await dispatch(addNotification({
//         userId: user._id,
//         message: `You have successfully canceled your registration for "${event.name}"`,
//         type: "event",
//         read: false
//       }));
//     } else {
//       await dispatch(registerForEvent({
//         eventId: event._id,
//         userId: user._id,
//       })).unwrap();

//       await dispatch(addNotification({
//         userId: user._id,
//         message: `You have successfully registered for "${event.name}"`,
//         type: "event",
//         read: false
//       }));
//     }
//   } catch (err) {
//     console.error("Registration error:", err);
//   }
// };


// const handleFavorite = () => {
//   if (!user) return;

//   if (isFavorite) {
//     dispatch(removeFavorite(event._id));
//     dispatch(
//       addNotification({
//         userId: user._id,
//         message: `The event "${event.name}" was removed from your favorites`,
//         type: "event",
//         read: false,
//       })
//     );
//   } else {
//     dispatch(addFavorite(event._id));
//     dispatch(
//       addNotification({
//         userId: user._id,
//         message: `The event "${event.name}" was added to your favorites`,
//         type: "event",
//         read: false,
//       })
//     );
//   }
// };

//   return {
//     handleRegister,
//     handleFavorite,
//     isRegistered,
//     isFavorite,
//     isFull,
//     percentage,
//     approvedCount,
//     maxParticipants,
//   };
// };

// export default useEventActions;
import { useDispatch, useSelector } from "react-redux";
import { cancelRegistration, registerForEvent, fetchRegistrationsForEvent } from "../features/registration/registartionActions";
import { useEffect, useMemo, useCallback } from "react";
import { addNotification } from "../features/notifications/notificationActions";

const useEventActions = (event, user) => {
  const dispatch = useDispatch();

  const registrations = useSelector(
    (state) => state.registration.registrationsByEvent?.[event._id] || []
  );

  // בדיקה אם המשתמש רשום
  const registration = useMemo(
    () => registrations.find((r) => r.userId === user?._id),
    [registrations, user]
  );
  const isRegistered = !!registration;

  // סטטוס אירוע
  const approvedCount = registrations.length;
  const maxParticipants = event.participants || 0;
  const percentage = maxParticipants > 0 ? Math.min((approvedCount / maxParticipants) * 100, 100) : 0;
  const isFull = approvedCount >= maxParticipants && maxParticipants > 0;

  // טעינת הרשמות
  useEffect(() => {
    dispatch(fetchRegistrationsForEvent(event._id));
  }, [dispatch, event._id]);

  const handleRegister = useCallback(async () => {
    if (!user) return;

    try {
      if (isRegistered) {
        await dispatch(cancelRegistration(registration._id)).unwrap();
        await dispatch(addNotification({
          userId: user._id,
          message: `You have successfully canceled your registration for "${event.name}"`,
          type: "event",
          read: false,
        }));
      } else {
        await dispatch(registerForEvent({ eventId: event._id, userId: user._id })).unwrap();
        await dispatch(addNotification({
          userId: user._id,
          message: `You have successfully registered for "${event.name}"`,
          type: "event",
          read: false,
        }));
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  }, [dispatch, event._id, isRegistered, registration, user]);

  return {
    handleRegister,
    isRegistered,
    isFull,
    percentage,
    approvedCount,
    maxParticipants,
  };
};

export default useEventActions;
