import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../features/events/eventActions";
import { setError } from "../features/events/eventSlice";
import { connectWebSocket, closeWebSocket } from "../utils/webSocketService";
import Event from "./Event";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert } from "@mui/material";
import "../assets/styles/eventListStyle.scss";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { fetchRegistrationsForEvent } from "../features/registration/registartionActions";
import EventForm from './EventForm';

const EventList = () => {
  const dispatch = useDispatch();
  const { events, status, error } = useSelector((state) => state.event);
  const { registrationsByEvent } = useSelector((state) => state.registration);
  const user = useSelector((state) => state.auth.currentUser);
  const favoriteEvents =
    useSelector((state) => state.auth.currentUser?.favoriteEvents) || [];

  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({ location: "", organizer: "", keyword: "" });
  const [sortConfig, setSortConfig] = useState({ key: "name", order: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const maxRetries = 3;
  const eventsPerPage = 5;

  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category") || "All";
  const showFavoritesOnly = queryParams.get("filter") === "favorites";

  useEffect(() => {
    //status === "idle" &&
    if ((!events || events.length === 0)) {
      console.log("📡 Fetching events...");
      dispatch(fetchEvents())
        .unwrap()
        .then((data) => console.log("✅ Got events:", data))
        .catch((err) => console.error("❌ Error fetching:", err));
    }
    connectWebSocket(dispatch);
    return () => closeWebSocket();
  }, [dispatch]);

  useEffect(() => {
    events.forEach((event) => {
      dispatch(fetchRegistrationsForEvent(event._id));
    });
  }, [events, dispatch]);

  useEffect(() => {
    if (error && retryCount < maxRetries) {
      setTimeout(() => {
        dispatch(fetchEvents());
        setRetryCount((prev) => prev + 1);
      }, 3000);
    }
  }, [error, retryCount, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      order: prevConfig.key === key ? (prevConfig.order === "asc" ? "desc" : "asc") : "asc",
    }));
    setCurrentPage(1);
  };

  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    // console.log('--------------', favoriteEvents);

    const matchesFilters =
      (!filters.location ||
        event.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.organizer ||
        event.organizer?.toLowerCase().includes(filters.organizer.toLowerCase())) &&
      (!filters.keyword ||
        event.name?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        event.description?.toLowerCase().includes(filters.keyword.toLowerCase()));

    const matchesFavorites = !showFavoritesOnly || favoriteEvents.includes(event._id);

    return matchesCategory && matchesFilters && matchesFavorites;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortConfig.key === "price") {
      return sortConfig.order === "asc" ? a.price - b.price : b.price - a.price;
    }
    return sortConfig.order === "asc"
      ? a[sortConfig.key].localeCompare(b[sortConfig.key])
      : b[sortConfig.key].localeCompare(a[sortConfig.key]);
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (status === "loading") return <div className="mui_elements"><CircularProgress /></div>;
  if (status === "failed") return <div className="mui_elements"><Alert severity="error">{error}</Alert></div>;

  return (
    <>
      <div className="events-page">
        <div className="filter-section">
          <input
            type="text"
            name="keyword"
            placeholder="Search by name or description"
            value={filters.keyword}
            onChange={handleFilterChange}
          />
          <label onClick={() => handleSortChange("name")}>
            Sort by Name {sortConfig.key === "name" && (sortConfig.order === "asc" ? <FaSortUp /> : <FaSortDown />)}
          </label>
          <label onClick={() => handleSortChange("price")}>
            Sort by Price {sortConfig.key === "price" && (sortConfig.order === "asc" ? <FaSortUp /> : <FaSortDown />)}
          </label>
        </div>

        <div className="event-list-container">
          <div className="event-grid">
            {currentEvents.map((event) => {
              const eventRegistrations = registrationsByEvent?.[event._id]?.list || [];
              return (
                <Event
                  key={event._id}
                  event={event}
                  user={user}
                  registrations={eventRegistrations}
                // onEdit={handleEdit}
                />
              );
            })}
          </div>
        </div>
      </div>

      <button className="add-event-button" onClick={() => setShowModal(true)}>+</button>

      <div className="pagination">
        {Array.from({ length: Math.ceil(sortedEvents.length / eventsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            <EventForm closeModal={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default EventList;
