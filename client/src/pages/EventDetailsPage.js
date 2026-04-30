import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { FaMapMarkerAlt } from "react-icons/fa";

import useEventActions from "../hooks/useEventActions";
import useUserActions from "../hooks/useUserActions";
import { useGoogleMaps } from "../hooks/useGoogleMaps";
import { formatDateLabel } from "../utils/dateUtils";
import { fetchEvent } from "../features/events/eventActions";

import "../assets/styles/pages/eventDetails.scss";
import placeholderImg from '../assets/logo2.png';


const EventDetails = ({ user }) => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const { isLoaded, loadError } = useGoogleMaps();

  const eventsById = useSelector(state => state.event.eventsById);
  const eventsList = useSelector(state => state.event.events);

  const eventFromList = useMemo(
    () => eventsList?.find(e => e?._id === id),
    [eventsList, id]
  );

  const event = eventFromList || eventsById?.[id];

  useEffect(() => {
    if (!event) {
      dispatch(fetchEvent(id));
    }
  }, [id, event, dispatch]);

  const baseUrl = process.env.REACT_APP_API_URL;
  const images = event?.images?.map(img => img.startsWith("http") ? img : `${baseUrl}${img}`) || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    handleRegister,
    isRegistered,
    percentage,
    approvedCount,
    maxParticipants,
    isFull
  } = useEventActions(event, user);
  const { toggleFavorite, isFavorite } = useUserActions(user);


  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const coords = event?.location?.geo?.coordinates;
  const lat = coords?.[1];
  const lng = coords?.[0];
  const address = event?.location?.address?.fullAddress;
  const addressNotes = event?.location?.details.notes;
  const url = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&ll=${lat},${lng}`
    : `https://www.google.com/maps?q=${lat},${lng}`;



  if (!event) return <div className="loading">Loading event...</div>;
  if (loadError) return <div>Map failed to load</div>;
  if (!isLoaded) return <div>Loading map...</div>;


  return (
    <div className="page-wrapper">
      <div className="event-details-page">
        <p className="event-title">{event?.name}</p>
        {/* Header / Slider */}
        <div className="event-header">
          <div className="image-slider">
            <button className="nav-btn left" onClick={prevImage}>❮</button>
            <img src={images[currentImageIndex] || placeholderImg} alt="Event" />
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
        <div className="event-layout">

          {/* LEFT */}
          <div className="event-main">

            <div className="event-info-grid">
              <div className="info-card">
                <span>📅</span>
                <div>
                  <div className="label">Date</div>
                  <div className="value">{formatDateLabel(event.date)}</div>
                </div>
              </div>

              <div className="info-card">
                <span>💰</span>
                <div>
                  <div className="label">Price</div>
                  <div className="value">
                    {event.price === 0 ? "Free" : `₪ ${event.price}`}
                  </div>
                </div>
              </div>

              <div className="info-card">
                <span>👥</span>
                <div>
                  <div className="label">Participants</div>
                  <div className="value">
                    {approvedCount}/{maxParticipants}
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="event-section">
              <h3>Description</h3>
              <p>{event.description}</p>
            </div>

            {/* DETAILS */}
            <div className="event-section">
              <h3>Extra Details</h3>
              <div className="details-grid">
                {event.location?.details?.floor && <span>Floor: {event.location.details.floor}</span>}
                {event.location?.details?.entrance && <span>Entrance: {event.location.details.entrance}</span>}
                {event.location?.details?.notes && <span>Notes: {event.location.details.notes}</span>}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="event-side">

            <div className="map-card">
              <div className="map-header">

                <div className="map-address">
                  <FaMapMarkerAlt />
                  <span className="address-text">{address} {addressNotes && ` • ${addressNotes}`}</span>
                </div>
              </div>


              <div className="map-container">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={{ lat, lng }}
                  zoom={17}
                  options={{ disableDefaultUI: true, zoomControl: true }}
                >
                  <Marker position={{ lat, lng }} />
                </GoogleMap>

                <div
                  className="map-overlay"
                  onClick={() => window.open(url, "_blank")}
                >
                  📍 Open in Google Maps
                </div>
              </div>
            </div>
          </div>


        </div>
        {/* ACTION */}
        <button
          className={`register-btn ${isFull ? 'disabled' : isRegistered ? 'cancel' : 'register'}`}
          onClick={handleRegister}
          disabled={isFull}
        >
          {isFull ? "Event Full" : isRegistered ? "Cancel Registration" : "Join Event"}
        </button>
        <footer className="form-footer">
          <div className="details-grid">
            {event.keywords?.map((x, i) => (<span key={i}>{x}</span>))}
          </div>
        </footer>
      </div>

    </div>
  );
};

export default EventDetails;