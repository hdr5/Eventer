import React, { useState } from "react";
import "../assets/styles/pages/eventDetails.scss";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useEventActions from "../hooks/useEventActions";
import useUserActions from "../hooks/useUserActions";
import { formatDateLabel } from "../utils/dateUtils";

const EventDetails = ({ user }) => {
  const location = useLocation();
  const event = location.state?.event;

  const baseUrl = "http://localhost:3003";
  const images = event?.images?.map(img => img.startsWith("http") ? img : `${baseUrl}${img}`) || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { handleRegister, isRegistered } = useEventActions(event, user);
  const { toggleFavorite, isFavorite } = useUserActions(user);

  const registrations = useSelector(
    state => state.registration.registrationsByEvent[event?._id] || []
  );

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const progressPercentage = Math.min((registrations.length / event.maxParticipants) * 100, 100);

  return (
    <div className="page-wrapper">
      <div className="event-details-page">
        
        {/* Header / Slider */}
        <div className="event-header">
          <div className="image-slider">
            <button className="nav-btn left" onClick={prevImage}>❮</button>
            <img src={images[currentImageIndex]} alt="Event" />
            <button className="nav-btn right" onClick={nextImage}>❯</button>
          </div>

          <button
            className={`heart-btn ${isFavorite(event) ? 'liked' : ''}`}
            onClick={() => toggleFavorite(event)}
          >
            {isFavorite(event) ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Content Card */}
        <div className="event-content">
          <p className="event-category">{event.category}</p>
          <h1 className="event-title">{event.name}</h1>
          <p className="event-description">{event.description}</p>

          <div className="event-info">
            <p className="event-date">{formatDateLabel(event.date)}</p>
            <p className="event-time">{new Date(event.date).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" })}</p>
            <p className="event-location">{event.location?.address || "Location not specified"}</p>
            <p className="event-price">{event?.price === 0 ? "Free" : "₪ " + Number(event?.price).toFixed(2)}</p>
            <p className="event-participants">{registrations.length}/{event.maxParticipants} Participants</p>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
            </div>
            <span className="progress-text">
              {registrations.length >= event.maxParticipants ? "Full" : `${registrations.length}/${event.maxParticipants}`}
            </span>
          </div>

          {/* Register Button */}
          <button className={`register-btn ${isRegistered ? 'cancel' : 'register'}`} onClick={handleRegister}>
            {isRegistered ? "Cancel" : "Register"}
          </button>
        </div>

        {/* Footer */}
        <div className="event-footer">
          <div className="followers">👥 {registrations.length} attending</div>
        </div>

      </div>
    </div>
  );
};

export default EventDetails;