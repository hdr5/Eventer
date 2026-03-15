import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../features/user/userActions';
import { fetchEventsByProducer } from '../features/events/eventActions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Counter from './Counter';
import '../assets/styles/dashboard.scss';
import { formatDateLabel } from '../utils/dateUtils.js';
import { fetchRegistrationsForEvent } from '../features/registration/registartionActions.js';

const ProducerDashboard = () => {
  const dispatch = useDispatch();

  // --- Redux state ---
  const user = useSelector((state) => state.auth.currentUser);
  const { eventsByOwner, status: eventsStatus } = useSelector((state) => state.event);
  const { registrationsByEvent } = useSelector((state) => state.registration);

  // --- Fetch user if missing ---
  useEffect(() => {
    if (!user) dispatch(fetchUserData());
  }, [dispatch, user]);

  useEffect(() => {
    if (user && eventsStatus === 'idle') {
      dispatch(fetchEventsByProducer(user._id));
    }
  }, [user, eventsStatus, dispatch]);

  // --- Fetch events only if user exists and events are not loaded ---
  useEffect(() => {
    if (!eventsByOwner?.length) return;

    eventsByOwner.forEach(event => {
      if (!registrationsByEvent[event._id]) {
        dispatch(fetchRegistrationsForEvent(event._id));
      }
    });
  }, [eventsByOwner, registrationsByEvent, dispatch]);

  // --- Upcoming events for this week ---
  const upcomingEvents = useMemo(() => {
    if (!eventsByOwner) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    return eventsByOwner.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= endOfWeek;
    });
  }, [eventsByOwner]);

  // --- Stats helpers ---
  const getTotalTickets = useMemo(() => {
    if (!eventsByOwner) return 0;
    return eventsByOwner.reduce(
      (sum, event) => sum + (registrationsByEvent[event._id]?.length || 0),
      0
    );
  }, [eventsByOwner, registrationsByEvent]);

  const getRevenue = useMemo(() => {
    if (!eventsByOwner) return 0;
    return eventsByOwner.reduce(
      (total, event) => total + ((registrationsByEvent[event._id]?.length || 0) * (event.price || 0)),
      0
    );
  }, [eventsByOwner, registrationsByEvent]);

  // --- Monthly participation chart ---
  const monthlyParticipation = useMemo(() => {
    if (!user || !eventsByOwner) return [];
    const data = {};

    const start = new Date(user.createdAt);
    start.setDate(1); // first day of month
    const now = new Date();

    let current = new Date(start);
    while (current <= now) {
      const month = current.toLocaleString('default', { month: 'short', year: 'numeric' });
      data[month] = 0;
      current.setMonth(current.getMonth() + 1);
    }

    eventsByOwner.forEach((event) => {
      const month = new Date(event.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      data[month] += registrationsByEvent[event._id]?.length || 0;
    });

    return Object.keys(data).map((month) => ({ month, tickets: data[month] }));
  }, [user, eventsByOwner, registrationsByEvent]);

  // --- Loading / empty handling ---
  if (!user || eventsStatus === 'loading') {
    return <p>Loading dashboard...</p>;
  }

  if (!eventsByOwner || eventsByOwner.length === 0) {
    return <p>No events found for this producer.</p>;
  }

  return (
    <div className='dashboard-content'>
      {/* Stats Cards */}
      <section className='stats-cards'>
        <div className='card'>
          <h2>Total Events</h2>
          <p><Counter value={eventsByOwner.length} /></p>
        </div>
        <div className='card'>
          <h2>Total Tickets Sold</h2>
          <p><Counter value={getTotalTickets} /></p>
        </div>
        <div className='card'>
          <h2>Revenue</h2>
          <p>₪ <Counter value={getRevenue} isCurrency /></p>
        </div>
      </section>

      {/* Charts */}
      <section className='charts'>
        <div className='chart'>
          <h2>Ticket Sales Over Time</h2>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={monthlyParticipation}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis domain={[0, Math.max(...monthlyParticipation.map(d => d.tickets), 10)]} tickCount={5} />
              <Tooltip />
              <Line type='monotone' dataKey='tickets' stroke='#00bfff' />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className='recent-activity'>
        <h2>Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <p className="empty-state">No upcoming events.</p>
        ) : (<table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Tickets Sold</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.map((event) => (
              <tr key={event._id}>
                <td>{event.name}</td>
                <td>{formatDateLabel(event.date)}</td>
                <td>{registrationsByEvent[event._id]?.length || 0}</td>
                <td>{registrationsByEvent[event._id]?.length > 0 ? 'Active' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>)}
      </section>
    </div>
  );
};

export default ProducerDashboard;
