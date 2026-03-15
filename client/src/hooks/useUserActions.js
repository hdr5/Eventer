// import { useDispatch, useSelector } from "react-redux";
// import { registerForEvent, fetchRegistrationsForEvent } from "../features/registration/registartionActions";
// import { useEffect, useCallback, useMemo } from "react";
// import { addToFavorites, removeFromFavorites } from "../features/user/userActions";

// const useEventActions = (event, userId) => {
//     const dispatch = useDispatch();
//     const status = useSelector((state) => state.event.status);
// const { registrationsByEvent } = useSelector((state) => state.registration);

//     // Check if the user is already registered for the event
//     const isRegistered = useMemo(() => {
//         return registrationsByEvent[event._id]?.some(reg => reg.userId === userId);
//     }, [userId]);
//     const userFavorites = useSelector((state) => state.user.currentUser.favoriteEvents || []);
// const isFavorite = userFavorites.includes(event._id);

// const toggleFavorite = (e) => {
//   e.stopPropagation();
//     if (isFavorite) {
//     dispatch(removeFromFavorites({ eventId: event._id, userId }));
//   } else {
//     dispatch(addToFavorites({ eventId: event._id, userId }));
//   }
// };
//     useEffect(() => {
//         dispatch(fetchRegistrationsForEvent(event._id));
//     }, [dispatch, event._id]);

//     const handleRegister = useCallback((e) => {
//         e.stopPropagation();
//         if (!isRegistered) {
//             dispatch(registerForEvent({ eventId: event._id, userId }));
//         }
//     }, [dispatch, event._id, userId, isRegistered]);

//     return {
//         handleRegister,
//         isRegistered,
//         status, 
//         toggleFavorite,isFavorite
//     };
// };

// export default useEventActions;
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from '../features/auth/authActions';
import { addNotification } from "../features/notifications/notificationActions";

const useUserActions = (user) => {
  const dispatch = useDispatch();
  const favoriteEvents = useSelector(
    (state) => state.auth.currentUser.favoriteEvents || []
  );

  const toggleFavorite = (event) => {
    if (!user) return;

    if (favoriteEvents.includes(event._id)) {
      dispatch(removeFavorite({ eventId: event._id, userId: user._id }));
      dispatch(
        addNotification({
          userId: user._id,
          message: `The event "${event.name}" was removed from your favorites`,
          type: "event",
          read: false,
        })
      );
    } else {
      dispatch(addFavorite({ eventId: event._id, userId: user._id }));
      dispatch(
        addNotification({
          userId: user._id,
          message: `The event "${event.name}" was added to your favorites`,
          type: "event",
          read: false,
        })
      );
    }
  };

  const isFavorite = (event) => favoriteEvents.includes(event._id);

  return {
    toggleFavorite,
    isFavorite,
  };
};

export default useUserActions;
