import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { fetchEvent, fetchEventsByIds } from '../features/events/eventActions';
import { eventCategories } from '../utils/eventCategories';
import Counter from './Counter';
import '../assets/styles/dashboard.scss';

const COLORS = ['#00bfff', '#ff7f50', '#28a745', '#ffcc00'];

const UserDashboard = () => {
  const dispatch = useDispatch();

  // Redux state
  const user = useSelector((state) => state.auth.currentUser);
  const { eventsById } = useSelector((state) => state.event);
  const { registrationsByEvent } = useSelector((state) => state.registration);

useEffect(() => {
  if (user?.registeredEvents?.length && Object.keys(eventsById).length === 0) {
    dispatch(fetchEventsByIds(user.registeredEvents));
  }
}, [user, eventsById, dispatch]);
const upcomingEvents = useMemo(() => {
  if (!eventsById || !user) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Object.values(eventsById)
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);
}, [eventsById, user]);

  // Categories data for Pie chart
  const categoriesData = useMemo(() => {
    if (!user?.registeredEvents) return [];

    return eventCategories
      .map((category) => ({
        name: category,
        value: user.registeredEvents
          .map((eventId) => eventsById[eventId])
          .filter((event) => event?.category === category).length,
      }))
      .filter((entry) => entry.value > 0);
  }, [user?.registeredEvents, eventsById]);

  // Monthly participation for Line chart
  const monthlyParticipation = {};
  user?.registeredEvents?.forEach((eventId) => {
    const event = eventsById[eventId];
    if (!event) return;

    const month = new Date(event.date).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });

    monthlyParticipation[month] = (monthlyParticipation[month] || 0) + 1;
  });

  const participationData = Object.keys(monthlyParticipation).map((month) => ({
    month,
    events: monthlyParticipation[month],
  }));

  // Total amount spent
  const getAmount = () => {
    return Object.values(eventsById).reduce((total, event) => total + (event.price || 0), 0);
  };

  return (
    <div className="dashboard-content">
      {/* Stats Cards */}
      <section className="stats-cards">
        <div className="card">
          <h2>Total Events</h2>
          <p>
            <Counter value={user?.registeredEvents?.length || 0} />
          </p>
        </div>
        <div className="card">
          <h2>Favorite Events</h2>
          <p>
            <Counter value={user?.favoriteEvents?.length || 0} />
          </p>
        </div>
        <div className="card">
          <h2>Total Amount Spent</h2>
          <p>
            ₪ <Counter value={getAmount()} isCurrency />
          </p>
        </div>
      </section>

      {/* Charts */}
      <section className="charts">
        <div className="chart">
          <h2>Event Categories</h2>
          {categoriesData.length > 0 ? (
            <PieChart width={300} height={300}>
              <Pie
                data={categoriesData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                nameKey="name"
              >
                {categoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <p>No category data available</p>
          )}
        </div>

        <div className="chart">
          <h2>Participation Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={participationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="events" stroke="#00bfff" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Upcoming Events */}
   <section className="upcoming-events">
  <h2>Upcoming Events This Week</h2>

  {upcomingEvents.length === 0 ? (
    <p className="empty-state">No upcoming events.</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Event Name</th>
          <th>Date</th>
          <th>Location</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {upcomingEvents.map((event) => (
          <tr key={event._id}>
            <td>{event.name}</td>
            <td>{new Date(event.date).toLocaleDateString()}</td>
            <td>{event.location?.address || 'TBD'}</td>
            <td>
              {registrationsByEvent[event._id]?.find(
                (reg) => reg.userId === user?._id
              )?.status || 'Pending'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>

    </div>
  );
};

export default UserDashboard;
