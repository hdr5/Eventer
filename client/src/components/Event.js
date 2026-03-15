// import React from "react";
// import "../assets/styles/eventStyle.scss";
// import { FaHeart, FaRegHeart, FaClock, FaMapMarkerAlt, FaTag } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import useEventActions from "../hooks/useEventActions";
// import useUserActions from "../hooks/useUserActions";

// const Event = ({ event, user }) => {
//   const navigate = useNavigate();

//   const {
//     handleRegister,
//     isRegistered,
//     isFull,
//     percentage,
//     approvedCount,
//     maxParticipants
//   } = useEventActions(event, user);

//   const { toggleFavorite, isFavorite } = useUserActions(user);

//   const goToDetails = () =>
//     navigate(`/event/${event._id}`, { state: { event } });

//   return (
//     <article className="event-card">

//       {/* IMAGE */}
//       <div className="event-image-wrapper" onClick={goToDetails}>
//         <img
//           src={event.images?.[0]}
//           alt={event.name}
//           className="event-image"
//         />
//         user && {
//           <button
//             className={`favorite-btn ${isFavorite(event) ? "liked" : ""}`}
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleFavorite(event);
//             }}
//           >
//             {isFavorite(event) ? '❤️' : '🤍'}
//           </button>}
//           u &&{
//             <button
//             className={`favorite-btn ${isFavorite(event) ? "liked" : ""}`}
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleFavorite(event);
//             }}
//           >
//             {delete(event) ? '👍' : '🔥'}
//           </button>
//           }
//       </div>

//       {/* CONTENT */}
//       <div className="event-content" onClick={goToDetails}>
//         <h3 className="event-title">{event.name}</h3>

//         <p className="event-meta">
//           <FaClock className="icon" />
//           {new Date(event.date).toLocaleString("en-US", {
//             weekday: "short",
//             hour: "2-digit",
//             minute: "2-digit"
//           })}
//         </p>

//         <p className="event-meta">
//           <FaMapMarkerAlt className="icon" />
//           {event.location?.address || "Location TBD"}
//         </p>

//         <p className="event-meta price">
//           <FaTag className="icon" />
//           ₪{event.price}
//         </p>
//       </div>

//       {/* FOOTER */}
//       <div className="event-footer">

//         <button
//           className={`register-btn ${isFull ? "disabled"
//               : isRegistered ? "cancel"
//                 : "register"
//             }`}
//           disabled={isFull}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleRegister();
//           }}
//         >
//           {isFull ? "Full" : isRegistered ? "Cancel" : "Register"}
//         </button>

//         <div
//           className="progress-ring"
//           style={{ "--progress": percentage }}
//         >
//           <div className="progress-inner">
//             {isFull
//               ? "Full"
//               : `${approvedCount}/${maxParticipants}`}
//           </div>
//         </div>

//       </div>
//     </article>
//   );
// };

// export default Event;

import React from "react";
import "../assets/styles/eventStyle.scss";
import { FaHeart, FaRegHeart, FaClock, FaMapMarkerAlt, FaTag, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { deleteEvent } from "../features/events/eventActions";
import useEventActions from "../hooks/useEventActions";
import useUserActions from "../hooks/useUserActions";

const Event = ({ event, user }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    handleRegister,
    isRegistered,
    isFull,
    percentage,
    approvedCount,
    maxParticipants
  } = useEventActions(event, user);

  const { toggleFavorite, isFavorite } = useUserActions(user);
const location = event.location;

  const goToDetails = () =>
    navigate(`/event/${event._id}`, { state: { event } });

  const isOwner = user && event.owner === user._id;

  const handleDeleteEvent = (e) => {
    e.stopPropagation();

    if (window.confirm("Delete this event?")) {
      dispatch(deleteEvent(event._id));
    }
  };

  return (
    <article className="event-card">

      {/* IMAGE */}
      <div className="event-image-wrapper" onClick={goToDetails}>
        <img
          src={event.images?.[0]}
          alt={event.name}
          className="event-image"
        />

        {/* FAVORITE */}
        {user && (
          <button
            className={`favorite-btn ${isFavorite(event) ? "liked" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(event);
            }}
          >
            {isFavorite(event) ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}

        {/* DELETE (ONLY OWNER) */}
        {isOwner && (
          <button
            className="delete-btn"
            onClick={handleDeleteEvent}
          >
            <FaTrash />
          </button>
        )}

      </div>

      {/* CONTENT */}
      <div className="event-content" onClick={goToDetails}>
        <h3 className="event-title">{event.name}</h3>

        <p className="event-meta">
          <FaClock className="icon" />
          {new Date(event.date).toLocaleString("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>

<p className="event-meta">
  <FaMapMarkerAlt className="icon" />

  {location?.venueName
    ? `${location.venueName}, ${location.city}`
    : `${location?.street} ${location?.buildingNumber}, ${location?.city}`}
</p>
        <p className="event-meta price">
          <FaTag className="icon" />
          ₪{event.price}
        </p>
      </div>

      {/* FOOTER */}
      <div className="event-footer">

        <button
          className={`register-btn ${
            isFull ? "disabled"
              : isRegistered ? "cancel"
              : "register"
          }`}
          disabled={isFull}
          onClick={(e) => {
            e.stopPropagation();
            handleRegister();
          }}
        >
          {isFull ? "Full" : isRegistered ? "Cancel" : "Register"}
        </button>

        <div
          className="progress-ring"
          style={{ "--progress": percentage }}
        >
          <div className="progress-inner">
            {isFull
              ? "Full"
              : `${approvedCount}/${maxParticipants}`}
          </div>
        </div>

      </div>
    </article>
  );
};

export default Event;